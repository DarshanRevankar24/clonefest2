import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.adminStats();
        setStats(data);
      } catch (e) {
        setStats({ message: "Admin stats not available (placeholder)." });
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl">Admin</h2>
      <div className="mt-4 bg-[var(--card)] p-4 rounded">
        <pre className="text-sm">{JSON.stringify(stats, null, 2)}</pre>
      </div>
    </div>
  );
}
