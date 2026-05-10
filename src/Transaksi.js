const Barang = require('./Barang');
const ItemKeranjang = require('./ItemKeranjang');

class Transaksi {
  constructor(pelanggan) {
    if (!pelanggan || typeof pelanggan !== 'string' || pelanggan.trim() === '') {
      throw new Error('Nama pelanggan harus berupa string tidak kosong');
    }
    this.id = 'TXN-' + Date.now().toString(36).toUpperCase();
    this.pelanggan = pelanggan.trim();
    this.items = [];
    this.waktu = new Date();
    this.selesai = false;
  }

  tambahBarang(barang, qty = 1) {
    if (!(barang instanceof Barang)) {
      throw new Error('Parameter harus instance dari Barang');
    }
    if (!Number.isInteger(qty) || qty < 1) {
      throw new Error('Qty harus bilangan bulat >= 1');
    }
    const existing = this.items.find((i) => i.barang.id === barang.id);
    if (existing) {
      existing.setQty(existing.qty + qty);
    } else {
      this.items.push(new ItemKeranjang(barang, qty));
    }
    return this;
  }

  hapusBarang(barangId) {
    this.items = this.items.filter((i) => i.barang.id !== barangId);
  }

  updateQty(barangId, qty) {
    const item = this.items.find((i) => i.barang.id === barangId);
    if (!item) throw new Error('Barang tidak ditemukan dalam transaksi');
    if (!Number.isInteger(qty) || qty < 1) {
      throw new Error('Qty tidak boleh kurang dari 1');
    }
    item.setQty(qty);
  }

  hitungTotal() {
    const total = this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
    if (total < 0) throw new Error('Total tidak boleh negatif');
    return total;
  }

  jumlahItem() {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  selesaikan() {
    if (this.items.length === 0) {
      throw new Error('Tidak ada item dalam transaksi — tidak bisa diselesaikan');
    }
    this.selesai = true;
    return this;
  }

  tampilkanStruk() {
    if (!this.selesai) {
      throw new Error('Transaksi belum diselesaikan — panggil selesaikan() terlebih dahulu');
    }
    return {
      id: this.id,
      pelanggan: this.pelanggan,
      waktu: this.waktu.toLocaleString('id-ID'),
      items: this.items.map((i) => ({
        nama: i.barang.nama,
        emoji: i.barang.emoji,
        qty: i.qty,
        harga: i.barang.harga,
        subtotal: i.getSubtotal(),
      })),
      total: this.hitungTotal(),
      jumlahItem: this.jumlahItem(),
    };
  }
}

module.exports = Transaksi;