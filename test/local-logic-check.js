function isAlphaOnly(str) { return typeof str === 'string' && /^[A-Za-z]+$/.test(str); }
function isDigitsOnly(str) { return typeof str === 'string' && /^\d+$/.test(str); }
function toAlternatingCapsReversed(allLetters) {
  const reversed = allLetters.slice().reverse();
  return reversed.map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join('');
}
function safeUpper(s) { return typeof s === 'string' ? s.toUpperCase() : s; }
function classify(data) {
  const odd_numbers = [], even_numbers = [], alphabets = [], special_characters = [], alphaCharsInOrder = [];
  let sum = 0;
  for (const item of data) {
    const s = (typeof item === 'string') ? item : (item === null || item === undefined ? '' : String(item));
    if (isDigitsOnly(s)) {
      const n = parseInt(s, 10);
      if (Number.isFinite(n)) {
        sum += n;
        if (Math.abs(n % 2) === 1) odd_numbers.push(s);
        else even_numbers.push(s);
      } else special_characters.push(s);
    } else if (isAlphaOnly(s)) {
      alphabets.push(safeUpper(s));
      for (const ch of s) alphaCharsInOrder.push(ch);
    } else {
      special_characters.push(s);
    }
  }
  const concat_string = toAlternatingCapsReversed(alphaCharsInOrder);
  return { odd_numbers, even_numbers, alphabets, special_characters, sum: String(sum), concat_string };
}

const samples = [
  { data: ["a","1","334","4","R","$"] },
  { data: ["2","a","y","4","&","-","*","5","92","b"] },
  { data: ["A","ABcD","DOE"] },
];

for (const s of samples) {
  console.log(JSON.stringify(classify(s.data), null, 2));
}
