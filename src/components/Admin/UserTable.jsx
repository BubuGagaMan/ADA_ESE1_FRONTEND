import LoadingSpinner from "../LoadingSpinner";

const UserTable = ({ users, isLoading, onSuspendClick }) => {
  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
    >
      <thead>
        <tr
          style={{
            backgroundColor: "var(--background-color)",
            borderBottom: "2px solid var(--border-color)",
          }}
        >
          <th style={{ padding: "12px" }}>Username</th>
          <th style={{ padding: "12px" }}>Email</th>
          <th style={{ padding: "12px" }}>Role</th>
          <th style={{ padding: "12px" }}>Status</th>
          <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan="5" style={{ padding: "40px 0" }}>
              <LoadingSpinner message="Fetching users..." />
            </td>
          </tr>
        ) : users.length === 0 ? (
          <tr>
            <td
              colSpan="5"
              style={{
                padding: "20px",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              No users found.
            </td>
          </tr>
        ) : (
          users.map((u) => (
            <tr
              key={u.id}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td style={{ padding: "12px" }}>{u.username}</td>
              <td style={{ padding: "12px", color: "var(--text-muted)" }}>
                {u.email}
              </td>
              <td style={{ padding: "12px" }}>
                {u.roles.map((r) => (
                  <span
                    key={r.id}
                    style={{
                      fontSize: "0.8em",
                      backgroundColor: "rgba(13, 148, 136, 0.15)",
                      color: "var(--primary-color)",
                      border: "1px solid rgba(13, 148, 136, 0.3)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      marginRight: "5px",
                      fontWeight: "600",
                    }}
                  >
                    {r.name}
                  </span>
                ))}
              </td>
              <td style={{ padding: "12px" }}>
                <span
                  style={{
                    color: u.suspended
                      ? "var(--danger-color)"
                      : "var(--success-color)",
                    fontWeight: "600",
                  }}
                >
                  {u.suspended ? "Suspended" : "Active"}
                </span>
              </td>
              <td style={{ padding: "12px", textAlign: "right" }}>
                <button
                  onClick={() => onSuspendClick(u)}
                  style={{
                    padding: "6px 12px",
                    fontSize: "0.85em",
                    backgroundColor: u.suspended
                      ? "#d97706"
                      : "var(--danger-color)",
                  }}
                >
                  {u.suspended ? "Unsuspend" : "Suspend"}
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default UserTable;
