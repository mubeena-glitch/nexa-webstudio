/* ============================================================
   NEXA Studio — HTML → HubSpot module converter
   Takes a finished page's HTML and produces the files of a HubSpot
   custom module (.module folder): module.html with HubL editable
   fields, fields.json, meta.json, module.css. Packaged as a zip by
   the caller (lib/zip.js).

   Pure browser code, no dependencies. Exposed as window.NEXAHubSpot.
   ============================================================ */
(function () {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slug(s, fallback) {
    var v = String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 32);
    return v || (fallback || 'field');
  }

  // Is this <a>/<button> a call-to-action (vs a plain nav/text link)?
  function isButton(el) {
    if (el.tagName === 'BUTTON') return true;
    var c = ' ' + (el.className || '') + ' ';
    if (/\b(btn|button|cta|nx-btn)\b/i.test(c)) return true;
    if (el.getAttribute('role') === 'button') return true;
    return false;
  }

  /**
   * convert(pageHtml, opts) -> { files: [{name,data}], moduleName, fieldCount }
   *   opts: { name }  (used for the module label + folder name)
   */
  function convert(pageHtml, opts) {
    opts = opts || {};
    var doc = new DOMParser().parseFromString(pageHtml, 'text/html');

    // ---- 1. Pull styles out into module.css; keep external stylesheet + font links ----
    var cssParts = [];
    Array.prototype.slice.call(doc.querySelectorAll('style')).forEach(function (s) {
      // Skip the tiny cursor helper the importer injects.
      if (/data-nexa-imported/.test(s.textContent)) { s.remove(); return; }
      cssParts.push(s.textContent);
      s.remove();
    });
    var linkTags = [];
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"], link[href*="fonts.googleapis"], link[rel="preconnect"]')).forEach(function (l) {
      linkTags.push(l.outerHTML);
    });

    // ---- 2. Clean editor / import artefacts from the body ----
    Array.prototype.slice.call(doc.querySelectorAll('script')).forEach(function (s) { s.remove(); });
    doc.body.removeAttribute('data-nexa-imported');
    Array.prototype.slice.call(doc.querySelectorAll('.nx-selected, .nx-edit-focus')).forEach(function (el) {
      el.classList.remove('nx-selected'); el.classList.remove('nx-edit-focus');
      if (!el.getAttribute('class')) el.removeAttribute('class');
    });

    // ---- 3. Walk editable content, swap for HubL tokens, collect fields ----
    var fields = [];
    var used = Object.create(null);
    function uniq(base) {
      var n = base, i = 2;
      while (used[n]) { n = base + '_' + i; i++; }
      used[n] = true;
      return n;
    }
    var processed = typeof WeakSet !== 'undefined' ? new WeakSet() : { has: function () { return false; }, add: function () {} };

    // 3a. Images → image field
    Array.prototype.slice.call(doc.body.querySelectorAll('img')).forEach(function (img, i) {
      var src = img.getAttribute('src') || '';
      var alt = img.getAttribute('alt') || '';
      var name = uniq('image_' + (slug(alt, '') || (i + 1)));
      fields.push({ name: name, label: 'Image' + (alt ? ' — ' + alt.slice(0, 24) : ' ' + (i + 1)), type: 'image',
        'default': { src: src, alt: alt, loading: 'lazy' } });
      img.setAttribute('src', '{{ module.' + name + '.src }}');
      img.setAttribute('alt', '{{ module.' + name + '.alt }}');
      processed.add(img);
    });

    // 3b. Buttons / CTAs → url + text field pair
    Array.prototype.slice.call(doc.body.querySelectorAll('a, button')).forEach(function (el, i) {
      if (!isButton(el)) return;
      var label = (el.textContent || '').trim();
      if (!label) return;
      var base = slug(label, 'cta');
      var urlName = uniq('cta_' + base + '_url');
      var txtName = uniq('cta_' + base + '_text');
      fields.push({ name: urlName, label: 'Button link — ' + label.slice(0, 20), type: 'url',
        'default': { href: el.getAttribute('href') || '#', type: 'EXTERNAL' } });
      fields.push({ name: txtName, label: 'Button text — ' + label.slice(0, 20), type: 'text', 'default': label });
      if (el.tagName === 'A') el.setAttribute('href', '{{ module.' + urlName + '.href }}');
      el.textContent = '';
      el.appendChild(doc.createTextNode('{{ module.' + txtName + ' }}'));
      processed.add(el);
      // Mark descendants processed so text pass skips them.
      Array.prototype.slice.call(el.querySelectorAll('*')).forEach(function (d) { processed.add(d); });
    });

    // 3c. Headings + paragraphs → text (pure) or richtext (has inline markup)
    var TEXT_SEL = 'h1,h2,h3,h4,h5,h6,p,blockquote,li';
    Array.prototype.slice.call(doc.body.querySelectorAll(TEXT_SEL)).forEach(function (el) {
      if (processed.has(el)) return;
      // Skip if an ancestor was already turned into a field (avoid nesting tokens).
      var anc = el.parentNode, skip = false;
      while (anc && anc !== doc.body) { if (processed.has(anc)) { skip = true; break; } anc = anc.parentNode; }
      if (skip) return;
      var txt = (el.textContent || '').trim();
      if (!txt) return;
      var hasMarkup = el.children.length > 0;
      var tag = el.tagName.toLowerCase();
      var kind = (/^h[1-6]$/.test(tag)) ? 'heading' : (tag === 'li' ? 'item' : 'text');
      var name = uniq(kind + '_' + slug(txt, ''));
      if (hasMarkup) {
        fields.push({ name: name, label: cap(kind) + ' — ' + txt.slice(0, 24), type: 'richtext', 'default': el.innerHTML });
      } else {
        fields.push({ name: name, label: cap(kind) + ' — ' + txt.slice(0, 24), type: 'text', 'default': txt });
      }
      el.innerHTML = '{{ module.' + name + ' }}';
      processed.add(el);
    });

    // ---- 4. Assemble files ----
    var label = opts.name || (doc.querySelector('title') && doc.querySelector('title').textContent.trim()) || 'Imported Module';
    var folder = slug(label, 'nexa_module');

    var moduleHtml =
      '{# ' + label + ' — generated by NEXA Web Studio. Editable fields are HubL module tokens. #}\n' +
      (linkTags.length ? linkTags.join('\n') + '\n' : '') +
      doc.body.innerHTML.trim() + '\n';

    var moduleCss = cssParts.join('\n\n').trim() + '\n';

    var meta = {
      label: label,
      css_assets: [],
      external_js: [],
      global: false,
      help_text: 'Imported into HubSpot from NEXA Web Studio.',
      host_template_types: ['PAGE', 'BLOG_POST'],
      js_assets: [],
      other_assets: [],
      smart_type: 'NOT_SMART',
      tags: [],
      is_available_for_new_content: true,
      content_types: ['LANDING_PAGE', 'SITE_PAGE']
    };

    var files = [
      { name: folder + '.module/module.html', data: moduleHtml },
      { name: folder + '.module/module.css', data: moduleCss },
      { name: folder + '.module/fields.json', data: JSON.stringify(fields, null, 2) },
      { name: folder + '.module/meta.json', data: JSON.stringify(meta, null, 2) }
    ];

    return { files: files, moduleName: folder + '.module', fieldCount: fields.length };
  }

  function cap(s) { return (s || '').charAt(0).toUpperCase() + (s || '').slice(1); }

  window.NEXAHubSpot = { convert: convert };
})();
