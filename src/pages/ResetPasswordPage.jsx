import React, { useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleSubmit = async () => {
    if (!password) {
      alert("Bitte Passwort eingeben.");
      return;
    }

    if (password !== passwordRepeat) {
      alert("Passwörter stimmen nicht überein.");
      return;
    }

    const token = new URLSearchParams(
      window.location.search
    ).get("resetToken");

    try {
      const response = await fetch(
        "https://www.gigsda.com/api/resetPassword.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(
          "Passwort erfolgreich geändert. Du kannst dich jetzt mit deinem neuen Passwort anmelden."
        );

        window.location.href =
          "https://www.gigsda.com";
      } else {
        alert(
          result.error ||
          "Fehler beim Zurücksetzen."
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Serverfehler beim Zurücksetzen."
      );
    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#020617",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#071224",
          border: "1px solid #00d4ff",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <h2
          style={{
            color: "white",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Passwort zurücksetzen
        </h2>

        <input
          type="password"
          placeholder="Neues Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
          }}
        />

        <input
          type="password"
          placeholder="Passwort wiederholen"
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            background: "#06b6d4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Passwort speichern
        </button>
      </div>
    </div>
  );
}