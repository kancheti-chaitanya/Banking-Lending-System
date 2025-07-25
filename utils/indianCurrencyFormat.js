function formatIndianCurrency(num) {
  let [intPart, decPart] = num.toString().split('.');
  let lastThree = intPart.slice(-3);
  let otherNumbers = intPart.slice(0, -3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  let formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  if (decPart) {
    formatted += '.' + decPart;
  }
  return formatted;
}

module.exports = { formatIndianCurrency }; 