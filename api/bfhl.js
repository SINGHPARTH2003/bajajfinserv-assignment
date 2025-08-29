/**
 * VIT BFHL – Serverless function for Vercel
 * Route: POST /bfhl  (via vercel.json rewrite to /api/bfhl)
 * 
 * Configure your details via environment variables on Vercel:
 *   FULL_NAME         -> e.g., "john_doe"         (will be forced to lowercase)
 *   DOB_DDMMYYYY      -> e.g., "17091999"         (exactly 8 digits)
 *   EMAIL             -> e.g., "john@xyz.com"
 *   ROLL_NUMBER       -> e.g., "ABCD123"
 */
 
function isAlphaOnly(str) {
  return typeof str === 'string' && /^[A-Za-z]+$/.test(str);
}

function isDigitsOnly(str) {
  return typeof str === 'string' && /^\d+$/.test(str);
}

function toAlternatingCapsReversed(allLetters) {
  const reversed = allLetters.slice().reverse();
  return reversed.map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join('');
}

function safeUpper(s) {
  return typeof s === 'string' ? s.toUpperCase() : s;
}

function classify(data) {
  const odd_numbers = [];
  const even_numbers = [];
  const alphabets = [];
  const special_characters = [];
  const alphaCharsInOrder = [];
  let sum = 0;

  for (const item of data) {
    const s = (typeof item === 'string') ? item : (item === null || item === undefined ? '' : String(item));

    if (isDigitsOnly(s)) {
      // numeric token
      const n = parseInt(s, 10);
      if (Number.isFinite(n)) {
        sum += n;
        if (Math.abs(n % 2) === 1) odd_numbers.push(s);
        else even_numbers.push(s);
      } else {
        special_characters.push(s);
      }
    } else if (isAlphaOnly(s)) {
      // alphabetic token – push uppercase token; collect its characters
      alphabets.push(safeUpper(s));
      for (const ch of s) {
        alphaCharsInOrder.push(ch);
      }
    } else {
      special_characters.push(s);
    }
  }

  const concat_string = toAlternatingCapsReversed(alphaCharsInOrder);
  return {
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string
  };
}

export default async function handler(req, res) {
  // Enforce POST
  if (req.method !== 'POST') {
    return res.status(405).json({ is_success: false, message: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const data = Array.isArray(body.data) ? body.data : [];

    const FULL_NAME = String(process.env.FULL_NAME || 'john_doe').toLowerCase();
    const DOB = String(process.env.DOB_DDMMYYYY || '17091999');
    const EMAIL = String(process.env.EMAIL || 'john@xyz.com');
    const ROLL = String(process.env.ROLL_NUMBER || 'ABCD123');

    const user_id = `${FULL_NAME}_${DOB}`;

    const result = classify(data);

    return res.status(200).json({
      is_success: true,
      user_id,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers: result.odd_numbers,
      even_numbers: result.even_numbers,
      alphabets: result.alphabets,
      special_characters: result.special_characters,
      sum: result.sum,
      concat_string: result.concat_string
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      user_id: String(process.env.FULL_NAME || 'john_doe').toLowerCase() + '_' + String(process.env.DOB_DDMMYYYY || '17091999'),
      email: String(process.env.EMAIL || 'john@xyz.com'),
      roll_number: String(process.env.ROLL_NUMBER || 'ABCD123'),
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: (err && err.message) ? err.message : 'Unknown error'
    });
  }
}
