"use client";

import { useEffect, useState } from "react";

export default function SiteTable({ sites }: { sites: any[] }) {
  const [logs, setLogs] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchLogs = async () => {
      const result: { [key: string]: any } = {};

      for (const site of sites) {
        if (!site?.id) {
          console.warn("Site ID is missing or invalid:", site);
          continue;
        }

        try {
          const res = await fetch(
            `http://localhost:3001/api/sites/${site.id}/logs`
          );

          if (!res.ok) {
            console.warn(
              `Failed to fetch logs for ${site.name}: ${res.status}`
            );
            continue;
          }

          const data = await res.json();
          result[site.id] = data[0];
        } catch (error) {
          console.error(`Error fetching logs for ${site.name}:`, error);
        }
      }

      setLogs(result);
    };

    if (sites.length > 0) fetchLogs();
  }, [sites]);

  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Nama</th>
          <th className="p-2 text-left">URL</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Response (ms)</th>
          <th className="p-2 text-left">Last Checked</th>
        </tr>
      </thead>
      <tbody>
        {sites.map((site) => {
          const log = logs[site.id];
          return (
            <tr key={site.id} className="border-t">
              <td className="p-2">{site.name}</td>
              <td className="p-2">{site.url}</td>
              <td
                className={`p-2 font-bold ${
                  log?.status === "UP" ? "text-green-600" : "text-red-600"
                }`}
              >
                {log?.status || "-"}
              </td>
              <td className="p-2">{log?.response_time ?? "-"}</td>
              <td className="p-2">
                {log?.checked_at
                  ? new Date(log.checked_at).toLocaleString()
                  : "-"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
