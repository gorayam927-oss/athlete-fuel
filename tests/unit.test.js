const Barang = require('../src/Barang');
const ItemKeranjang = require('../src/ItemKeranjang');
const Transaksi = require('../src/Transaksi');

describe('Unit Test | Input & Validasi Barang', () => {
  test('Membuat barang dengan data valid', () => {
    const b = new Barang('B001', 'Whey Protein', 450000, 'Protein', '🥛');
    expect(b.id).toBe('B001');
    expect(b.nama).toBe('Whey Protein');
    expect(b.harga).toBe(450000);
  });

  test('Nama barang di-trim otomatis', () => {
    const b = new Barang('B002', '  Creatine  ', 175000);
    expect(b.nama).toBe('Creatine');
  });

  test('Barang dengan harga 0 valid', () => {
    const b = new Barang('B003', 'Free Sample', 0);
    expect(b.harga).toBe(0);
  });

  test('Harga negatif harus diblokir', () => {
    expect(() => new Barang('BAD', 'Invalid', -5000)).toThrow('Harga tidak boleh negatif');
  });

  test('Nama kosong harus diblokir', () => {
    expect(() => new Barang('BAD', '', 10000)).toThrow('Nama barang tidak valid');
  });

  test('Harga bukan angka harus diblokir', () => {
    expect(() => new Barang('BAD', 'Item', 'gratis')).toThrow('Harga harus berupa angka');
  });
});

describe('Unit Test | Perhitungan Total Belanja', () => {
  let b1, b2;

  beforeEach(() => {
    b1 = new Barang('P001', 'Whey Protein', 450000, 'Protein', '🥛');
    b2 = new Barang('P002', 'BCAA', 210000, 'Amino', '💊');
  });

  test('Total 0 saat keranjang kosong', () => {
    const t = new Transaksi('Athlete');
    expect(t.hitungTotal()).toBe(0);
  });

  test('Total 1 item benar', () => {
    const t = new Transaksi('Athlete');
    t.tambahBarang(b1, 2);
    expect(t.hitungTotal()).toBe(900000);
  });

  test('Total banyak item benar', () => {
    const t = new Transaksi('Athlete');
    t.tambahBarang(b1, 1);
    t.tambahBarang(b2, 3);
    expect(t.hitungTotal()).toBe(1080000);
  });

  test('Total tidak boleh negatif', () => {
    const t = new Transaksi('Athlete');
    const free = new Barang('F001', 'Free Sample', 0);
    t.tambahBarang(free, 99);
    expect(t.hitungTotal()).toBeGreaterThanOrEqual(0);
  });

  test('Tambah barang sama merge qty', () => {
    const t = new Transaksi('Athlete');
    t.tambahBarang(b1, 2);
    t.tambahBarang(b1, 3);
    expect(t.items.length).toBe(1);
    expect(t.hitungTotal()).toBe(2250000);
  });

  test('hapusBarang mengurangi total', () => {
    const t = new Transaksi('Athlete');
    t.tambahBarang(b1, 1);
    t.tambahBarang(b2, 2);
    t.hapusBarang('P001');
    expect(t.hitungTotal()).toBe(420000);
  });

  test('updateQty mengubah total', () => {
    const t = new Transaksi('Athlete');
    t.tambahBarang(b1, 1);
    t.updateQty('P001', 4);
    expect(t.hitungTotal()).toBe(1800000);
  });

  test('Pelanggan kosong harus diblokir', () => {
    expect(() => new Transaksi('')).toThrow('Nama pelanggan harus berupa string tidak kosong');
  });

  test('selesaikan() keranjang kosong harus throw', () => {
    const t = new Transaksi('Athlete');
    expect(() => t.selesaikan()).toThrow('Tidak ada item');
  });

  test('tampilkanStruk() sebelum selesaikan() harus throw', () => {
    const t = new Transaksi('Athlete');
    t.tambahBarang(b1, 1);
    expect(() => t.tampilkanStruk()).toThrow('belum diselesaikan');
  });
});