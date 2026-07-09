/* ============================================================
   NEXA Studio — Import Normaliser
   Turns an arbitrary uploaded/pasted HTML landing page into a
   document the Studio editor can drive: sanitised (no scripts),
   sections unwrapped so the section list is meaningful, and the
   NEXA runtime (kit.js) injected so click-to-edit / get-html work.

   Pure browser code, no dependencies. Exposed as window.NEXAImport.
   ============================================================ */
(function () {
  'use strict';

  // Block-level tags the editor treats as top-level "sections".
  var SECTION_TAGS = ['SECTION', 'NAV', 'FOOTER', 'HEADER', 'ASIDE', 'DIV', 'MAIN', 'ARTICLE'];
  // Single wrappers we unwrap so their children become the sections.
  var WRAPPER_TAGS = ['DIV', 'MAIN', 'BODY'];

  function stripDangerous(doc) {
    // Remove all scripts — a srcdoc iframe shares the editor origin, so any
    // imported <script> could reach into the editor. Never execute foreign JS.
    Array.prototype.slice.call(doc.querySelectorAll('script')).forEach(function (s) { s.remove(); });
    // Remove inline event handlers and javascript: URLs.
    Array.prototype.slice.call(doc.querySelectorAll('*')).forEach(function (el) {
      Array.prototype.slice.call(el.attributes || []).forEach(function (a) {
        var n = a.name.toLowerCase();
        if (n.indexOf('on') === 0) el.removeAttribute(a.name);
        if ((n === 'href' || n === 'src' || n === 'xlink:href') && /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
      });
    });
    // Drop <base> — we want relative asset URLs resolved against the imported origin, not /templates/.
    Array.prototype.slice.call(doc.querySelectorAll('base')).forEach(function (b) { b.remove(); });
    // Noscript can carry markup we don't want doubled up.
    Array.prototype.slice.call(doc.querySelectorAll('noscript')).forEach(function (n) { n.remove(); });
  }

  // Rebase relative asset URLs to absolute using the page's source URL (if the
  // user gave one), so images/backgrounds still load inside the editor.
  function absolutise(doc, sourceUrl) {
    if (!sourceUrl) return;
    var base;
    try { base = new URL(sourceUrl); } catch (e) { return; }
    function fix(el, attr) {
      var v = el.getAttribute(attr);
      if (!v || /^(https?:|data:|mailto:|tel:|#|\/\/)/i.test(v)) return;
      try { el.setAttribute(attr, new URL(v, base).href); } catch (e) {}
    }
    Array.prototype.slice.call(doc.querySelectorAll('img[src]')).forEach(function (el) { fix(el, 'src'); });
    Array.prototype.slice.call(doc.querySelectorAll('img[srcset],source[srcset]')).forEach(function (el) {
      var v = el.getAttribute('srcset');
      if (!v) return;
      el.setAttribute('srcset', v.split(',').map(function (part) {
        var seg = part.trim().split(/\s+/);
        if (seg[0] && !/^(https?:|data:|\/\/)/i.test(seg[0])) { try { seg[0] = new URL(seg[0], base).href; } catch (e) {} }
        return seg.join(' ');
      }).join(', '));
    });
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"][href]')).forEach(function (el) { fix(el, 'href'); });
  }

  // If the body is one big wrapper (or nested wrappers) with a single block
  // child, hoist its children up so the editor's section list is useful.
  function unwrap(body) {
    var guard = 0;
    while (guard++ < 4) {
      var kids = Array.prototype.filter.call(body.childNodes, function (n) {
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
      });
      if (kids.length !== 1 || kids[0].nodeType !== 1) break;
      var only = kids[0];
      if (WRAPPER_TAGS.indexOf(only.tagName) === -1) break;
      // Only unwrap if the wrapper itself holds several block children worth exposing.
      var blockChildren = Array.prototype.filter.call(only.children, function (c) {
        return SECTION_TAGS.indexOf(c.tagName) > -1;
      });
      if (blockChildren.length < 2) break;
      while (only.firstChild) body.appendChild(only.firstChild);
      body.removeChild(only);
    }
  }

  /**
   * normalise(rawHtml, opts) -> { html, title, stats }
   *  opts: { sourceUrl, name }
   *  html: a full self-contained document string ready for iframe.srcdoc.
   */
  function normalise(rawHtml, opts) {
    opts = opts || {};
    var parser = new DOMParser();
    var doc = parser.parseFromString(rawHtml, 'text/html');

    stripDangerous(doc);
    absolutise(doc, opts.sourceUrl);
    unwrap(doc.body);

    // Collect the head bits we keep: title, charset, viewport, styles, stylesheet links.
    var title = (doc.querySelector('title') && doc.querySelector('title').textContent.trim()) || opts.name || 'Imported page';
    var headParts = [];
    headParts.push('<meta charset="utf-8">');
    var vp = doc.querySelector('meta[name="viewport"]');
    headParts.push(vp ? vp.outerHTML : '<meta name="viewport" content="width=device-width, initial-scale=1">');
    headParts.push('<title>' + esc(title) + '</title>');
    // Preserve external + inline styles so the imported look survives.
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"], style')).forEach(function (el) {
      headParts.push(el.outerHTML);
    });
    // Preserve font <link>s (Google Fonts etc.).
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="preconnect"], link[href*="fonts.googleapis"], link[href*="fonts.gstatic"]')).forEach(function (el) {
      headParts.push(el.outerHTML);
    });

    var stats = {
      sections: Array.prototype.filter.call(doc.body.children, function (el) { return SECTION_TAGS.indexOf(el.tagName) > -1; }).length,
      images: doc.body.querySelectorAll('img').length,
      forms: doc.body.querySelectorAll('form').length,
      headings: doc.body.querySelectorAll('h1,h2,h3,h4').length
    };

    // kit.js (absolute path) provides ready/select/get-html; kit.css is NOT
    // injected so we never clobber the imported design system.
    var out =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
      headParts.join('\n') +
      '\n<style>[data-nexa-imported] *{cursor:default}</style>\n</head>\n<body data-nexa-imported="1">\n' +
      doc.body.innerHTML +
      '\n<script src="/templates/_shared/kit.js"><\/script>\n</body>\n</html>';

    return { html: out, title: title, stats: stats };
  }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  window.NEXAImport = { normalise: normalise };
})();
