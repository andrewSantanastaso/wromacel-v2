import pool from '../src/db.js';

const BOOKS = [
  ["It Ends with Us","Colleen Hoover",2016,384,true,["Emotional","Second Chance","Contemporary"]],
  ["Verity","Colleen Hoover",2018,336,true,["Dark","Suspense","Forbidden"]],
  ["The Hating Game","Sally Thorne",2016,384,false,["Enemies to Lovers","Workplace","Slow Burn"]],
  ["Beach Read","Emily Henry",2020,368,false,["Enemies to Lovers","Forced Proximity","Contemporary"]],
  ["People We Meet on Vacation","Emily Henry",2021,384,false,["Friends to Lovers","Slow Burn","Contemporary"]],
  ["Book Lovers","Emily Henry",2022,384,false,["Enemies to Lovers","Forced Proximity","Slow Burn"]],
  ["The Spanish Love Deception","Elena Armas",2021,485,true,["Fake Dating","Enemies to Lovers","Slow Burn"]],
  ["The Love Hypothesis","Ali Hazelwood",2021,384,true,["Fake Dating","STEM","Forced Proximity"]],
  ["Love on the Brain","Ali Hazelwood",2022,368,true,["Enemies to Lovers","STEM","Workplace"]],
  ["Red, White & Royal Blue","Casey McQuiston",2019,421,true,["Enemies to Lovers","LGBTQ","Forbidden"]],
  ["The Seven Husbands of Evelyn Hugo","Taylor Jenkins Reid",2017,389,false,["LGBTQ","Historical","Emotional"]],
  ["Icebreaker","Hannah Grace",2022,436,true,["Sports","Forced Proximity","Slow Burn"]],
  ["Twisted Love","Ana Huang",2021,336,true,["Dark","Forbidden","Brother's Best Friend"]],
  ["Punk 57","Penelope Douglas",2016,357,true,["Enemies to Lovers","Dark","Pen Pals"]],
  ["Ugly Love","Colleen Hoover",2014,336,true,["Emotional","Slow Burn","Contemporary"]],
  ["A Court of Thorns and Roses","Sarah J. Maas",2015,419,true,["Fantasy","Slow Burn","Forbidden"]],
  ["Fourth Wing","Rebecca Yarros",2023,528,true,["Fantasy","Enemies to Lovers","Slow Burn"]],
  ["The Unhoneymooners","Christina Lauren",2019,400,false,["Enemies to Lovers","Forced Proximity","Fake Dating"]],
  ["Happy Place","Emily Henry",2023,400,false,["Second Chance","Fake Dating","Forced Proximity"]],
  ["Things We Never Got Over","Lucy Score",2020,485,true,["Small Town","Grumpy Sunshine","Slow Burn"]],
  ["The Deal","Elle Kennedy",2015,367,true,["Sports","Fake Dating","Friends to Lovers"]],
  ["November 9","Colleen Hoover",2015,320,true,["Slow Burn","Emotional","Contemporary"]],
  ["King of Wrath","Ana Huang",2022,384,true,["Arranged Marriage","Dark","Workplace"]],
  ["Funny Story","Emily Henry",2024,400,false,["Fake Dating","Forced Proximity","Small Town"]],
  ["Check & Mate","Ali Hazelwood",2023,368,false,["Enemies to Lovers","Slow Burn","Young Adult"]],
  ["Credence","Penelope Douglas",2020,483,true,["Dark","Forbidden","Forced Proximity"]],
  ["Haunting Adeline","H. D. Carlton",2021,577,true,["Dark","Stalker","Suspense"]],
  ["Kingdom of the Wicked","Kerri Maniscalco",2020,436,true,["Fantasy","Forbidden","Enemies to Lovers"]],
  ["A Touch of Darkness","Scarlett St. Clair",2019,339,true,["Fantasy","Mythology","Forbidden"]],
  ["Birthday Girl","Penelope Douglas",2018,382,true,["Age Gap","Forbidden","Forced Proximity"]],
  ["Corrupt","Penelope Douglas",2015,412,true,["Dark","Enemies to Lovers","Revenge"]],
  ["Love Theoretically","Ali Hazelwood",2023,387,true,["Enemies to Lovers","STEM","Fake Dating"]],
  ["The Ritual","Shantel Tessier",2021,558,true,["Dark","Forbidden","Secret Society"]],
  ["Den of Vipers","K. A. Knight",2020,481,true,["Dark","Reverse Harem","Captive"]],
  ["Iron Flame","Rebecca Yarros",2023,640,true,["Fantasy","Enemies to Lovers","Slow Burn"]],
  ["A Court of Mist and Fury","Sarah J. Maas",2016,626,true,["Fantasy","Fated Mates","Slow Burn"]],
  ["Lights Out","Navessa Allen",2024,368,true,["Dark","Stalker","Masked"]],
  ["Butcher & Blackbird","Brynne Weaver",2023,316,true,["Dark","Enemies to Lovers","Serial Killer"]],
  ["Bride","Ali Hazelwood",2024,416,true,["Fated Mates","Arranged Marriage","Paranormal"]],
  ["Behind the Net","Stephanie Archer",2023,430,true,["Sports","Fake Dating","Grumpy Sunshine"]],
  ["The Pucking Wrong Number","C. R. Jane",2023,430,true,["Sports","Stalker","Forbidden"]],
  ["Hooked","Emily McIntire",2021,328,true,["Dark","Villain","Age Gap"]],
  ["Sweet Temptation","Cora Reilly",2018,380,true,["Mafia","Arranged Marriage","Forbidden"]],
  ["Bared to You","Sylvia Day",2012,338,true,["Billionaire","Emotional","Contemporary"]],
  ["Beautiful Disaster","Jamie McGuire",2011,416,true,["Bad Boy","Enemies to Lovers","New Adult"]],
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let inserted = 0;
    for (const [title, author, year, pages, spicy, tropes] of BOOKS) {
      const res = await client.query(
        `INSERT INTO books (title, author, pub_year, pages, spicy, tropes)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (title, author) DO NOTHING`,
        [title, author, year, pages, spicy, tropes]
      );
      inserted += res.rowCount;
    }
    await client.query('COMMIT');
    console.log(`✓ Seed complete — ${inserted} new book(s) inserted (${BOOKS.length - inserted} already present).`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
