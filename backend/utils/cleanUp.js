const cron = require("node-cron");
const { supabase } = require("../supabase");

// Fungsi yang akan dijalankan setiap 2 hari
const startCronJobs = () => {
  // Eksekusi setiap 2 hari sekali pada pukul 2:00 pagi
  cron.schedule("0 2 */2 * *", async () => {
    console.log("⏳ [CRON] Mulai hapus data dari dua tabel...");

    try {
      // Hapus isi monitoring_logs terlebih dahulu (agar tidak melanggar foreign key jika ada)
      const { error: logError } = await supabase
        .from("monitoring_logs")
        .delete()
        .neq("id", "");

      if (logError)
        throw new Error("Gagal hapus monitoring_logs: " + logError.message);

      // Kemudian hapus isi monitored_sites
      const { error: siteError } = await supabase
        .from("monitored_sites")
        .delete()
        .neq("id", "");

      if (siteError)
        throw new Error("Gagal hapus monitored_sites: " + siteError.message);

      console.log("✅ [CRON] Data berhasil dihapus dari dua tabel.");
    } catch (err) {
      console.error("❌ [CRON] Terjadi kesalahan:", err.message);
    }
  });
};

module.exports = { startCronJobs };
