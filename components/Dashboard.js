import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ user }) => {
  const [allMeds, setAllMeds]               = useState({});
  const [medicineEntries, setMedicineEntries] = useState([]);
  const [refillAlertCount, setRefillAlertCount] = useState(0);
  const [deviceStatus, setDeviceStatus]     = useState("Checking...");
  const [loading, setLoading]               = useState(true);
  const [now, setNow]                       = useState(new Date());

  // real‑time clock
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const snap = await get(ref(db, "/device/status"));
        const val = snap.exists() ? snap.val() : "";
        setDeviceStatus(val === "Device connected" ? "Connected" : "Not Connected");
      } catch {
        setDeviceStatus("Unknown");
      }
    };

    const fetchMedicines = async () => {
      try {
        const snap = await get(ref(db, `user/${user.uid}/medicines`));
        let entries = [];
        let alertCount = 0;
        if (snap.exists()) {
          const data = snap.val();
          setAllMeds(data);

          Object.entries(data).forEach(([medId, med]) => {
            const pillsLeft = Number(med.refill?.pillsLeft ?? Infinity);
            const needsRefill = med.refill?.refillNeeded === true || pillsLeft <= 0;
            if (needsRefill) alertCount++;

            if (Array.isArray(med.times)) {
              med.times.forEach(timeStr => {
                const [h, m] = timeStr.split(":").map(Number);
                const currentMin = now.getHours() * 60 + now.getMinutes();
                const medMin     = h * 60 + m;
                const status     = medMin < currentMin ? "Taken" : "Pending";
                entries.push({ time: timeStr, name: med.name, status });
              });
            }
          });
        }
        setMedicineEntries(entries);
        setRefillAlertCount(alertCount);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    fetchMedicines();
  }, [user.uid, now]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading Dashboard...</p>;
  }

  // Build Refill Needed list and Inventory summary
  const refillList = Object.entries(allMeds)
    .filter(([_, med]) => {
      const pillsLeft = Number(med.refill?.pillsLeft ?? Infinity);
      return med.refill?.refillNeeded === true || pillsLeft <= 0;
    })
    .map(([_, med]) => med.name);

  const inventoryList = Object.entries(allMeds).map(([_, med]) => ({
    name: med.name,
    stock: med.refill?.pillsLeft ?? 0
  }));
  const totalMeds = inventoryList.length;

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="refill-needed-card">
          <h3>Refill Needed</h3>
          {refillList.length === 0 ? (
            <p>None</p>
          ) : (
            <ul>
              {refillList.map((name, i) => <li key={i}>{name}</li>)}
            </ul>
          )}
        </div>
        <div className="inventory-card">
          <h3>Inventory Summary</h3>
          <table>
            <thead>
              <tr><th>Medicine</th><th>Stock</th></tr>
            </thead>
            <tbody>
              {inventoryList.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total medicines: {totalMeds}</p>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <div className="left-column">
          <div className="date-time">
            <h2>
              {now.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </h2>
            <h3>{now.toLocaleTimeString()}</h3>
          </div>

          <div className="medicines-card">
            <h4>Today's Medicines</h4>
            {medicineEntries.length === 0 ? (
              <p>No medicine scheduled for today.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Medicine</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medicineEntries.map((e, idx) => (
                    <tr key={idx}>
                      <td>{e.time}</td>
                      <td>{e.name}</td>
                      <td className={`status ${e.status.toLowerCase()}`}>
                        {e.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className="status-badge">
            <p>Device Status: <strong>{deviceStatus}</strong></p>
          </div>

          <div className="settings-card">
            <h4>Settings</h4>
            <ul>
              <li><Link to="/settings">Wi‑Fi</Link></li>
              <li><Link to="/settings">Timezone</Link></li>
              <li><Link to="/settings">Notifications</Link></li>
              <li><Link to="/help">Help</Link></li>
            </ul>
            <div className="refill-card">
              <p>Refill Alerts</p>
              <p className="refill-count">{refillAlertCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
