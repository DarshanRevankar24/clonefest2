// src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await api.adminStats();
      setStats(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load admin stats");
      setStats({ message: "Admin stats not available." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

      <div className="mt-4 bg-[var(--card)] p-4 rounded">
        {loading ? (
          <div className="text-[var(--muted)]">Loading stats...</div>
        ) : stats ? (
          <div>
            {/* If stats has known keys, render nicely */}
            {stats.users || stats.images || stats.albums ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {stats.users && (
                  <div className="p-3 bg-[var(--muted-bg)] rounded">
                    <div className="text-lg font-bold">{stats.users}</div>
                    <div className="text-sm text-[var(--muted)]">Users</div>
                  </div>
                )}
                {stats.images && (
                  <div className="p-3 bg-[var(--muted-bg)] rounded">
                    <div className="text-lg font-bold">{stats.images}</div>
                    <div className="text-sm text-[var(--muted)]">Images</div>
                  </div>
                )}
                {stats.albums && (
                  <div className="p-3 bg-[var(--muted-bg)] rounded">
                    <div className="text-lg font-bold">{stats.albums}</div>
                    <div className="text-sm text-[var(--muted)]">Albums</div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Raw JSON fallback for debugging */}
            <pre className="text-xs bg-black/10 p-2 rounded overflow-x-auto">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-[var(--muted)]">No stats available.</div>
        )}
      </div>
    </div>
  );
}
