/* ============================================================
   NEXA Studio — Import Normaliser
   Turns an arbitrary uploaded/pasted HTML landing page into a
   document the Studio editor can drive: sanitised (no scripts),
   sections unwrapped so the section list is meaningful, lazy images
   promoted, JS-driven reveal animations neutralised (so nothing stays
   invisible once scripts are stripped), and the NEXA runtime injected.

   Pure browser code, no dependencies. Exposed as window.NEXAImport.
   ============================================================ */
(function () {
  'use strict';

  var SECTION_TAGS = ['SECTION', 'NAV', 'FOOTER', 'HEADER', 'ASIDE', 'DIV', 'MAIN', 'ARTICLE'];
  var WRAPPER_TAGS = ['DIV', 'MAIN', 'BODY'];

  // Selectors for elements common animation libraries start hidden (opacity:0 /
  // transform / visibility:hidden) and reveal via JS on scroll. With scripts
  // stripped they'd stay invisible, so we force them visible.
  var REVEAL_SEL = [
    '.reveal', '.reveal.in', '[data-aos]', '.aos-init', '[data-scroll]', '[data-sr]',
    '.fade', '.fade-in', '.fade-up', '.fade-down', '.fade-left', '.fade-right',
    '.slide-up', '.slide-in', '.animate', '.animated', '.will-animate', '.to-animate',
    '.scroll-animate', '.scroll-reveal', '.sr-item', '.wow', '.js-reveal',
    '.inview', '.in-view', '.is-visible', '.appear', '.animate-on-scroll'
  ].join(',');

  var UNHIDE_CSS =
    '/* NEXA import: neutralise JS-driven reveal animations (page scripts were stripped) */\n' +
    REVEAL_SEL + '{opacity:1 !important;transform:none !important;visibility:visible !important;' +
    'filter:none !important;animation:none !important;transition:none !important;clip:auto !important;}\n' +
    'html{scroll-behavior:auto !important;}';

  function stripDangerous(doc) {
    Array.prototype.slice.call(doc.querySelectorAll('script')).forEach(function (s) { s.remove(); });
    Array.prototype.slice.call(doc.querySelectorAll('*')).forEach(function (el) {
      Array.prototype.slice.call(el.attributes || []).forEach(function (a) {
        var n = a.name.toLowerCase();
        if (n.indexOf('on') === 0) el.removeAttribute(a.name);
        if ((n === 'href' || n === 'src' || n === 'xlink:href') && /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
      });
    });
    Array.prototype.slice.call(doc.querySelectorAll('base')).forEach(function (b) { b.remove(); });
    Array.prototype.slice.call(doc.querySelectorAll('noscript')).forEach(function (n) { n.remove(); });
  }

  // Promote lazy-loaded images (data-src / data-srcset / data-bg …) to real
  // src/srcset/background so they load without the page's lazy-load script.
  function promoteLazy(doc) {
    Array.prototype.slice.call(doc.querySelectorAll('img, source')).forEach(function (el) {
      var ds = el.getAttribute('data-src') || el.getAttribute('data-lazy-src') || el.getAttribute('data-original') || el.getAttribute('data-lazy');
      if (ds) el.setAttribute('src', ds); // real image replaces any LQIP/placeholder in src
      var dss = el.getAttribute('data-srcset') || el.getAttribute('data-lazy-srcset');
      if (dss) el.setAttribute('srcset', dss);
      // Drop the lazy sentinel attrs; and eager-load in the editor so nothing
      // stays blank in an un-scrolled canvas (the page can re-add lazy on export).
      ['data-src', 'data-lazy-src', 'data-original', 'data-lazy', 'data-srcset', 'data-lazy-srcset'].forEach(function (a) { el.removeAttribute(a); });
      if (el.tagName === 'IMG') el.removeAttribute('loading');
    });
    Array.prototype.slice.call(doc.querySelectorAll('[data-bg],[data-background],[data-background-image]')).forEach(function (el) {
      var bg = el.getAttribute('data-bg') || el.getAttribute('data-background') || el.getAttribute('data-background-image');
      if (bg) el.style.backgroundImage = "url('" + bg + "')";
    });
  }

  function rebase(v, base) {
    if (!v || /^(https?:|data:|mailto:|tel:|#|\/\/)/i.test(v)) return v;
    try { return new URL(v, base).href; } catch (e) { return v; }
  }
  function rebaseCss(css, base) {
    return String(css).replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, function (m, q, u) {
      return 'url(' + q + rebase(u.trim(), base) + q + ')';
    });
  }

  function absolutise(doc, sourceUrl) {
    if (!sourceUrl) return;
    var base;
    try { base = new URL(sourceUrl); } catch (e) { return; }
    Array.prototype.slice.call(doc.querySelectorAll('img[src],source[src]')).forEach(function (el) { el.setAttribute('src', rebase(el.getAttribute('src'), base)); });
    Array.prototype.slice.call(doc.querySelectorAll('[srcset]')).forEach(function (el) {
      el.setAttribute('srcset', (el.getAttribute('srcset') || '').split(',').map(function (p) {
        var seg = p.trim().split(/\s+/); if (seg[0]) seg[0] = rebase(seg[0], base); return seg.join(' ');
      }).join(', '));
    });
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"][href]')).forEach(function (el) { el.setAttribute('href', rebase(el.getAttribute('href'), base)); });
    Array.prototype.slice.call(doc.querySelectorAll('style')).forEach(function (el) { el.textContent = rebaseCss(el.textContent, base); });
    Array.prototype.slice.call(doc.querySelectorAll('[style*="url("]')).forEach(function (el) { el.setAttribute('style', rebaseCss(el.getAttribute('style'), base)); });
  }

  // Count assets that still point at relative paths (they will 404 in the editor
  // unless the user gives a Source URL) so import.html can warn clearly.
  function countRelative(doc) {
    var n = 0;
    Array.prototype.slice.call(doc.querySelectorAll('img[src]')).forEach(function (el) { if (isRel(el.getAttribute('src'))) n++; });
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"][href]')).forEach(function (el) { if (isRel(el.getAttribute('href'))) n++; });
    return n;
  }
  function isRel(v) { return v && !/^(https?:|data:|\/\/)/i.test(v); }

  function unwrap(body) {
    var guard = 0;
    while (guard++ < 4) {
      var kids = Array.prototype.filter.call(body.childNodes, function (n) {
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
      });
      if (kids.length !== 1 || kids[0].nodeType !== 1) break;
      var only = kids[0];
      if (WRAPPER_TAGS.indexOf(only.tagName) === -1) break;
      var blockChildren = Array.prototype.filter.call(only.children, function (c) { return SECTION_TAGS.indexOf(c.tagName) > -1; });
      if (blockChildren.length < 2) break;
      while (only.firstChild) body.appendChild(only.firstChild);
      body.removeChild(only);
    }
  }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /**
   * normalise(rawHtml, opts) -> { html, title, stats }
   *  opts: { sourceUrl, name }
   */
  function normalise(rawHtml, opts) {
    opts = opts || {};
    var doc = new DOMParser().parseFromString(rawHtml, 'text/html');

    stripDangerous(doc);
    promoteLazy(doc);
    absolutise(doc, opts.sourceUrl);
    unwrap(doc.body);

    var title = (doc.querySelector('title') && doc.querySelector('title').textContent.trim()) || opts.name || 'Imported page';
    var headParts = [];
    headParts.push('<meta charset="utf-8">');
    var vp = doc.querySelector('meta[name="viewport"]');
    headParts.push(vp ? vp.outerHTML : '<meta name="viewport" content="width=device-width, initial-scale=1">');
    headParts.push('<title>' + esc(title) + '</title>');
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"], style')).forEach(function (el) { headParts.push(el.outerHTML); });
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="preconnect"], link[href*="fonts.googleapis"], link[href*="fonts.gstatic"]')).forEach(function (el) { headParts.push(el.outerHTML); });
    // Un-hide override must come LAST so it wins over the page's reveal rules.
    headParts.push('<style>' + UNHIDE_CSS + '</style>');

    var stats = {
      sections: Array.prototype.filter.call(doc.body.children, function (el) { return SECTION_TAGS.indexOf(el.tagName) > -1; }).length,
      images: doc.body.querySelectorAll('img').length,
      forms: doc.body.querySelectorAll('form').length,
      headings: doc.body.querySelectorAll('h1,h2,h3,h4').length,
      revealFixed: doc.body.querySelectorAll(REVEAL_SEL).length,
      relativeAssets: opts.sourceUrl ? 0 : countRelative(doc)
    };

    var out =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
      headParts.join('\n') +
      '\n<style>[data-nexa-imported] *{cursor:default}</style>\n</head>\n<body data-nexa-imported="1">\n' +
      doc.body.innerHTML +
      '\n<script src="/templates/_shared/kit.js"><\/script>\n</body>\n</html>';

    return { html: out, title: title, stats: stats };
  }

  window.NEXAImport = { normalise: normalise };
})();
