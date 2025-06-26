/**
 * Utility functions untuk perhitungan tanggal terkait masa sewa
 */

/**
 * Function untuk menghitung sisa waktu sewa dalam hari
 * @param endDateStr Tanggal akhir sewa dalam format ISO (YYYY-MM-DD)
 * @returns Jumlah hari tersisa
 */
export function calculateRemainingDays(endDateStr: string): number {
  const today = new Date();
  const endDate = new Date(endDateStr);
  
  // Reset waktu ke 00:00:00 untuk perhitungan yang akurat
  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  
  // Hitung selisih dalam miliseconds dan konversi ke hari
  const differenceMs = endDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
  
  return Math.max(0, remainingDays);
}

/**
 * Function untuk cek apakah masa sewa hampir berakhir
 * @param endDateStr Tanggal akhir sewa
 * @param thresholdDays Jumlah hari sebagai threshold (default: 30)
 * @returns Boolean yang menunjukkan apakah masa sewa hampir berakhir
 */
export function isRentalExpiringSoon(endDateStr: string, thresholdDays = 30): boolean {
  const remainingDays = calculateRemainingDays(endDateStr);
  return remainingDays > 0 && remainingDays <= thresholdDays;
}

/**
 * Format tanggal menjadi format yang lebih mudah dibaca
 * @param dateStr Tanggal dalam format ISO (YYYY-MM-DD)
 * @returns String tanggal dalam format "DD Bulan YYYY"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
