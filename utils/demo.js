const { caesarEncode, caesarDecode } = require('./caesarCipher');
const { formatIndianCurrency } = require('./indianCurrencyFormat');
const { combineLists } = require('./combineLists');
const { minimizeLoss } = require('./minimizeLoss');

console.log('--- Caesar Cipher ---');
const msg = 'Hello World!';
const shift = 3;
const encoded = caesarEncode(msg, shift);
const decoded = caesarDecode(encoded, shift);
console.log(`Original: ${msg}`);
console.log(`Encoded (shift ${shift}): ${encoded}`);
console.log(`Decoded: ${decoded}`);

console.log('\n--- Indian Currency Format ---');
const num = 123456.7891;
console.log(`Input: ${num}`);
console.log(`Formatted: ${formatIndianCurrency(num)}`);

console.log('\n--- Combine Lists ---');
const list1 = [
  { positions: [0, 5], values: [1, 2] },
  { positions: [6, 10], values: [3] }
];
const list2 = [
  { positions: [4, 8], values: [4] },
  { positions: [11, 15], values: [5] }
];
console.log('List1:', JSON.stringify(list1));
console.log('List2:', JSON.stringify(list2));
console.log('Combined:', JSON.stringify(combineLists(list1, list2)));

console.log('\n--- Minimize Loss ---');
const prices = [20, 15, 7, 2, 13];
const result = minimizeLoss(prices);
console.log(`Prices: ${prices}`);
console.log(`Buy Year: ${result.buyYear}, Sell Year: ${result.sellYear}, Min Loss: ${result.minLoss}`); 