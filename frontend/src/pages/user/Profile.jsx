import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import fetchWithAuth from "../../utils/fetchWithAuth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const fileRef = useRef();

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const [pwSaving, setPwSaving] = useState(false);

  // FETCH PROFILE
  useEffect(() => {
    fetchWithAuth("/auth/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        } else {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      })
      .catch(() => {
        toast.error("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // CLEANUP IMAGE PREVIEW
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // AVATAR CHANGE
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/jfif",
      "image/pjpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP, AVIF, JFIF images allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // PROFILE SAVE
  const handleProfileSave = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (!user.name?.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", user.name.trim());
      formData.append("bio", user.bio || "");

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (data.success) {
        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.avatar,
          }),
        );

        setAvatarFile(null);
        setPreview(null);

        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Profile update failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // PASSWORD CHANGE
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirm) {
      toast.error("All password fields are required");
      return;
    }

    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (pwForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPwSaving(true);

    try {
      const res = await fetchWithAuth("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Password changed successfully");

        setPwForm({
          currentPassword: "",
          newPassword: "",
          confirm: "",
        });
      } else {
        toast.error(data.message || "Password change failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const avatarSrc =
    preview ||
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "U",
    )}&background=3b82f6&color=fff&size=128`;

  return (
    <div className="container mt-4" style={{ maxWidth: "680px" }}>
      {/* PROFILE CARD */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4">👤 My Profile</h4>

          <form onSubmit={handleProfileSave}>
            {/* AVATAR */}
            <div className="text-center mb-4">
              <img
                src={avatarSrc}
                alt="avatar"
                className="rounded-circle border"
                style={{
                  width: 110,
                  height: 110,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => fileRef.current.click()}
              />

              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => fileRef.current.click()}
                >
                  Change Photo
                </button>
              </div>

              <input
                type="file"
                ref={fileRef}
                className="d-none"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>

            {/* NAME */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={user?.name || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ""}
                disabled
              />
              <small className="text-muted">Email cannot be changed</small>
            </div>

            {/* BIO */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Bio</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Tell us about yourself..."
                value={user?.bio || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    bio: e.target.value,
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-4">🔐 Change Password</h4>

          <form onSubmit={handlePasswordChange}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm({
                    ...pwForm,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm({
                    ...pwForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Confirm New Password
              </label>
              <input
                type="password"
                className="form-control"
                value={pwForm.confirm}
                onChange={(e) =>
                  setPwForm({
                    ...pwForm,
                    confirm: e.target.value,
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100 fw-semibold"
              disabled={pwSaving}
            >
              {pwSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
