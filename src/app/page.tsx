"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["student", "professional", "business", "other"], { required_error: "Please select a role" }),
  terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch("password", "");
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 || !/[A-Z]/.test(password) ? 2 : password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 4 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "#f87171", "#fb923c", "#facc15", "#10b981"];

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Registered:", data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={{ ...styles.successTitle }}>You&apos;re in!</h2>
          <p style={styles.successSub}>Account created successfully. Check your email to verify your address.</p>
          <a href="/" style={styles.backBtn}>Back to home</a>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      {/* Background glow */}
      <div style={styles.glow1} aria-hidden="true" />
      <div style={styles.glow2} aria-hidden="true" />

      <div style={styles.wrapper}>
        {/* Left panel */}
        <div style={styles.leftPanel}>
          <div style={styles.logo}>◈ YourBrand</div>
          <h1 style={styles.headline}>
            Build something<br />
            <span style={styles.accent}>remarkable.</span>
          </h1>
          <p style={styles.tagline}>
            Join thousands of people who use our platform to turn their ideas into reality.
          </p>
          <div style={styles.features}>
            {[
              { icon: "⚡", text: "Get started in under 2 minutes" },
              { icon: "🔒", text: "Your data stays private, always" },
              { icon: "🌍", text: "Access from anywhere in the world" },
            ].map((f) => (
              <div key={f.text} style={styles.feature}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
          <div style={styles.socialProof}>
            <div style={styles.avatars}>
              {["A","B","C","D"].map((l, i) => (
                <div key={l} style={{ ...styles.avatar, marginLeft: i > 0 ? "-10px" : 0, background: ["#6c63ff","#a78bfa","#818cf8","#c4b5fd"][i] }}>
                  {l}
                </div>
              ))}
            </div>
            <span style={styles.socialText}>12,000+ people joined this month</span>
          </div>
        </div>

        {/* Form card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Create your account</h2>
            <p style={styles.cardSub}>Already have one? <a href="#" style={styles.link}>Sign in</a></p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form} noValidate>

            {/* Full Name */}
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                {...register("fullName")}
                placeholder="Jane Doe"
                style={{ ...styles.input, ...(errors.fullName ? styles.inputError : {}) }}
                autoComplete="name"
              />
              {errors.fullName && <span style={styles.err}>{errors.fullName.message}</span>}
            </div>

            {/* Email */}
            <div style={styles.field}>
              <label style={styles.label}>Email address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="jane@example.com"
                style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                autoComplete="email"
              />
              {errors.email && <span style={styles.err}>{errors.email.message}</span>}
            </div>

            {/* Phone (optional) */}
            <div style={styles.field}>
              <label style={styles.label}>
                Phone <span style={styles.optional}>(optional)</span>
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+1 555 000 0000"
                style={styles.input}
                autoComplete="tel"
              />
            </div>

            {/* Role */}
            <div style={styles.field}>
              <label style={styles.label}>I am a</label>
              <select
                {...register("role")}
                style={{ ...styles.input, ...styles.select, ...(errors.role ? styles.inputError : {}) }}
                defaultValue=""
              >
                <option value="" disabled>Select your role…</option>
                <option value="student">Student</option>
                <option value="professional">Professional</option>
                <option value="business">Business owner</option>
                <option value="other">Other</option>
              </select>
              {errors.role && <span style={styles.err}>{errors.role.message}</span>}
            </div>

            {/* Password */}
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.passWrap}>
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  style={{ ...styles.input, paddingRight: "48px", ...(errors.password ? styles.inputError : {}) }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn} aria-label="Toggle password visibility">
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div style={styles.strengthWrap}>
                  <div style={styles.strengthBar}>
                    {[1,2,3,4].map((n) => (
                      <div key={n} style={{ ...styles.strengthSegment, background: n <= strength ? strengthColor[strength] : "var(--border)" }} />
                    ))}
                  </div>
                  <span style={{ ...styles.strengthLabel, color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                </div>
              )}
              {errors.password && <span style={styles.err}>{errors.password.message}</span>}
            </div>

            {/* Confirm Password */}
            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passWrap}>
                <input
                  {...register("confirmPassword")}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  style={{ ...styles.input, paddingRight: "48px", ...(errors.confirmPassword ? styles.inputError : {}) }}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn} aria-label="Toggle confirm password visibility">
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
              {errors.confirmPassword && <span style={styles.err}>{errors.confirmPassword.message}</span>}
            </div>

            {/* Terms */}
            <div style={styles.checkRow}>
              <input {...register("terms")} type="checkbox" id="terms" style={styles.checkbox} />
              <label htmlFor="terms" style={styles.checkLabel}>
                I agree to the <a href="#" style={styles.link}>Terms of Service</a> and <a href="#" style={styles.link}>Privacy Policy</a>
              </label>
            </div>
            {errors.terms && <span style={{ ...styles.err, marginTop: "-8px" }}>{errors.terms.message}</span>}

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} style={{ ...styles.submitBtn, opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? (
                <span style={styles.spinner}>◌ Creating account…</span>
              ) : (
                "Create account →"
              )}
            </button>

            {/* Divider */}
            <div style={styles.divider}><span style={styles.dividerText}>or sign up with</span></div>

            {/* OAuth buttons */}
            <div style={styles.oauthRow}>
              {["Google","GitHub"].map((p) => (
                <button key={p} type="button" style={styles.oauthBtn}>{p}</button>
              ))}
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    position: "relative",
    overflow: "hidden",
    background: "var(--bg)",
  },
  glow1: {
    position: "absolute",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)",
    top: "-200px",
    left: "-100px",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)",
    bottom: "-150px",
    right: "-50px",
    pointerEvents: "none",
  },
  wrapper: {
    display: "flex",
    gap: "48px",
    alignItems: "center",
    maxWidth: "960px",
    width: "100%",
    zIndex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  leftPanel: {
    flex: "1",
    minWidth: "260px",
    maxWidth: "380px",
    padding: "8px 0",
  },
  logo: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    color: "var(--accent2)",
    marginBottom: "40px",
    letterSpacing: "-0.01em",
  },
  headline: {
    fontSize: "42px",
    lineHeight: 1.1,
    color: "var(--text)",
    marginBottom: "16px",
  },
  accent: {
    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  tagline: {
    color: "var(--muted)",
    fontSize: "16px",
    lineHeight: 1.6,
    marginBottom: "36px",
  },
  features: { display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" },
  feature: { display: "flex", alignItems: "center", gap: "12px" },
  featureIcon: { fontSize: "18px", flexShrink: 0 },
  featureText: { color: "#c8cad8", fontSize: "14px" },
  socialProof: { display: "flex", alignItems: "center", gap: "12px" },
  avatars: { display: "flex" },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: "white",
    border: "2px solid var(--bg)",
  },
  socialText: { color: "var(--muted)", fontSize: "13px" },

  /* Card */
  card: {
    flex: "1",
    minWidth: "300px",
    maxWidth: "440px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "36px 32px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.08)",
  },
  cardHeader: { marginBottom: "28px" },
  cardTitle: { fontSize: "24px", color: "var(--text)", marginBottom: "6px" },
  cardSub: { color: "var(--muted)", fontSize: "14px" },
  link: { color: "var(--accent2)", textDecoration: "none", fontWeight: 500 },

  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 500, color: "#9ca3c8", letterSpacing: "0.02em" },
  optional: { color: "var(--muted)", fontWeight: 400 },
  input: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "11px 14px",
    color: "var(--text)",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
    width: "100%",
  },
  select: { cursor: "pointer", appearance: "none", WebkitAppearance: "none" },
  inputError: { borderColor: "var(--error)" },
  err: { color: "var(--error)", fontSize: "12px", marginTop: "2px" },
  passWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    lineHeight: 1,
    padding: "4px",
  },
  strengthWrap: { display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" },
  strengthBar: { display: "flex", gap: "4px", flex: 1 },
  strengthSegment: { height: "4px", flex: 1, borderRadius: "2px", transition: "background 0.3s" },
  strengthLabel: { fontSize: "12px", fontWeight: 500, minWidth: "40px" },
  checkRow: { display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "4px" },
  checkbox: { marginTop: "3px", accentColor: "var(--accent)", cursor: "pointer", flexShrink: 0 },
  checkLabel: { fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 },
  submitBtn: {
    background: "linear-gradient(135deg, #6c63ff, #818cf8)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "13px 20px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s, transform 0.1s",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "-0.01em",
    marginTop: "4px",
  },
  spinner: { display: "inline-block", animation: "spin 1s linear infinite" },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "var(--muted)",
    fontSize: "12px",
  },
  dividerText: {
    whiteSpace: "nowrap",
    padding: "0 4px",
    background: "var(--surface)",
    position: "relative",
  },
  oauthRow: { display: "flex", gap: "12px" },
  oauthBtn: {
    flex: 1,
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "10px",
    color: "var(--text)",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },

  /* Success state */
  successCard: {
    textAlign: "center",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "56px 48px",
    maxWidth: "380px",
    width: "100%",
    zIndex: 1,
  },
  successIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "rgba(16,185,129,0.15)",
    color: "var(--success)",
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    border: "1px solid rgba(16,185,129,0.3)",
  },
  successTitle: { fontSize: "26px", color: "var(--text)", marginBottom: "10px" },
  successSub: { color: "var(--muted)", fontSize: "15px", lineHeight: 1.6, marginBottom: "28px" },
  backBtn: {
    display: "inline-block",
    background: "linear-gradient(135deg, #6c63ff, #818cf8)",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
    padding: "11px 28px",
    fontWeight: 600,
    fontSize: "14px",
    fontFamily: "'Space Grotesk', sans-serif",
  },
};
