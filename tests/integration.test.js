const Barang = require('../src/Barang');
const Transaksi = require('../src/Transaksi');

describe('Integration Test | Full Flow: Input → Transaksi → Total → Struk', () => {

  test('Alur lengkap berjalan tanpa error', () => {
    const protein = new Barang('I001', 'Whey Protein', 450000, 'Protein', '🥛');
    const vitamin = new Barang('I002', 'Vitamin C', 55000, 'Vitamin', '🍋');

    const trx = new Transaksi('Budi Santoso');
    trx.tambahBarang(protein, 2);
    trx.tambahBarang(vitamin, 3);

    const total = trx.hitungTotal();
    expect(total).toBe(900000 + 165000);
    expect(total).toBeGreaterThanOrEqual(0);

    trx.selesaikan();
    const struk = trx.tampilkanStruk();

    expect(struk.pelanggan).toBe('Budi Santoso');
    expect(struk.items.length).toBe(2);
    expect(struk.total).toBe(1065000);
    expect(struk.id).toMatch(/^TXN-/);
  });

  test('Struk berisi data per-item yang benar', () => {
    const b = new Barang('I010', 'Creatine', 175000, 'Strength', '🔥');
    const trx = new Transaksi('Siti Rahayu');
    trx.tambahBarang(b, 2);
    trx.selesaikan();
    const struk = trx.tampilkanStruk();

    expect(struk.items[0].nama).toBe('Creatine');
    expect(struk.items[0].qty).toBe(2);
    expect(struk.items[0].subtotal).toBe(350000);
    expect(struk.total).toBe(350000);
  });
});

describe('Integration Test | Toko Athlete Fuel — Skenario Belanja', () => {

  test('Tambah, update, hapus, lalu checkout', () => {
    const b1 = new Barang('S001', 'Mass Gainer', 520000, 'Protein', '💪');
    const b2 = new Barang('S002', 'Omega-3', 130000, 'Vitamin', '🐟');
    const b3 = new Barang('S003', 'Energy Bar', 18000, 'Snack', '🍫');

    const trx = new Transaksi('Andi Kurniawan');
    trx.tambahBarang(b1, 1);
    trx.tambahBarang(b2, 2);
    trx.tambahBarang(b3, 5);

    expect(trx.hitungTotal()).toBe(520000 + 260000 + 90000);

    trx.updateQty('S001', 2);
    trx.hapusBarang('S003');

    expect(trx.items.length).toBe(2);
    expect(trx.hitungTotal()).toBe(1040000 + 260000);

    trx.selesaikan();
    const struk = trx.tampilkanStruk();
    expect(struk.total).toBe(1300000);
    expect(trx.selesai).toBe(true);
  });

  test('Dua tambahBarang barang sama merge qty', () => {
    const b = new Barang('S020', 'Tuna Can', 18500, 'Whole Food', '🐠');
    const trx = new Transaksi('Deka');
    trx.tambahBarang(b, 3);
    trx.tambahBarang(b, 2);

    expect(trx.items.length).toBe(1);
    expect(trx.items[0].qty).toBe(5);
    expect(trx.hitungTotal()).toBe(92500);
  });

  test('Harga negatif tidak boleh masuk transaksi', () => {
    expect(() => new Barang('NEG', 'Invalid', -10000)).toThrow('Harga tidak boleh negatif');
  });

  test('Checkout tanpa barang diblokir', () => {
    const trx = new Transaksi('Athlete');
    expect(() => trx.selesaikan()).toThrow('Tidak ada item');
  });

  test('updateQty barang tidak ada harus throw', () => {
    const trx = new Transaksi('Athlete');
    expect(() => trx.updateQty('TIDAKADA', 2)).toThrow('tidak ditemukan');
  });
});