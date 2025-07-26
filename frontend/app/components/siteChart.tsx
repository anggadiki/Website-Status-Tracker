"use client";

import { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Tooltip Custom
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded shadow border text-sm text-gray-800">
        <p className="font-semibold">Time: {label}</p>
        <p>Response: {payload[0].value} ms</p>
      </div>
    );
  }
  return null;
};

export default function SiteChart({ siteId }: { siteId: string }) {
  const [data, setData] = useState<any[]>([]);
  const dataRef = useRef<any[]>([]);

  const fetchChart = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/sites/${siteId}/logs/chart`
      );
      if (!res.ok) throw new Error("Failed to fetch chart");

      const raw = await res.json();

      const formatted = raw.map((item: any) => {
        const rawDate = new Date(item.checked_at);
        return {
          response_time: item.response_time,
          raw_checked_at: rawDate.toISOString(),
          checked_at: rawDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });

      // Gabungkan dengan data sebelumnya
      const merged = [...dataRef.current, ...formatted];

      // Filter duplikat berdasarkan waktu ISO dan jaga tetap dalam 24 jam
      const now = Date.now();
      const oneDayAgo = now - 24 * 60 * 60 * 1000;

      const uniqueMap = new Map<string, any>();
      for (const item of merged) {
        if (new Date(item.raw_checked_at).getTime() >= oneDayAgo) {
          uniqueMap.set(item.raw_checked_at, item);
        }
      }

      // Simpan dan batasi 100 data terbaru
      const result = Array.from(uniqueMap.values()).slice(-100);
      dataRef.current = result;
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchChart();
    const interval = setInterval(fetchChart, 30000); // Update tiap 30 detik
    return () => clearInterval(interval);
  }, [siteId]);

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="checked_at" tick={{ fontSize: 12 }} />
          <YAxis unit="ms" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="response_time"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorUv)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
