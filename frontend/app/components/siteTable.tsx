"use client";

import { useEffect, useState } from "react";
import SiteChart from "./siteChart";

export default function SiteTable({ sites }: { sites: any[] }) {
  const [logs, setLogs] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchLogs = async () => {
      const result: { [key: string]: any } = {};

      for (const site of sites) {
        if (!site?.id) continue;

        try {
          const res = await fetch(
            `http://localhost:3001/api/sites/${site.id}/logs`
          );
          if (!res.ok) continue;

          const data = await res.json();
          result[site.id] = data[0];
        } catch (err) {
          console.error("Fetch log error:", err);
        }
      }

      setLogs(result);
    };

    if (sites.length > 0) fetchLogs();
  }, [sites]);

  return (
    <div className="space-y-6">
      {sites.map((site) => {
        const log = logs[site.id];
        return (
          <div
            key={site.id}
            className="border rounded-2xl shadow p-4 bg-white hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {site.name}
                </h2>
                <p className="text-sm text-gray-500">{site.url}</p>
              </div>
              <div className="mt-2 sm:mt-0 space-y-1 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row text-sm">
                <span
                  className={`font-bold ${
                    log?.status === "UP" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Status: {log?.status || "-"}
                </span>
                <span>Response: {log?.response_time ?? "-"} ms</span>
                <span>
                  Last Checked:{" "}
                  {log?.checked_at
                    ? new Date(log.checked_at).toLocaleString()
                    : "-"}
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 mb-8">
              <SiteChart siteId={site.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
