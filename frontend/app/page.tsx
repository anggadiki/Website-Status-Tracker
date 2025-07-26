"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { fetchSites } from "./store/siteSlice";
import SiteTable from "./components/siteTable";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const sites = useSelector((state: RootState) => state.site.sites);

  const [form, setForm] = useState({ url: "", name: "" });

  const handleAdd = async () => {
    await fetch("http://localhost:3001/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ url: "", name: "" });
    dispatch(fetchSites());
  };

  useEffect(() => {
    dispatch(fetchSites());
    const interval = setInterval(() => {
      dispatch(fetchSites());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📡 Monitoring Dashboard</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="https://example.com"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Nama Website"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Tambah
        </button>
      </div>

      <SiteTable sites={sites} />
    </main>
  );
}
