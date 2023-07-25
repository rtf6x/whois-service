module.exports = function specialChars(text = '') {
  return text
      .replace(/\0/g, '0')
      .replace(/\\(.)/g, '$1')
      .replace(/&/g, '')
      .replace(/</g, '')
      .replace(/>/g, '')
      .replace(/\\/g, '')
      .replace(/\|/g, '')
      .replace(/\//g, '')
      .replace(/"/g, '')
      .replace(/'/g, '');
}
