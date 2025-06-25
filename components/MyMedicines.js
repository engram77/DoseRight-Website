import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import "./MyMedicines.css";

const MyMedicines = ({ user }) => {
  const [meds, setMeds]       = useState({});
  const [logs, setLogs]       = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);

  // Fetch medicines & logs
  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      try {
        const [medSnap, logSnap] = await Promise.all([
          get(ref(db, `user/${user.uid}/medicines`)),
          get(ref(db, `user/${user.uid}/logs`)),
        ]);
        const medData = medSnap.exists() ? medSnap.val() : {};
        setMeds(medData);
        setSelectedKey(Object.keys(medData)[0] || null);
        setLogs(logSnap.exists() ? logSnap.val() : {});
      } catch (err) {
        console.error("Error loading medicines/logs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.uid]);

  if (loading) {
    return <p className="center">Loading…</p>;
  }

  const entries = Object.entries(meds);
  if (!entries.length) {
    return <p className="center">No medicines yet! Add one in the Schedule.</p>;
  }

  const activeKey = selectedKey || entries[0][0];
  const med       = meds[activeKey];

  // Today at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start of week (Sunday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  // Build 7‑day array
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  // Parse schedule window
  const startDate = med.startDate ? new Date(med.startDate) : null;
  const endDate   = med.endDate   ? new Date(med.endDate)   : null;

  // Same status logic as Dashboard
  const computeStatus = (day) => {
    const key = day.toISOString().split("T")[0];
    const logged = logs[key]?.[activeKey]?.status;
  
    if (logged) {
      return logged.charAt(0).toUpperCase() + logged.slice(1);
    }
  
    // Fallback like Dashboard
    if (!startDate || !endDate || day < startDate || day > endDate) {
      return "N/A";
    }
  
    const currentTime = new Date();
    if (day < new Date().setHours(0, 0, 0, 0)) {
      return "Taken"; // Past days = taken
    }
  
    if (day.toDateString() === currentTime.toDateString()) {
      const [hour, minute] = (med.times?.[0] || "00:00").split(":").map(Number);
      const medTime = new Date(currentTime);
      medTime.setHours(hour, minute, 0, 0);
      return currentTime > medTime ? "Taken" : "Pending";
    }
  
    return "Pending";
  };
  
  return (
    <div className="mymedicines-page">
      <div className="mymedicines-container">
        <h2>My Medicines</h2>
        <div className="mymedicines-flex">

          {/* Selector Panel */}
          <div className="med-list">
            <label htmlFor="med-select">Select Medicine:</label>
            <select
              id="med-select"
              value={activeKey}
              onChange={(e) => setSelectedKey(e.target.value)}
            >
              {entries.map(([key, m]) => (
                <option key={key} value={key}>
                  {m.name}
                </option>
              ))}
            </select>

            <p className="stock-label">
              Stock: <strong>{med.refill?.pillsLeft ?? 0}</strong>
            </p>

            {/* NEW: initial quantity display */}
            <p className="initial-label">
              Initial Quantity: <strong>{med.refill?.initialQuantity ?? 0}</strong>
            </p>

            { (med.refill?.pillsLeft ?? 0) === 0 && (
              <p className="out-of-medicine">⚠️ Out of medicine!</p>
            ) }
          </div>

          {/* Weekly Report Panel */}
          <div className="med-report">
            <table className="weekly-record">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {weekDates.map((day) => {
                  const status = computeStatus(day);
                  const cls    = status.toLowerCase().replace(/[^a-z]/g, "");
                  return (
                    <tr key={day.toISOString()}>
                      <td>
                        {day.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className={`status ${cls}`}>{status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyMedicines;
