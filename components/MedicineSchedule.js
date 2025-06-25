import React, { useState, useEffect } from "react";
import { ref, get, set, remove } from "firebase/database";
import { db } from "../firebase";
import "./MedicineSchedule.css";

const MedicineSchedule = ({ user }) => {
  const [medicines, setMedicines] = useState({});
  const [edited, setEdited] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const loadMedicines = async () => {
      try {
        const snap = await get(ref(db, `user/${user.uid}/medicines`));
        const data = snap.exists() ? snap.val() : {};
        setMedicines(data);
        setEdited(data);
      } catch (err) {
        console.error("Error loading medicines:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, [user.uid]);

  const handleFieldChange = (medKey, field, value) => {
    setEdited(prev => ({
      ...prev,
      [medKey]: {
        ...prev[medKey],
        [field]: value,
        ...(field === "frequency" && {
          times: Array.from({ length: Math.min(5, value) }, (_, i) =>
            prev[medKey]?.times?.[i] || ""
          )
        })
      }
    }));
  };

  const handleTimeChange = (medKey, index, value) => {
    const times = [...(edited[medKey].times || [])];
    times[index] = value;
    setEdited(prev => ({
      ...prev,
      [medKey]: { ...prev[medKey], times }
    }));
  };

  const handleRefillFieldChange = (medKey, field, value) => {
    setEdited(prev => {
      const med = prev[medKey];
      return {
        ...prev,
        [medKey]: {
          ...med,
          refill: {
            ...med.refill,
            [field]: value
          }
        }
      };
    });
  };

  const handleSave = async () => {
    try {
      const normalized = Object.fromEntries(
        Object.entries(edited).map(([key, med]) => {
          const r = med.refill || {};
          return [key, {
            ...med,
            refill: {
              ...r,
              initialQuantity: Number(r.initialQuantity) || 0,
              pillsLeft: Number(r.pillsLeft) || 0
            }
          }];
        })
      );
      await set(ref(db, `user/${user.uid}/medicines`), normalized);
      setMedicines(normalized);
      setIsEditing(false);
      alert("Medicines saved successfully!");
    } catch (err) {
      console.error("Error saving medicines:", err);
      alert("Failed to save medicines.");
    }
  };

  const handleCancel = () => {
    setEdited(medicines);
    setIsEditing(false);
  };

  const handleDelete = async medKey => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await remove(ref(db, `user/${user.uid}/medicines/${medKey}`));
      const updated = { ...edited };
      delete updated[medKey];
      setEdited(updated);
      alert("Medicine deleted successfully!");
    } catch (err) {
      console.error("Error deleting medicine:", err);
      alert("Failed to delete the medicine.");
    }
  };

  const handleAdd = () => {
    const id = `med${Date.now()}`;
    setEdited(prev => ({
      ...prev,
      [id]: {
        name: "",
        dose: 1,
        frequency: 1,
        times: [""],
        startDate: "",
        endDate: "",
        repeat: "daily",
        refill: {
          initialQuantity: "",
          pillsLeft: "",
          refillNeeded: false,
          refillNotificationSent: false,
          estimatedRefillDate: ""
        }
      }
    }));
    setIsEditing(true);
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading medicine schedule...</p>;
  }

  return (
    <div className="medicine-schedule-page">
      <div className="medicine-schedule-container">
        <h2>Medicine Schedule</h2>

        {Object.entries(edited).map(([medKey, med]) => (
          <div className="med-card" key={medKey}>
            <div className="med-fields">
              <label>
                Name:
                <input
                  value={med.name}
                  onChange={e => handleFieldChange(medKey, "name", e.target.value)}
                  disabled={!isEditing}
                />
              </label>

              <label>
                Dose:
                <input
                  type="number"
                  min="1"
                  value={med.dose}
                  onChange={e => handleFieldChange(medKey, "dose", e.target.value)}
                  disabled={!isEditing}
                />
              </label>

              <label>
                Frequency (max 5):
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={med.frequency || 1}
                  onChange={e =>
                    handleFieldChange(medKey, "frequency", Number(e.target.value))
                  }
                  disabled={!isEditing}
                />
              </label>

              <div className="time-slots">
                <p><strong>Time Slots:</strong></p>
                {med.times?.map((time, i) => (
                  <label key={i}>
                    Slot {i + 1}:
                    <input
                      type="time"
                      value={time}
                      onChange={e => handleTimeChange(medKey, i, e.target.value)}
                      disabled={!isEditing}
                    />
                  </label>
                ))}
              </div>

              <label>
                Start Date:
                <input
                  type="date"
                  value={med.startDate}
                  onChange={e => handleFieldChange(medKey, "startDate", e.target.value)}
                  disabled={!isEditing}
                />
              </label>

              <label>
                End Date:
                <input
                  type="date"
                  value={med.endDate}
                  onChange={e => handleFieldChange(medKey, "endDate", e.target.value)}
                  disabled={!isEditing}
                />
              </label>
            </div>

            <h4 className="refill-header">Refill Information</h4>
            <div className="med-fields">
              <label className="checkbox-label">
                Refill Needed?
                <input
                  type="checkbox"
                  checked={!!med.refill?.refillNeeded}
                  onChange={e =>
                    handleRefillFieldChange(medKey, "refillNeeded", e.target.checked)
                  }
                  disabled={!isEditing}
                />
              </label>

              <label>
                Initial Quantity:
                <input
                  type="number"
                  min="0"
                  value={med.refill?.initialQuantity ?? ""}
                  placeholder="0"
                  onChange={e =>
                    handleRefillFieldChange(medKey, "initialQuantity", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </label>

              <label>
                Pills Left:
                <input
                  type="number"
                  min="0"
                  value={med.refill?.pillsLeft ?? ""}
                  placeholder="0"
                  onChange={e =>
                    handleRefillFieldChange(medKey, "pillsLeft", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </label>

              <label className="checkbox-label">
                Notification Sent?
                <input
                  type="checkbox"
                  checked={!!med.refill?.refillNotificationSent}
                  onChange={e =>
                    handleRefillFieldChange(medKey, "refillNotificationSent", e.target.checked)
                  }
                  disabled={!isEditing}
                />
              </label>

              <label className="date-clear-wrapper">
                Estimated Refill Date:
                <input
                  type="date"
                  value={med.refill?.estimatedRefillDate || ""}
                  onChange={e =>
                    handleRefillFieldChange(medKey, "estimatedRefillDate", e.target.value)
                  }
                  disabled={!isEditing}
                />
                {isEditing && med.refill?.estimatedRefillDate && (
                  <button
                    type="button"
                    className="clear-date-btn"
                    onClick={() =>
                      handleRefillFieldChange(medKey, "estimatedRefillDate", "")
                    }
                  >
                    Clear
                  </button>
                )}
              </label>
            </div>

            {isEditing && (
              <button className="delete-btn" onClick={() => handleDelete(medKey)}>
                Delete
              </button>
            )}
          </div>
        ))}

        <div className="controls">
          {!isEditing ? (
            <>
              <button onClick={handleAdd}>Add Medicine</button>
              <button onClick={() => { setEdited(medicines); setIsEditing(true); }}>
                Edit
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineSchedule;
