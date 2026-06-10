"use client";
import { useState } from "react";

const MOCK_USERS = [
  { id: 1, name: "Alice Rahman",   email: "alice@example.com",  role: "student",      date: "2025-06-01", status: "active" },
  { id: 2, name: "Bob Hossain",    email: "bob@example.com",    role: "professional", date: "2025-06-03", status: "active" },
  { id: 3, name: "Carla Ahmed",    email: "carla@example.com",  role: "business",     date: "2025-06-05", status: "inactive" },
  { id: 4, name: "David Islam",    email: "david@example.com",  role: "student",      date: "2025-06-07", status: "active" },
  { id: 5, name: "Eva Begum",      email: "eva@example.com",    role: "other",        date: "2025-06-08", status: "active" },
  { id: 6, name: "Farhan Karim",   email: "farhan@example.com", role: "professional", date: "2025-06-09", status: "active" },
  { id: 7, name: "Gulshan Akter",  email: "gulshan@example.com",role: "student",      date: "2025-06-09", status: "inactive" },
];

const STATS = [
  { label: "Total Users",     value: "247",  delta: "+12 this week",  color: "#6c63ff", icon: "👥" },
  { label: "Active",          value: "198",  delta: "+8 this week",   color: "#10b981", icon: "✅" },
  { label: "New Today",       value: "14",   delta: "+3 vs yesterday",color: "#a78bfa", icon: "🆕" },
  { label: "Inactive",        value: "49",   delta: "-2 this week",   color: "#f87171", icon: "⚠️" },
];

const ROLE_COLORS: Record<string, string> = {
  student:      "#6c63ff",
  professional: "#10b981",
  business:     "#f59e0b",
  other:        "#6b7280",
};

