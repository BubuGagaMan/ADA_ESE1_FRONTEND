import React, { useState } from "react";
import { apiClient } from "../../api/apiClient";
import { toast } from "react-toastify";
import { User as UserIcon } from "lucide-react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";

const AvatarUpload = ({ avatarUrl, setAvatarUrl }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleUploadComplete = async (fileInfo) => {
    if (!fileInfo || !fileInfo.cdnUrl) return;

    setIsSaving(true);
    const newImageUrl = fileInfo.cdnUrl;

    try {
      const response = await apiClient.put("/user/profile-image", {
        profile_image_url: newImageUrl,
      });

      setAvatarUrl(newImageUrl);
      toast.success(response.data?.message || "Profile picture updated!");
    } catch (err) {
      console.error("failed to save avatar url", err);
      toast.error("Image uploaded, but failed to save to profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "25px",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          backgroundColor: "var(--surface-hover)",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "15px",
          border: "3px solid var(--primary-color)",
        }}
      >
        {avatarUrl ? (
          <img
            src={`${avatarUrl}-/scale_crop/240x240/`}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <UserIcon size={64} color="var(--text-muted)" />
        )}
      </div>

      {isSaving ? (
        <p className="text-muted" style={{ fontSize: "0.9em", margin: 0 }}>
          Saving...
        </p>
      ) : (
        <FileUploaderRegular
          pubkey={import.meta.env.VITE_UPLOADCARE_CLIENT_KEY}
          maxLocalFileSizeBytes={5000000}
          multiple={false}
          imgOnly={true}
          sourceList="local, camera, instagram"
          classNameUploader="uc-dark"
          onFileUploadSuccess={handleUploadComplete}
        />
      )}
    </div>
  );
};

export default AvatarUpload;
