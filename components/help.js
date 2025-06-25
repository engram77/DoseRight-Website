// src/components/Help.js
import React from "react";
import "./help.css";

const Help = () => {
  return (
    <div className="help-page">
      <div className="help-container">
        <h2>Help &amp; FAQs</h2>

        <div className="faq">
          <h3>How do I schedule a new medicine?</h3>
          <p>
            Go to <strong>Schedule Medicine</strong>, click <em>Add Medicine</em>, fill out the form, then hit <em>Save</em>.
          </p>
        </div>

        <div className="faq">
          <h3>How do I edit or delete a medicine?</h3>
          <p>
            In <strong>Schedule Medicine</strong>, click <em>Edit</em>, make your changes (or hit <em>Delete</em>), then <em>Save</em>.
          </p>
        </div>

        <div className="faq">
          <h3>Where can I see my weekly adherence?</h3>
          <p>
            Head over to <strong>My Medicines</strong> and select a medicine from the dropdown to view your last 7 days.
          </p>
        </div>

        <div className="faq">
          <h3>Why am I not receiving notifications?</h3>
          <p>
            Make sure <strong>Notifications</strong> are enabled in <em>Settings</em> and your device is connected.
          </p>
        </div>

        <h3>Still need help?</h3>
        <p>
          Contact our support team at{" "}
          <a href="mailto:support@doseright.com">support@doseright.com</a> or call{" "}
          <a href="tel:1-800-123-4567">1‑800‑123‑4567</a>.
        </p>
      </div>
    </div>
  );
};

export default Help;