export default function AdminPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loggedIn, setLoggedIn] = useState(false);
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState<"dashboard" | "users">("dashboard");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Simple demo login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === "admin123") { setLoggedIn(true); setLoginErr(""); }
    else setLoginErr("Wrong password. (hint: admin123)");
  };

  if (!loggedIn) {
    return (
      <main style={s.loginPage}>
        <div style={s.loginCard}>
          <div style={s.loginLogo}>◈ Admin</div>
          <h2 style={s.loginTitle}>Sign in to dashboard</h2>
          <form onSubmit={handleLogin} style={s.loginForm}>
            <input value="admin" readOnly style={s.loginInput} />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              style={s.loginInput}
              autoFocus
            />
            {loginErr && <p style={s.loginErr}>{loginErr}</p>}
            <button type="submit" style={s.loginBtn}>Sign in →</button>
          </form>
        </div>
      </main>
    );
  }

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleStatus = (id: number) => {
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    setDeleteId(null);
  };

  return (
    <div style={s.shell}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>◈ YourBrand</div>
        <nav style={s.nav}>
          {([["dashboard", "📊", "Dashboard"], ["users", "👥", "Users"]] as const).map(([key, icon, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ ...s.navItem, ...(tab === key ? s.navActive : {}) }}>
              <span>{icon}</span> {label}
            </button>
          ))}
        </nav>
        <div style={s.sidebarFooter}>
          <div style={s.adminBadge}>Admin</div>
          <button onClick={() => setLoggedIn(false)} style={s.signOutBtn}>Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <header style={s.header}>
          <h1 style={s.pageTitle}>{tab === "dashboard" ? "Overview" : "User Management"}</h1>
          <a href="/" style={s.viewSiteBtn} target="_blank">View site ↗</a>
        </header>

        {tab === "dashboard" && (
          <>
            <div style={s.statsGrid}>
              {STATS.map((st) => (
                <div key={st.label} style={s.statCard}>
                  <div style={s.statTop}>
                    <span style={s.statIcon}>{st.icon}</span>
                    <span style={{ ...s.statValue, color: st.color }}>{st.value}</span>
                  </div>
                  <div style={s.statLabel}>{st.label}</div>
                  <div style={s.statDelta}>{st.delta}</div>
                </div>
              ))}
            </div>

            {/* Role breakdown */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Users by Role</h2>
              <div style={s.rolesGrid}>
                {(["student","professional","business","other"] as const).map((role) => {
                  const count = users.filter((u) => u.role === role).length;
                  const pct = Math.round((count / users.length) * 100);
                  return (
                    <div key={role} style={s.roleCard}>
                      <div style={s.roleHeader}>
                        <span style={{ ...s.roleDot, background: ROLE_COLORS[role] }} />
                        <span style={s.roleName}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                        <span style={s.roleCount}>{count}</span>
                      </div>
                      <div style={s.barBg}>
                        <div style={{ ...s.barFill, width: `${pct}%`, background: ROLE_COLORS[role] }} />
                      </div>
                      <span style={s.rolePct}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent registrations */}
            <div style={s.section}>
              <h2 style={s.sectionTitle}>Recent Registrations</h2>
              <div style={s.recentList}>
                {users.slice(-5).reverse().map((u) => (
                  <div key={u.id} style={s.recentRow}>
                    <div style={{ ...s.userAvatar, background: ROLE_COLORS[u.role] }}>{u.name[0]}</div>
                    <div>
                      <div style={s.recentName}>{u.name}</div>
                      <div style={s.recentEmail}>{u.email}</div>
                    </div>
                    <div style={s.recentDate}>{u.date}</div>
                    <div style={{ ...s.statusPill, background: u.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)", color: u.status === "active" ? "#10b981" : "#f87171" }}>
                      {u.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            {/* Filters */}
            <div style={s.toolbar}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                style={s.searchInput}
              />
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={s.select}>
                <option value="all">All roles</option>
                <option value="student">Student</option>
                <option value="professional">Professional</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={s.select}>
                <option value="all">All status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <span style={s.resultCount}>{filtered.length} users</span>
            </div>

            {/* Table */}
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    {["User","Email","Role","Joined","Status","Actions"].map((h) => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} style={s.tr}>
                      <td style={s.td}>
                        <div style={s.userCell}>
                          <div style={{ ...s.userAvatar, background: ROLE_COLORS[u.role] }}>{u.name[0]}</div>
                          <span style={s.userName}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ ...s.td, ...s.emailCell }}>{u.email}</td>
                      <td style={s.td}>
                        <span style={{ ...s.rolePill, background: `${ROLE_COLORS[u.role]}22`, color: ROLE_COLORS[u.role] }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ ...s.td, ...s.dateCell }}>{u.date}</td>
                      <td style={s.td}>
                        <span style={{ ...s.statusPill, background: u.status === "active" ? "rgba(16,185,129,0.15)" : "rgba(248,113,113,0.15)", color: u.status === "active" ? "#10b981" : "#f87171" }}>
                          {u.status}
                        </span>
                      </td>
                      <td style={s.td}>
                        <div style={s.actions}>
                          <button onClick={() => toggleStatus(u.id)} style={s.actionBtn} title="Toggle status">⇄</button>
                          <button onClick={() => setDeleteId(u.id)} style={{ ...s.actionBtn, color: "#f87171" }} title="Delete">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={s.empty}>No users match your filters.</div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Delete confirm modal */}
      {deleteId !== null && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={s.modalTitle}>Delete user?</h3>
            <p style={s.modalSub}>This action cannot be undone.</p>
            <div style={s.modalBtns}>
              <button onClick={() => setDeleteId(null)} style={s.cancelBtn}>Cancel</button>
              <button onClick={() => deleteUser(deleteId)} style={s.deleteBtn}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  shell: { display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" },
  sidebar: {
    width: "220px", flexShrink: 0,
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    display: "flex", flexDirection: "column",
    padding: "24px 16px",
    position: "sticky", top: 0, height: "100vh",
  },
  sidebarLogo: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--accent2)", marginBottom: "32px", paddingLeft: "8px" },
  nav: { display: "flex", flexDirection: "column", gap: "4px", flex: 1 },
  navItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "none", background: "none", color: "var(--muted)", fontSize: "14px", fontWeight: 500, cursor: "pointer", textAlign: "left" },
  navActive: { background: "rgba(108,99,255,0.15)", color: "var(--accent2)" },
  sidebarFooter: { borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px" },
  adminBadge: { fontSize: "12px", color: "var(--muted)", paddingLeft: "4px" },
  signOutBtn: { background: "none", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--muted)", fontSize: "13px", padding: "8px 12px", cursor: "pointer" },
  main: { flex: 1, padding: "32px 36px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  pageTitle: { fontSize: "26px", color: "var(--text)" },
  viewSiteBtn: { fontSize: "13px", color: "var(--accent2)", textDecoration: "none", border: "1px solid rgba(108,99,255,0.3)", borderRadius: "8px", padding: "7px 14px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px", marginBottom: "28px" },
  statCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  statIcon: { fontSize: "20px" },
  statValue: { fontSize: "28px", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" },
  statLabel: { fontSize: "13px", color: "var(--muted)", marginBottom: "4px" },
  statDelta: { fontSize: "12px", color: "#6b7280" },
  section: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", marginBottom: "20px" },
  sectionTitle: { fontSize: "16px", color: "var(--text)", marginBottom: "18px" },
  rolesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "14px" },
  roleCard: { background: "var(--surface2)", borderRadius: "10px", padding: "14px" },
  roleHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" },
  roleDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 },
  roleName: { fontSize: "13px", fontWeight: 500, color: "var(--text)", flex: 1, textTransform: "capitalize" },
  roleCount: { fontSize: "18px", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", color: "var(--text)" },
  barBg: { height: "4px", background: "var(--border)", borderRadius: "2px", marginBottom: "6px" },
  barFill: { height: "4px", borderRadius: "2px", transition: "width 0.6s ease" },
  rolePct: { fontSize: "11px", color: "var(--muted)" },
  recentList: { display: "flex", flexDirection: "column", gap: "10px" },
  recentRow: { display: "flex", alignItems: "center", gap: "14px", padding: "10px 14px", background: "var(--surface2)", borderRadius: "10px" },
  recentName: { fontSize: "14px", fontWeight: 500, color: "var(--text)" },
  recentEmail: { fontSize: "12px", color: "var(--muted)" },
  recentDate: { fontSize: "12px", color: "var(--muted)", marginLeft: "auto" },
  userAvatar: { width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 600, color: "white", flexShrink: 0 },
  toolbar: { display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" },
  searchInput: { flex: 1, minWidth: "200px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px 14px", color: "var(--text)", fontSize: "14px" },
  select: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px 12px", color: "var(--text)", fontSize: "13px", cursor: "pointer" },
  resultCount: { fontSize: "13px", color: "var(--muted)", flexShrink: 0 },
  tableWrap: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "var(--surface2)" },
  th: { padding: "12px 16px", fontSize: "12px", color: "var(--muted)", fontWeight: 500, textAlign: "left", letterSpacing: "0.04em", textTransform: "uppercase", borderBottom: "1px solid var(--border)" },
  tr: { borderBottom: "1px solid var(--border)", transition: "background 0.15s" },
  td: { padding: "12px 16px", fontSize: "14px", color: "var(--text)", verticalAlign: "middle" },
  userCell: { display: "flex", alignItems: "center", gap: "10px" },
  userName: { fontWeight: 500 },
  emailCell: { color: "var(--muted)", fontSize: "13px" },
  dateCell: { color: "var(--muted)", fontSize: "12px" },
  rolePill: { fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px", display: "inline-block", textTransform: "capitalize" },
  statusPill: { fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px", display: "inline-block", textTransform: "capitalize" },
  actions: { display: "flex", gap: "8px" },
  actionBtn: { background: "none", border: "1px solid var(--border)", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontSize: "14px", color: "var(--muted)" },
  empty: { textAlign: "center", padding: "40px", color: "var(--muted)", fontSize: "14px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px", maxWidth: "340px", width: "100%" },
  modalTitle: { fontSize: "18px", color: "var(--text)", marginBottom: "8px" },
  modalSub: { color: "var(--muted)", fontSize: "14px", marginBottom: "24px" },
  modalBtns: { display: "flex", gap: "12px" },
  cancelBtn: { flex: 1, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)", padding: "10px", cursor: "pointer", fontSize: "14px" },
  deleteBtn: { flex: 1, background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "8px", color: "#f87171", padding: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
  loginPage: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" },
  loginCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", padding: "40px 36px", width: "100%", maxWidth: "360px" },
  loginLogo: { fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "18px", color: "var(--accent2)", marginBottom: "20px" },
  loginTitle: { fontSize: "22px", color: "var(--text)", marginBottom: "24px" },
  loginForm: { display: "flex", flexDirection: "column", gap: "12px" },
  loginInput: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "11px 14px", color: "var(--text)", fontSize: "15px" },
  loginErr: { color: "var(--error)", fontSize: "13px" },
  loginBtn: { background: "linear-gradient(135deg,#6c63ff,#818cf8)", color: "white", border: "none", borderRadius: "10px", padding: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" },
};
