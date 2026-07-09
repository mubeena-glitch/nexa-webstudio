/* ============================================================
   NEXA Studio — Minimal ZIP writer (store / no compression)
   Enough to package a HubSpot .module folder client-side with no
   dependencies and no network. Produces a valid ZIP a Blob can hold.
   Usage: NEXAZip.make([{name:'a.module/meta.json', data:'{...}'}]) -> Uint8Array
   ============================================================ */
(function () {
  'use strict';

  // CRC-32 (IEEE 802.3), table built once.
  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function utf8(str) { return new TextEncoder().encode(str); }

  function u16(n) { return [n & 0xFF, (n >>> 8) & 0xFF]; }
  function u32(n) { return [n & 0xFF, (n >>> 8) & 0xFF, (n >>> 16) & 0xFF, (n >>> 24) & 0xFF]; }

  // Build a ZIP from [{name, data}] where data is a string or Uint8Array.
  function make(entries) {
    var chunks = [];      // Array of byte arrays for the whole file
    var central = [];     // central-directory records
    var offset = 0;

    entries.forEach(function (e) {
      var nameBytes = utf8(e.name);
      var dataBytes = (typeof e.data === 'string') ? utf8(e.data) : e.data;
      var crc = crc32(dataBytes);
      var size = dataBytes.length;

      // Local file header
      var local = [].concat(
        u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0),  // sig, ver, flag(utf8), method(store), time, date
        u32(crc), u32(size), u32(size), u16(nameBytes.length), u16(0)
      );
      var localHeader = new Uint8Array(local);
      chunks.push(localHeader, nameBytes, dataBytes);

      // Central directory record
      var cen = [].concat(
        u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
        u32(crc), u32(size), u32(size),
        u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0),
        u32(offset)
      );
      central.push({ head: new Uint8Array(cen), name: nameBytes });

      offset += localHeader.length + nameBytes.length + dataBytes.length;
    });

    var centralStart = offset;
    var centralSize = 0;
    central.forEach(function (c) {
      chunks.push(c.head, c.name);
      centralSize += c.head.length + c.name.length;
    });

    // End of central directory
    var eocd = new Uint8Array([].concat(
      u32(0x06054b50), u16(0), u16(0), u16(entries.length), u16(entries.length),
      u32(centralSize), u32(centralStart), u16(0)
    ));
    chunks.push(eocd);

    // Flatten
    var total = chunks.reduce(function (a, c) { return a + c.length; }, 0);
    var out = new Uint8Array(total);
    var pos = 0;
    chunks.forEach(function (c) { out.set(c, pos); pos += c.length; });
    return out;
  }

  window.NEXAZip = { make: make };
})();
