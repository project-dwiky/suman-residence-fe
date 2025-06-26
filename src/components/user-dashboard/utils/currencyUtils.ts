/**
 * Utility functions untuk format mata uang
 */

/**
 * Format angka menjadi format mata uang Rupiah
 * @param value Nilai angka yang akan diformat
 * @returns String dalam format mata uang Rupiah
 */
export function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
