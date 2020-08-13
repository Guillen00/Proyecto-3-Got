

const leftPad = require('left-pad');
const rightPad = require('right-pad');
const PriorityQueue = require('js-priority-queue');

const binaryToNumber = binary => parseInt(binary, 2);
const numberToByte = number => leftPad((number >>> 0).toString(2), 8, '0');

/**
 * El HuffNode clase en la cual se generan los nodos del arbol binario
 * esta guarda el caracter , sus repeticiones su hijo izquierdo y su hijo derecho
 */
class HuffNode {
  /**
   *
   * @param character: informacion o caracter que gurada
   * @param value : Cantindad de repetciones del caracter dentro del texto
   * @param left : direccion del hijo izquierdo
   * @param right : direccion del hijo derecho
   */
  constructor(character, value = 0, left = null, right = null) {
    this.char = character;
    this.value = value;
    this.left = left;
    this.right = right;
  }

  /**
   * Recorre de manera recursiva el arbol y recupera el codigo del caracter
   * @param prefix carcater
   * @param table Arbol
   */
  getCodes(prefix, table) {
    if (this.char) {
      table[this.char] = prefix;
    } else {
      if (this.left) this.left.getCodes(`${prefix}0`, table);
      if (this.right) this.right.getCodes(`${prefix}1`, table);
    }
  }
}

/**
 * Clase HuffmanTree en esta clase se crea un arbol a partir de de los nodos, este arbol se va creando apartir de
 * de la tabla de frecuncnias que va llamando a los nodos para la creacion de este
 */
class HuffmanTree {

  constructor(freqTable) {
    this.buildTree = this.buildTree.bind(this);
    this.getCodes = this.getCodes.bind(this);
    this.root = this.buildTree(freqTable);
  }

  /**
   * Crea los los nodos iniciales que contiene el caracteres y las repetciones de este en el texto , revisa que sean nodos
   * hoja del arbol
   * @param freqTable
   * @returns {*}
   */
  createMinQueue(freqTable) {
    const huffmanNodes = Object.entries(freqTable).map(([key, val]) => new HuffNode(key, val));
    return new PriorityQueue({
      comparator: function(a, b) {
        return a.value - b.value;
      },
      initialValues: huffmanNodes
    });
  }

  /**
   * Crea el arbol con la tabla de frecuencias
   * @param freqTable contiene la cantidad de repeticiones
   * @returns {*}
   */
  buildTree(freqTable) {
    const minQueue = this.createMinQueue(freqTable);
    while (minQueue.length > 1) {
      const leftChild = minQueue.dequeue();
      const rightChild = minQueue.dequeue();
      const sumValue = leftChild.value + rightChild.value;
      const internalNode = new HuffNode(null, sumValue, leftChild, rightChild);
      minQueue.queue(internalNode);
    }
    return minQueue.dequeue();
  }

  /**
   * Retorna un array con los valore del codigo para cada char
   * @returns {{}}
   */
  getCodes() {
    const translation = {};
    this.root.getCodes('', translation);
    return translation;
  }

  /**
   * Aplica el algoritmo de hoffman para codificar el string
   * @param str
   * @returns {string}
   */
  encode(str) {
    const charToCode = this.getCodes();
    let encodedString = '';
    let binaryString = '';

    for (let charAt of str) {
      binaryString += charToCode[charAt];//Obtiene la repesentacion binaria de la cadena
      if (binaryString.length >= 8) {
        const byteStr = binaryString.slice(0, 8);
        binaryString = binaryString.slice(8);
        const number = binaryToNumber(byteStr);
        encodedString += String.fromCharCode(number); //transforma el valor binario en un codigo de 0-255 segun ACII y alamacena su caracter
      }
    }
    //Trabaja con el valor binario
    if (binaryString.length) {
      const byteStr = rightPad(binaryString, 8, '0');
      const number = binaryToNumber(byteStr);
      encodedString += String.fromCharCode(number);
    }

    return encodedString;
  }

  /**
   * Decodifica el algoritmo de hoofman
   * @param str
   * @param len
   * @returns {string}
   */

  decode(str, len) {
    let decoded = '';
    let nodePointer = this.root;

    let binaryString = '';
    //Construye una cadena binaria apartir de la entrada codificada
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      binaryString += numberToByte(charCode);
    }
    // Camnina sobre el arbol de huffman
    for (let bit of binaryString) {
      if (decoded.length === len) {
        break;
      }
      if (bit === '0') {
        nodePointer = nodePointer.left;
      } else {
        nodePointer = nodePointer.right;
      }
      //Resisa si estamos en un nodo hoja , para obtener el caracter y devolverse a la raiz
      if (nodePointer.char) {
        decoded += nodePointer.char;
        nodePointer = this.root;
      }
    }
    return decoded;
  }
}

module.exports = HuffmanTree;
