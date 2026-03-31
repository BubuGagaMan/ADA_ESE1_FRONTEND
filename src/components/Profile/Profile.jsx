import React, { useState, useEffect, useContext } from "react";
import { apiClient } from "../../api/apiClient";
import { AuthContext } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "../LoadingSpinner";

import AvatarUpload from "./AvatarUpload";
import AccountSettings from "./AccountSettings";
import PhysicalMetrics from "./PhysicalMetrics";

const Profile = () => {
  const { user, setUser, logout, requestUserUpdate, confirmUserUpdate } =
    useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [metricsData, setMetricsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userRes, metricsRes] = await Promise.all([
          apiClient.get("/user"),
          apiClient.get("/user-metrics"),
        ]);

        const u = userRes.data?.data?.user;
        const m = metricsRes.data?.data?.userMetrics;

        if (u) setAvatarUrl(u.profile_image_url || null);

        if (m) {
          setMetricsData({
            dob: m.dob ? m.dob.split("T")[0] : "",
            weight: m.weight ? m.weight / 10 : "",
            height: m.height ? m.height / 10 : "",
            sex: m.sex !== undefined ? m.sex : 0,
            activityLevel: m.activity_level ? m.activity_level : 1.2,
          });
        }
      } catch (error) {
        console.error("failed to fetch profile data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <ToastContainer position="top-center" theme="dark" />
      <h1 style={{ marginBottom: "30px" }}>Your Profile</h1>

      <div
        style={{
          display: "grid",
          gap: "30px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        <div
          className="diet-card"
          style={{
            padding: "25px",
            borderRadius: "8px",
            height: "fit-content",
          }}
        >
          <AvatarUpload avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
          <AccountSettings
            user={user}
            setUser={setUser}
            logout={logout}
            requestUserUpdate={requestUserUpdate}
            confirmUserUpdate={confirmUserUpdate}
          />
        </div>

        <div
          className="diet-card"
          style={{ padding: "25px", borderRadius: "8px" }}
        >
          <h2
            style={{
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            Physical Metrics
          </h2>
          {isLoading ? (
            <LoadingSpinner message="Fetching your profile data..." />
          ) : (
            <PhysicalMetrics initialData={metricsData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
