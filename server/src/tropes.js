// Canonical list of allowed tropes — the single source of truth.
// The server validates against this; the frontend fetches it to build the picker.
// To change the available tropes, edit this array and redeploy.
//
// Keep entries Title Case and unique. If you remove a trope that existing books
// use, those books keep their stored value but it can no longer be selected;
// consider updating affected rows if you retire a trope.

export const TROPES = [
  'Age Gap',
  'Arranged Marriage',
  'Bad Boy',
  'Billionaire',
  "Brother's Best Friend",
  'Captive',
  'Contemporary',
  'Dark',
  'Emotional',
  'Enemies to Lovers',
  'Fake Dating',
  'Fantasy',
  'Fated Mates',
  'Forbidden',
  'Forced Proximity',
  'Friends to Lovers',
  'Grumpy Sunshine',
  'Historical',
  'LGBTQ',
  'Mafia',
  'Marriage of Convenience',
  'Masked',
  'Mythology',
  'New Adult',
  'Office Romance',
  'Opposites Attract',
  'Paranormal',
  'Pen Pals',
  'Revenge',
  'Reverse Harem',
  'Second Chance',
  'Secret Society',
  'Serial Killer',
  'Slow Burn',
  'Small Town',
  'Sports',
  'Stalker',
  'STEM',
  'Suspense',
  'Villain',
  'Workplace',
  'Young Adult',
];

// Fast membership check for validation.
export const TROPE_SET = new Set(TROPES);
