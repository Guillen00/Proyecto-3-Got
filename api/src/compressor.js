const HuffmanTree = require('./huffman-tree');

/**
 * Calcula la cantidad de apareciones de un carater que el string
 * @param string
 * @returns {string|{}}
 */
function calculateFreqTable(string) {
  const table = {};
  if(string == ""){
    return  ""
  }
  for (let charAt of string) {
    table[charAt] ? table[charAt]++ : (table[charAt] = 1);
  }
  return table;
}

/**
 * Aplica el algoritmo de huffman para codificar el string
 * @param fileData
 * @returns {string|{freqTable: (string|{}), encoded: *}}
 */
function encode(fileData) {
  if(fileData == ""){
    return  "";
  }
  const freqTable = calculateFreqTable(fileData);
  const huffman = new HuffmanTree(freqTable);

  const encoded = huffman.encode(fileData);
  freqTable.len = fileData.length;

  return { freqTable, encoded };
}

/**
 * Aplica el algoritmo de hoffman para decodificar el string
 * @param fileData
 * @returns {*}
 */
function decode(fileData) {
  const [freqJsonStr, ...restOfFile] = fileData.split('\n');
  const encodedString = restOfFile.join('\n');
  const freqTable = JSON.parse(freqJsonStr);
  const { len } = freqTable;
  delete freqTable['len'];

  const huffman = new HuffmanTree(freqTable);

  return huffman.decode(encodedString, len);
}

module.exports = { calculateFreqTable, encode, decode };
