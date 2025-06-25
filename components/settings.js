// src/components/Settings.js
import React, { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { db } from "../firebase";
import "./settings.css";

const TIMEZONES = [
  "UTC−12:00","UTC−11:00","UTC−10:00","UTC−09:00",
  "UTC−08:00","UTC−07:00","UTC−06:00","UTC−05:00",
  "UTC−04:00","UTC−03:00","UTC−02:00","UTC−01:00",
  "UTC+00:00","UTC+01:00","UTC+02:00","UTC+03:00",
  "UTC+04:00","UTC+05:00","UTC+06:00","UTC+07:00",
  "UTC+08:00","UTC+09:00","UTC+10:00","UTC+11:00",
  "UTC+12:00"
];

const Settings = ({ user }) => {
  const [wifiSsid, setWifiSsid]         = useState("");
  const [wifiPass, setWifiPass]         = useState("");
  const [timezone, setTimezone]         = useState("UTC+00:00");
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      try {
        const snap = await get(ref(db, `users/${user.uid}/settings`));
        if (snap.exists()) {
          const s = snap.val();
          setWifiSsid(s.wifiSsid || "");
          setWifiPass(s.wifiPass || "");
          setTimezone(s.timezone || "UTC+00:00");
          setNotifEnabled(s.notifEnabled ?? true);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user.uid]);

  const handleSave = async () => {
    try {
      await set(ref(db, `users/${user.uid}/settings`), {
        wifiSsid,
        wifiPass,
        timezone,
        notifEnabled
      });
      alert("Settings saved!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save settings.");
    }
  };

  if (loading) return <p className="center">Loading settings…</p>;

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2>Settings</h2>

        <div className="setting-group">
          <h3>Wi‑Fi</h3>
          <label>
            SSID
            <input
              type="text"
              value={wifiSsid}
              onChange={e => setWifiSsid(e.target.value)}
              placeholder="Your network name"
              className = "setting-input-field network-name"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={wifiPass}
              onChange={e => setWifiPass(e.target.value)}
              placeholder="••••••••"
              className = "setting-input-field settings-password-input"
            />
          </label>
        </div>

        <div className="setting-group">
          <h3>Timezone</h3>
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div className="setting-group">
          <h3>Notifications</h3>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={notifEnabled}
              onChange={e => setNotifEnabled(e.target.checked)}
            />
            Enable notifications
          </label>
        </div>

        <div className="settings-actions">
          <button onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
