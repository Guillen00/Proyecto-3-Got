const compressor = require('./compressor');
const fs = require('fs');

const fileData = fs.readFileSync('./data/money.txt').toString();
const fileCompressed = fs.readFileSync('./data/money.txt.huff').toString();

describe('Compressor', () => {
  test('Correctly encodes data', () => {
    const { freqTable, encoded } = compressor.encode(fileData);
    console.log(freqTable)
    console.log(encoded)
  });

  test('Correctly decodes data', () => {
    const decoded = compressor.decode(fileCompressed);
    console.log(decoded)
  });
});
