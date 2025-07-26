const { supabase } = require("./supabase");
const { pingSite } = require("./utils/pingSite");

const INTERVAL = 60 * 1000;

async function runPinger() {
  const { data: sites } = await supabase.from("monitored_sites").select("*");
  if (!sites) return;

  for (const site of sites) {
    const result = await pingSite(site.url);
    await supabase.from("monitoring_logs").upsert(
      {
        site_id: site.id,
        status: result.status,
        response_time: result.responseTime,
        checked_at: new Date().toISOString(),
      },
      { onConflict: ["site_id"] }
    );

    console.log(`[${new Date().toISOString()}] ${site.url} → ${result.status}`);
  }
}

setInterval(runPinger, INTERVAL);
runPinger();
