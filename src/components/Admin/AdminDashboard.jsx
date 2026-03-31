import { useState, useEffect } from "react";
import { apiClient } from "../../api/apiClient";
import { ToastContainer, toast } from "react-toastify";
import UserTable from "./UserTable";
import SuspendUserModal from "./SuspendUserModal";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState(null);

  const fetchUsers = async (page = 1, searchQuery = search) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/get-all-users", {
        params: { page, limit: 20, search: searchQuery },
      });
      setUsers(response.data.data.users);
      setMeta(response.data.data.meta);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleToggleSuspend = async (userId, reason) => {
    try {
      await apiClient.post(`/swap-suspend-status/${userId}`, {
        message: reason,
      });
      toast.success("User suspension status updated successfully!");
      setUserToSuspend(null);
      fetchUsers(meta.currentPage);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change suspension status.",
      );
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <ToastContainer position="top-center" theme="dark" />
      <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

      <SuspendUserModal
        user={userToSuspend}
        onClose={() => setUserToSuspend(null)}
        onConfirm={handleToggleSuspend}
      />

      <input
        type="text"
        placeholder="Search users by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: "20px", padding: "10px" }}
      />

      <div
        className="diet-card"
        style={{ overflowX: "auto", borderRadius: "8px" }}
      >
        <UserTable
          users={users}
          isLoading={isLoading}
          onSuspendClick={(user) => setUserToSuspend(user)}
        />
      </div>

      {meta.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <button
            disabled={meta.currentPage === 1}
            onClick={() => fetchUsers(meta.currentPage - 1)}
            style={{
              backgroundColor:
                meta.currentPage === 1
                  ? "var(--border-color)"
                  : "var(--primary-color)",
            }}
          >
            &larr; Prev
          </button>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9em" }}>
            Page {meta.currentPage} of {meta.totalPages} (Total Users:{" "}
            {meta.totalItems})
          </span>
          <button
            disabled={meta.currentPage === meta.totalPages}
            onClick={() => fetchUsers(meta.currentPage + 1)}
            style={{
              backgroundColor:
                meta.currentPage === meta.totalPages
                  ? "var(--border-color)"
                  : "var(--primary-color)",
            }}
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
