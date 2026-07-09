/* ============================================================
   NEXA Studio — HTML → HubSpot modules converter
   Splits a finished page into ONE HubSpot custom module per
   top-level section (hero, features, CTA, footer …). Each module
   is a .module folder — module.html with HubL editable fields,
   fields.json, meta.json, module.css — packaged together in one zip.

   Pure browser code, no dependencies. Exposed as window.NEXAHubSpot.
   ============================================================ */
(function () {
  'use strict';

  var SECTION_TAGS = ['SECTION', 'NAV', 'FOOTER', 'HEADER', 'ASIDE', 'DIV', 'MAIN', 'ARTICLE'];

  function slug(s, fallback) {
    var v = String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32);
    return v || (fallback || 'section');
  }
  function slugField(s, fallback) {
    var v = String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 32);
    return v || (fallback || 'field');
  }
  function cap(s) { return (s || '').charAt(0).toUpperCase() + (s || '').slice(1); }

  function isButton(el) {
    if (el.tagName === 'BUTTON') return true;
    var c = ' ' + (el.className || '') + ' ';
    if (/\b(btn|button|cta|nx-btn)\b/i.test(c)) return true;
    if (el.getAttribute('role') === 'button') return true;
    return false;
  }

  // A human label for a section, used for the module name + meta label.
  function labelFor(el, i) {
    if (el.tagName === 'NAV') return 'Navigation';
    if (el.tagName === 'HEADER') return 'Header';
    if (el.tagName === 'FOOTER') return 'Footer';
    var c = ' ' + (el.className || '') + ' ';
    if (/\bhero\b/i.test(c)) return 'Hero';
    if (/\bfeature|benefit\b/i.test(c)) return 'Features';
    if (/\bcta\b/i.test(c)) return 'CTA';
    if (/\bfooter\b/i.test(c)) return 'Footer';
    if (/\bpricing\b/i.test(c)) return 'Pricing';
    if (/\btestimonial|review\b/i.test(c)) return 'Testimonials';
    var h = el.querySelector && el.querySelector('h1,h2,h3');
    if (h && h.textContent.trim()) return h.textContent.trim().slice(0, 26);
    if (el.id) return cap(el.id.replace(/[-_]/g, ' '));
    return 'Section ' + (i + 1);
  }

  // Turn the editable content of a root element into HubL tokens; returns the field defs.
  // Mutates `root` in place. Field names are unique within this module.
  function tokenise(root, doc) {
    var fields = [];
    var used = Object.create(null);
    function uniq(base) { var n = base, i = 2; while (used[n]) { n = base + '_' + i; i++; } used[n] = true; return n; }
    var processed = new WeakSet();

    // Images → image field
    Array.prototype.slice.call(root.querySelectorAll('img')).forEach(function (img, i) {
      var alt = img.getAttribute('alt') || '';
      var name = uniq('image_' + (slugField(alt, '') || (i + 1)));
      fields.push({ name: name, label: 'Image' + (alt ? ' — ' + alt.slice(0, 24) : ' ' + (i + 1)), type: 'image',
        'default': { src: img.getAttribute('src') || '', alt: alt, loading: 'lazy' } });
      img.setAttribute('src', '{{ module.' + name + '.src }}');
      img.setAttribute('alt', '{{ module.' + name + '.alt }}');
      processed.add(img);
    });

    // Buttons / CTAs → url + text
    Array.prototype.slice.call(root.querySelectorAll('a, button')).forEach(function (el) {
      if (!isButton(el)) return;
      var label = (el.textContent || '').trim();
      if (!label) return;
      var base = slugField(label, 'cta');
      var urlName = uniq('cta_' + base + '_url');
      var txtName = uniq('cta_' + base + '_text');
      fields.push({ name: urlName, label: 'Button link — ' + label.slice(0, 20), type: 'url',
        'default': { href: el.getAttribute('href') || '#', type: 'EXTERNAL' } });
      fields.push({ name: txtName, label: 'Button text — ' + label.slice(0, 20), type: 'text', 'default': label });
      if (el.tagName === 'A') el.setAttribute('href', '{{ module.' + urlName + '.href }}');
      el.textContent = '';
      el.appendChild(doc.createTextNode('{{ module.' + txtName + ' }}'));
      processed.add(el);
      Array.prototype.slice.call(el.querySelectorAll('*')).forEach(function (d) { processed.add(d); });
    });

    // Headings + paragraphs → text / richtext
    Array.prototype.slice.call(root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,blockquote,li')).forEach(function (el) {
      if (processed.has(el)) return;
      var anc = el.parentNode, skip = false;
      while (anc && anc !== root && anc !== doc.body) { if (processed.has(anc)) { skip = true; break; } anc = anc.parentNode; }
      if (skip) return;
      var txt = (el.textContent || '').trim();
      if (!txt) return;
      var tag = el.tagName.toLowerCase();
      var kind = (/^h[1-6]$/.test(tag)) ? 'heading' : (tag === 'li' ? 'item' : 'text');
      var name = uniq(kind + '_' + slugField(txt, ''));
      if (el.children.length > 0) {
        fields.push({ name: name, label: cap(kind) + ' — ' + txt.slice(0, 24), type: 'richtext', 'default': el.innerHTML });
      } else {
        fields.push({ name: name, label: cap(kind) + ' — ' + txt.slice(0, 24), type: 'text', 'default': txt });
      }
      el.innerHTML = '{{ module.' + name + ' }}';
      processed.add(el);
    });

    return fields;
  }

  function metaFor(label) {
    return {
      label: label,
      css_assets: [], external_js: [], global: false,
      help_text: 'Imported into HubSpot from NEXA Web Studio.',
      host_template_types: ['PAGE', 'BLOG_POST'],
      js_assets: [], other_assets: [], smart_type: 'NOT_SMART', tags: [],
      is_available_for_new_content: true,
      content_types: ['LANDING_PAGE', 'SITE_PAGE']
    };
  }

  /**
   * convert(pageHtml, opts) -> { modules:[{folder,label,fields,moduleHtml,moduleCss}], files:[{name,data}], zipName, moduleCount, fieldCount }
   *   opts: { name }
   */
  function convert(pageHtml, opts) {
    opts = opts || {};
    var doc = new DOMParser().parseFromString(pageHtml, 'text/html');

    // Page-level CSS (shared) + external stylesheet/font links.
    var cssParts = [];
    Array.prototype.slice.call(doc.querySelectorAll('style')).forEach(function (s) {
      if (/data-nexa-imported/.test(s.textContent)) return;
      cssParts.push(s.textContent);
    });
    var pageCss = cssParts.join('\n\n').trim();
    var linkTags = [];
    Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"], link[href*="fonts.googleapis"], link[rel="preconnect"]')).forEach(function (l) {
      linkTags.push(l.outerHTML);
    });

    // Clean editor artefacts before splitting.
    Array.prototype.slice.call(doc.querySelectorAll('script, style')).forEach(function (s) { s.remove(); });
    Array.prototype.slice.call(doc.querySelectorAll('.nx-selected, .nx-edit-focus')).forEach(function (el) {
      el.classList.remove('nx-selected'); el.classList.remove('nx-edit-focus');
      if (!el.getAttribute('class')) el.removeAttribute('class');
    });

    // Top-level sections → one module each.
    var sections = Array.prototype.filter.call(doc.body.children, function (el) {
      return SECTION_TAGS.indexOf(el.tagName) > -1 && (el.textContent.trim() || el.querySelector('img'));
    });
    if (!sections.length) sections = [doc.body]; // fallback: whole body as one module

    var pageSlug = slug(opts.name || (doc.querySelector('title') && doc.querySelector('title').textContent) || 'page', 'page');
    var usedFolders = Object.create(null);
    function folderName(base) { var n = base, i = 2; while (usedFolders[n]) { n = base + '-' + i; i++; } usedFolders[n] = true; return n; }

    var modules = [];
    var files = [];
    var totalFields = 0;

    sections.forEach(function (sec, i) {
      var label = labelFor(sec, i);
      var folder = folderName(slug(label, 'section-' + (i + 1))) + '.module';
      var clone = sec.cloneNode(true);
      var fields = tokenise(clone, doc);
      totalFields += fields.length;

      var moduleHtml =
        '{# ' + label + ' — module ' + (i + 1) + ' of ' + sections.length + ', generated by NEXA Web Studio #}\n' +
        (linkTags.length ? linkTags.join('\n') + '\n' : '') +
        clone.outerHTML.trim() + '\n';
      // Each module carries the page CSS so it renders standalone in HubSpot.
      var moduleCss = pageCss + '\n';

      modules.push({ folder: folder, label: label, fields: fields, moduleHtml: moduleHtml, moduleCss: moduleCss });
      files.push({ name: folder + '/module.html', data: moduleHtml });
      files.push({ name: folder + '/module.css', data: moduleCss });
      files.push({ name: folder + '/fields.json', data: JSON.stringify(fields, null, 2) });
      files.push({ name: folder + '/meta.json', data: JSON.stringify(metaFor(label), null, 2) });
    });

    // A short README so whoever uploads knows the CSS note + the hs upload step.
    files.push({ name: 'README.txt', data:
      'NEXA Web Studio — HubSpot modules for "' + (opts.name || 'page') + '"\n' +
      '========================================================\n\n' +
      modules.length + ' modules, one per page section:\n' +
      modules.map(function (m) { return '  - ' + m.folder + '  (' + m.fields.length + ' editable fields)'; }).join('\n') + '\n\n' +
      'Upload each .module folder to HubSpot:\n' +
      '  hs upload <folder>.module <folder>.module\n' +
      '(or import the folders in HubSpot Design Tools).\n\n' +
      'Note: each module bundles the full page CSS so it renders standalone.\n' +
      'For a production theme, move shared CSS into a theme stylesheet and\n' +
      'trim each module.css to the rules it needs.\n'
    });

    return { modules: modules, files: files, zipName: pageSlug + '-hubspot-modules.zip', moduleCount: modules.length, fieldCount: totalFields };
  }

  window.NEXAHubSpot = { convert: convert };
})();
