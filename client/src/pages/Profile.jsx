import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Edit2,
  Save,
  X,
  Camera,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader,
  Key,
  Building,
  MapPin,
  Users,
  FileText,
} from "lucide-react";

// Import the correct sidebar based on role
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";
  
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile form data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
    office: user?.office || "",
    address: user?.address || "",
  });

  // Password change data
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user?.email) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const endpoint = isAdmin ? "/admin/profile" : "/user/profile";
      const response = await api.put(endpoint, formData);

      if (response.data.success) {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      setError("Current password is required");
      return;
    }
    if (!passwordData.newPassword) {
      setError("New password is required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const endpoint = isAdmin ? "/admin/change-password" : "/user/change-password";
      const response = await api.put(endpoint, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        setSuccess("Password changed successfully!");
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.message || "Failed to change password");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
    setError("");
    setSuccess("");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const SidebarComponent = isAdmin ? AdminSidebar : Sidebar;

  return (
    <>
      <style>{`
        /* ========================================
           PROFILE - PROFESSIONAL WHITE THEME
           ======================================== */

        .profile-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          position: relative;
        }

        .profile-main {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          position: relative;
          z-index: 1;
          background: #f8fafc;
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .page-header .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .page-header .header-left .header-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }

        .page-header .header-left .header-icon svg {
          color: #2563eb;
        }

        .page-header .header-left h1 {
          color: #0f172a;
          font-size: 26px;
          font-weight: 800;
          margin: 0;
        }

        .page-header .header-left p {
          color: #64748b;
          font-size: 14px;
          margin: 4px 0 0;
        }

        /* Profile Card */
        .profile-card {
          max-width: 680px;
          margin: 0 auto;
          padding: 36px 40px;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        /* Avatar */
        .profile-avatar {
          text-align: center;
          margin-bottom: 28px;
          position: relative;
        }

        .profile-avatar .avatar-circle {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin: 0 auto;
          background: #2563eb;
          font-size: 36px;
          font-weight: 800;
          color: white;
          border: 4px solid #eff6ff;
          box-shadow: 0 4px 14px rgba(37,99,235,0.2);
          position: relative;
        }

        .profile-avatar .avatar-circle .camera-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #1d4ed8;
          border: 2px solid #ffffff;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-avatar .avatar-circle .camera-btn:hover {
          transform: scale(1.1);
          background: #2563eb;
        }

        .profile-avatar .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 4px 14px;
          border-radius: 20px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #2563eb;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Messages */
        .message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .message.success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }

        .message.error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        /* Form Fields */
        .profile-field {
          margin-bottom: 18px;
        }

        .profile-field label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .profile-field label svg {
          color: #64748b;
        }

        .profile-field .field-value {
          padding: 12px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-field .field-value svg {
          color: #94a3b8;
        }

        .profile-field input,
        .profile-field textarea {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          font-size: 14px;
          transition: all 0.2s ease;
          outline: none;
          font-family: inherit;
        }

        .profile-field input:focus,
        .profile-field textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: #ffffff;
        }

        .profile-field input::placeholder,
        .profile-field textarea::placeholder {
          color: #94a3b8;
        }

        .profile-field textarea {
          resize: vertical;
          min-height: 60px;
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Password Field */
        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper input {
          width: 100%;
          padding: 12px 16px;
          padding-right: 44px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          font-size: 14px;
          transition: all 0.2s ease;
          outline: none;
        }

        .password-input-wrapper input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: #ffffff;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
        }

        .password-toggle:hover {
          color: #0f172a;
        }

        /* Buttons */
        .profile-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .btn-edit {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 120px;
        }

        .btn-edit:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .btn-save {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          background: #16a34a;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 120px;
        }

        .btn-save:hover:not(:disabled) {
          background: #15803d;
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 12px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
        }

        .btn-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-change-password {
          width: 100%;
          padding: 11px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .btn-change-password:hover {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #2563eb;
        }

        .btn-change-password.active {
          background: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }

        /* Password Change Section */
        .password-section {
          margin-top: 20px;
          padding: 20px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .password-section .section-title {
          color: #0f172a;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Quick Stats for Admin */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
          padding: 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .quick-stat {
          text-align: center;
        }

        .quick-stat .stat-number {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
        }

        .quick-stat .stat-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .profile-main {
            padding: 16px;
          }

          .profile-card {
            padding: 24px 20px;
          }

          .page-header .header-left h1 {
            font-size: 22px;
          }

          .field-grid {
            grid-template-columns: 1fr;
          }

          .profile-actions {
            flex-direction: column;
          }

          .btn-edit,
          .btn-save,
          .btn-cancel {
            width: 100%;
            min-width: unset;
          }

          .quick-stats {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="profile-wrapper">
        <SidebarComponent />

        <main className="profile-main">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-left">
              <div className="header-icon">
                {isAdmin ? <Shield size={24} /> : <User size={24} />}
              </div>
              <div>
                <h1>{isAdmin ? "Admin Profile" : "My Profile"}</h1>
                <p>
                  {isAdmin 
                    ? "Manage your admin account settings and preferences" 
                    : "Manage your account settings and preferences"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            {/* Avatar */}
            <div className="profile-avatar">
              <div className="avatar-circle">
                {formData.name?.charAt(0)?.toUpperCase() || (isAdmin ? "A" : "U")}
                <div className="camera-btn">
                  <Camera size={14} color="white" />
                </div>
              </div>
              <div className="role-badge">
                <span className="role-icon">{isAdmin ? "🛡️" : "👤"}</span>
                {isAdmin ? "Administrator" : "Citizen"}
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="message success">
                <CheckCircle size={18} />
                {success}
              </div>
            )}
            {error && (
              <div className="message error">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Profile Form */}
            {!isEditing ? (
              // View Mode
              <>
                <div className="profile-field">
                  <label>
                    <User size={15} />
                    Full Name
                  </label>
                  <div className="field-value">
                    <User size={16} />
                    {formData.name || "Not set"}
                  </div>
                </div>

                <div className="profile-field">
                  <label>
                    <Mail size={15} />
                    Email Address
                  </label>
                  <div className="field-value">
                    <Mail size={16} />
                    {formData.email || "Not set"}
                  </div>
                </div>

                <div className="profile-field">
                  <label>
                    <Phone size={15} />
                    Contact Number
                  </label>
                  <div className="field-value">
                    <Phone size={16} />
                    {formData.phone || "Not set"}
                  </div>
                </div>

                {/* Admin-only fields */}
                {isAdmin && (
                  <>
                    <div className="field-grid">
                      <div className="profile-field">
                        <label>
                          <Building size={15} />
                          Department
                        </label>
                        <div className="field-value">
                          <Building size={16} />
                          {formData.department || "Not set"}
                        </div>
                      </div>

                      <div className="profile-field">
                        <label>
                          <MapPin size={15} />
                          Office Location
                        </label>
                        <div className="field-value">
                          <MapPin size={16} />
                          {formData.office || "Not set"}
                        </div>
                      </div>
                    </div>

                    <div className="profile-field">
                      <label>
                        <MapPin size={15} />
                        Address
                      </label>
                      <div className="field-value">
                        <MapPin size={16} />
                        {formData.address || "Not set"}
                      </div>
                    </div>
                  </>
                )}

                <div className="profile-actions">
                  <button className="btn-edit" onClick={toggleEdit}>
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                  <button 
                    className={`btn-change-password ${showChangePassword ? 'active' : ''}`}
                    onClick={toggleChangePassword}
                  >
                    <Key size={16} />
                    {showChangePassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {/* Change Password Section */}
                {showChangePassword && (
                  <div className="password-section">
                    <div className="section-title">
                      <Key size={18} />
                      Change Password
                    </div>

                    <div className="profile-field">
                      <label>Current Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          placeholder="Enter current password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          type="button"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-field">
                      <label>New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          placeholder="Enter new password (min 6 characters)"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          className="password-toggle"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          type="button"
                        >
                          {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-field">
                      <label>Confirm New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                        />
                        <button
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          type="button"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button
                        className="btn-cancel"
                        onClick={toggleChangePassword}
                        style={{ flex: 1 }}
                      >
                        <X size={16} />
                        Cancel
                      </button>
                      <button
                        className="btn-save"
                        onClick={handleChangePassword}
                        disabled={loading}
                        style={{ flex: 2 }}
                      >
                        {loading ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Edit Mode
              <>
                <div className="profile-field">
                  <label>
                    <User size={15} />
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label>
                    <Mail size={15} />
                    Email Address <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label>
                    <Phone size={15} />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* Admin-only fields in edit mode */}
                {isAdmin && (
                  <>
                    <div className="field-grid">
                      <div className="profile-field">
                        <label>
                          <Building size={15} />
                          Department
                        </label>
                        <input
                          type="text"
                          name="department"
                          placeholder="e.g., Public Works"
                          value={formData.department}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="profile-field">
                        <label>
                          <MapPin size={15} />
                          Office Location
                        </label>
                        <input
                          type="text"
                          name="office"
                          placeholder="e.g., City Hall, Room 101"
                          value={formData.office}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="profile-field">
                      <label>
                        <MapPin size={15} />
                        Address
                      </label>
                      <textarea
                        name="address"
                        placeholder="Enter your full address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                      />
                    </div>
                  </>
                )}

                <div className="profile-actions">
                  <button className="btn-cancel" onClick={toggleEdit}>
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Profile;
