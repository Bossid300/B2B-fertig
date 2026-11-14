import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage({ resetToken, onLogin }) {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password) {
      alert("Bitte Passwort eingeben.");
      return;
    }

    if (password !== passwordRepeat) {
      alert("Passwörter stimmen nicht überein.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://www.gigsda.com/api/resetPassword.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            password,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
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
    } finally {
      setIsSubmitting(false);
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
          width: "min(420px, calc(100% - 32px))",
          background: "#071224",
          border: "1px solid #00d4ff",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        {isSuccess ? (
          <div style={{ textAlign: "center" }} role="status">
            <CheckCircle2
              size={48}
              color="#34d399"
              style={{ margin: "0 auto 16px" }}
              aria-hidden="true"
            />
            <h2 style={{ color: "white", marginBottom: "12px" }}>
              Passwort erfolgreich geändert.
            </h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.6, marginBottom: "24px" }}>
              Du kannst dich jetzt mit deinem neuen Passwort anmelden.
            </p>
            <button
              type="button"
              onClick={onLogin}
              style={{
                width: "100%",
                padding: "12px",
                background: "#06b6d4",
                color: "#082f49",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Zum Login
            </button>
          </div>
        ) : (
          <>
            <h2
              style={{
                color: "white",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Passwort zurücksetzen
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="Neues Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                style={{
                  boxSizing: "border-box",
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
                autoComplete="new-password"
                required
                style={{
                  boxSizing: "border-box",
                  width: "100%",
                  padding: "12px",
                  marginBottom: "20px",
                }}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#06b6d4",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSubmitting ? "wait" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "Wird gespeichert ..." : "Passwort speichern"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}