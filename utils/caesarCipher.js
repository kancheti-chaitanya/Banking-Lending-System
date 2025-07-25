function caesarEncode(message, shift) {
  return message.split('').map(char => {
    if (char >= 'A' && char <= 'Z') {
      return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
    } else if (char >= 'a' && char <= 'z') {
      return String.fromCharCode(((char.charCodeAt(0) - 97 + shift) % 26) + 97);
    } else {
      return char;
    }
  }).join('');
}

function caesarDecode(message, shift) {
  return caesarEncode(message, (26 - (shift % 26)) % 26);
}

module.exports = { caesarEncode, caesarDecode }; 