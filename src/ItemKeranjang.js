const Barang = require('./Barang');

class ItemKeranjang {
  constructor(barang, qty = 1) {
    if (!(barang instanceof Barang)) {
      throw new Error('Parameter barang harus merupakan instance dari class Barang');
    }
    if (!Number.isInteger(qty) || qty < 1) {
      throw new Error('Qty harus berupa bilangan bulat positif (>= 1)');
    }
    this.barang = barang;
    this.qty = qty;
  }

  getSubtotal() {
    return this.barang.harga * this.qty;
  }

  setQty(qty) {
    if (!Number.isInteger(qty) || qty < 1) {
      throw new Error('Qty tidak valid');
    }
    this.qty = qty;
  }
}

module.exports = ItemKeranjang;