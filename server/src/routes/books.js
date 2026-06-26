import { Router } from 'express';
import { query } from '../db.js';
import { TROPES, TROPE_SET } from '../tropes.js';

const router = Router();

// Shape a DB row into the JSON the frontend expects.
function toClient(row) {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    year: row.pub_year,
    pages: row.pages,
    spicy: row.spicy,
    tropes: row.tropes,
  };
}

// Validate and normalize an incoming book payload.
// Returns { value } on success or { error } with a human-readable message.
function validateBook(body) {
  if (!body || typeof body !== 'object') return { error: 'Request body must be a JSON object.' };

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const author = typeof body.author === 'string' ? body.author.trim() : '';
  const year = Number(body.year);
  const pages = Number(body.pages);
  const spicy = body.spicy;

  let tropes = body.tropes;
  if (typeof tropes === 'string') {
    tropes = tropes.split(',').map((t) => t.trim()).filter(Boolean);
  }

  if (!title) return { error: 'Title is required.' };
  if (title.length > 300) return { error: 'Title is too long.' };
  if (!author) return { error: 'Author is required.' };
  if (author.length > 200) return { error: 'Author is too long.' };
  if (!Number.isInteger(year) || year < 1900 || year > 2100)
    return { error: 'Year must be an integer between 1900 and 2100.' };
  if (!Number.isInteger(pages) || pages < 1 || pages > 5000)
    return { error: 'Pages must be an integer between 1 and 5000.' };
  if (typeof spicy !== 'boolean') return { error: 'Spicy must be true or false.' };
  if (!Array.isArray(tropes) || tropes.length < 1)
    return { error: 'Provide at least one trope.' };
  if (tropes.length > 6) return { error: 'Six tropes maximum.' };
  // Strict: every trope must be one of the canonical values.
  const invalid = tropes.filter((t) => !TROPE_SET.has(t));
  if (invalid.length > 0)
    return { error: `Not an allowed trope: ${invalid.join(', ')}.` };
  // De-duplicate while preserving order, in case the same trope is sent twice.
  const uniqueTropes = [...new Set(tropes)];

  return { value: { title, author, year, pages, spicy, tropes: uniqueTropes } };
}

// GET /api/tropes — the canonical list, so the frontend can build its picker.
router.get('/tropes', (_req, res) => {
  res.json(TROPES);
});

// GET /api/books  — full catalog, or ?q= to search title/author
router.get('/', async (req, res, next) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    let result;
    if (q) {
      result = await query(
        `SELECT * FROM books
         WHERE lower(title) LIKE $1 OR lower(author) LIKE $1
         ORDER BY title
         LIMIT 20`,
        [`%${q}%`]
      );
    } else {
      result = await query('SELECT * FROM books ORDER BY title');
    }
    res.json(result.rows.map(toClient));
  } catch (err) {
    next(err);
  }
});

// GET /api/books/random — one random book (handy for the test "play again")
router.get('/random', async (_req, res, next) => {
  try {
    const result = await query('SELECT * FROM books ORDER BY random() LIMIT 1');
    if (result.rows.length === 0) return res.status(404).json({ error: 'No books in catalog.' });
    res.json(toClient(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// POST /api/books — add a book
router.post('/', async (req, res, next) => {
  const { value, error } = validateBook(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const result = await query(
      `INSERT INTO books (title, author, pub_year, pages, spicy, tropes)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [value.title, value.author, value.year, value.pages, value.spicy, value.tropes]
    );
    res.status(201).json(toClient(result.rows[0]));
  } catch (err) {
    // 23505 = unique_violation (duplicate title+author)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'That book is already in the catalog.' });
    }
    next(err);
  }
});

export default router;
