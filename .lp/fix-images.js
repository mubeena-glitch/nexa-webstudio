// One-off: correct image choices / alt text after a visual check of every photo.
// Pool descriptions inherited from older previews did not always match the photo.
const fs = require('fs'), path = require('path');
const P = {
  canyon: 'photo-1469854523086-cc02fe5d8800', dubai: 'photo-1512453979798-5ea266f8880c', villaPool: 'photo-1520250497591-112f2f40a3f4',
  palmPool: 'photo-1596178065887-1198b6148b2b', resortRoof: 'photo-1566073771259-6a8506099945', pendants: 'photo-1551632436-cbf8dd35adfa',
  laptops: 'photo-1542744173-8e7e53415bb0', coach: 'photo-1571019614242-c5c5dee9f50b', hairClient: 'photo-1573496359142-b8d87734a5a2',
  speaker: 'photo-1556761175-5973dc0f32e7', nurse: 'photo-1576765608535-5f04d1e3f289', abc: 'photo-1503676260728-1c00da094a0b',
  shopPhone: 'photo-1605902711622-cfb43c4437b5', towels: 'photo-1540555700478-4be289fbecef', redTop: 'photo-1494790108377-be9c29b29330',
  nour: 'photo-1531123897727-8f129e1688ce'
};
// [file, dotted path to the object holding img/imgAlt, new img (or null to keep, '' to remove), new alt]
const FIX = [
  ['01', 'hero', null, 'The pool deck and timber-roofed main house at Bayt Sahel'],
  ['01', 'sections.1', null, 'Mawja, the all-day dining room, laid for lunch under pendant lights'],
  ['03', 'sections.3.imgs.1', null, 'Cooking in the fitted kitchen of the two-bedroom show apartment'],
  ['06', 'sections.0.imgs.0', null, 'A look from the autumn edit shot against a teal wall'],
  ['06', 'sections.0.imgs.1', null, 'Leather bag, watch and accessories from the sale edit'],
  ['06', 'sections.0.imgs.2', null, 'Checked wool coat from the autumn collection'],
  ['06', 'sections.0.imgs.3', null, 'Pale blue overcoat photographed on location'],
  ['06', 'sections.0.imgs.4', null, 'Cotton basics and a striped tote laid out flat'],
  ['07', 'hero', 'villaPool', 'The lagoon pool and thatched villas at Thila Mora below the island hills'],
  ['07', 'sections.1', 'palmPool', 'Palms around the infinity pool at the Thila Mora spa'],
  ['08', 'sections.1', 'pendants', 'The pass and dining room at Fahm before service'],
  ['08', 'sections.3.imgs.0', null, 'Wood-fired flatbread with tomato and melted cheese'],
  ['08', 'sections.3.imgs.2', null, 'A salad of leaves, red onion and toasted seeds'],
  ['09', 'sections.0.items.1', '', ''],
  ['09', 'sections.0.items.2', null, 'Dr Yasmin Haddadin with a patient'],
  ['11', 'hero', 'laptops', 'Learners working through an exercise during a live session'],
  ['13', 'hero', null, 'A bag of freshly roasted coffee, the beans we test every grinder with'],
  ['14', 'hero', 'coach', 'A coach correcting a member\'s form during a conditioning round'],
  ['15', 'hero', 'hairClient', 'A client with a fresh cut and colour at Rosewater Row'],
  ['16', 'hero', null, 'The Saj & Coal kitchen floor in Al Quoz between services'],
  ['20', 'hero', 'dubai', 'Sheikh Zayed Road and the Dubai skyline at dusk'],
  ['21', 'hero', 'speaker', 'A speaker presenting to a seated audience'],
  ['22', 'hero', 'nurse', 'A nurse checking an older patient before treatment'],
  ['23', 'hero', '', ''],
  ['25', 'hero', 'canyon', 'A desert road through red sandstone, like the Wadi Rum leg of the Jordan trip'],
  ['25', 'sections.1', 'dubai', 'Dubai at dusk, where every Kafila departure starts'],
  ['27', 'sections.0', null, 'A member running the stairs during a conditioning session'],
  ['28', 'sections.0.imgs.0', null, 'Living room with planting and a mustard sideboard'],
  ['28', 'sections.0.imgs.1', null, 'Family room in pale neutrals with a round mirror'],
  ['28', 'sections.0.imgs.2', null, 'A family cooking in a white and timber kitchen we finished'],
  ['28', 'sections.0.imgs.3', null, 'Sitting room with a deep green feature wall'],
  ['28', 'sections.0.imgs.4', null, 'A rust velvet sofa chosen for a Jumeirah villa'],
  ['28', 'sections.1', null, 'A bright living room with a picture wall and leather armchair'],
  ['31', 'sections.0', null, 'A client talking through their first 90 days in a session'],
  ['32', 'hero', 'abc', 'Picture books and alphabet blocks in the Explorers room'],
  ['33', 'hero', null, 'An open desert road at golden hour'],
  ['35', 'hero', null, 'A freshly groomed puppy running across the grass'],
  ['36', 'sections.2', null, 'Exposed pipework on a brick wall, the kind of job we quote from a photo'],
  ['37', 'sections.3', null, 'A patient fitting a clear aligner'],
  ['38', 'hero', 'palmPool', 'A resort pool between palms on the edge of the Indian Ocean'],
  ['38', 'sections.0.imgs.1', null, 'Whitewashed walls above a deep blue bay'],
  ['39', 'sections.0.imgs.0', 'redTop', 'An individual portrait session with a natural smile'],
  ['43', 'sections.1', 'shopPhone', 'Checking a purchase against the month\'s budget on a phone'],
  ['46', 'hero', 'nour', 'Nour Abi Saab, founder of Second Draft'],
  ['48', 'hero', null, 'A white flat-roofed house with a pool and large glazing'],
  ['48', 'sections.0.imgs.2', null, 'A rust sofa in the Lyndhurst Grove living room'],
  ['48', 'sections.0.imgs.3', null, 'Sitting room with a deep green wall in a Camberwell terrace'],
  ['48', 'sections.0.imgs.4', null, 'The Herne Hill rear extension kitchen in use'],
  ['49', 'hero', null, 'Warm oil poured into the palm before a massage'],
  ['49', 'sections.2', 'towels', 'Rolled towels, a candle and tulips laid out in a treatment room'],
  ['50', 'sections.1.imgs.0', null, 'A team presentation in an office we fitted out'],
  ['50', 'sections.1.imgs.2', null, 'A hotel suite refurbishment with timber floors and full-height glazing']
];
const byFile = {};
FIX.forEach(f => (byFile[f[0]] = byFile[f[0]] || []).push(f));
for (const k in byFile) {
  const file = path.join(__dirname, 'data', k + '.js');
  delete require.cache[require.resolve(file)];
  const d = require(file);
  for (const [, p, im, alt] of byFile[k]) {
    const o = p.split('.').reduce((a, x) => a[x], d);
    const imgKey = 'img';
    const altKey = 'imgAlt' in o || imgKey === 'img' && !('alt' in o) ? 'imgAlt' : 'alt';
    if (im === '') { delete o.img; delete o.imgAlt; delete o.alt; continue; }
    if (im) o.img = P[im];
    if (alt) o[altKey] = alt;
  }
  fs.writeFileSync(file, 'module.exports = ' + JSON.stringify(d, null, 2) + ';\n');
}
console.log('patched', Object.keys(byFile).length, 'files');
