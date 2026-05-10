class Barang {
  constructor(id, nama, harga, kategori, emoji) {
    if (typeof nama !== 'string' || nama.trim() === '') {
      throw new Error('Nama barang tidak valid');
    }
    if (typeof harga !== 'number' || isNaN(harga)) {
      throw new Error('Harga harus berupa angka');
    }
    if (harga < 0) {
      throw new Error('Harga tidak boleh negatif');
    }
    this.id = id;
    this.nama = nama.trim();
    this.harga = harga;
    this.kategori = kategori || 'Umum';
    this.emoji = emoji || '📦';
  }

  getHargaFormatted() {
    return 'Rp ' + this.harga.toLocaleString('id-ID');
  }

  toJSON() {
    return {
      id: this.id,
      nama: this.nama,
      harga: this.harga,
      kategori: this.kategori,
      emoji: this.emoji,
    };
  }
}

module.exports = Barang;