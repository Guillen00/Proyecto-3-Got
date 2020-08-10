

const fileData = fs.readFileSync('./data/money.txt').toString();
const fileCompressed = fs.readFileSync('./data/money.txt.huff').toString();

describe('Compressor', () => {
  test('Correctly encodes data', () => {
    console.log(freqTable)
    console.log(encoded)
  });

  test('Correctly decodes data', () => {
    console.log(decoded)
  });
});
