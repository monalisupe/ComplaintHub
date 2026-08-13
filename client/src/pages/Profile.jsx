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

      // Use different endpoints for admin and user
      const endpoint = isAdmin ? "/admin/profile" : "/user/profile";
      const response = await api.put(endpoint, formData);

      if (response.data.success) {
        // Update localStorage
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
    // Validation
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

      // Use different endpoints for admin and user
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

  // Get the correct sidebar based on role
  const SidebarComponent = isAdmin ? AdminSidebar : Sidebar;

  return (
    <>
      <style>{`
        .profile-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #16213e 100%);
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .profile-main {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .profile-main::before {
          content: '';
          position: fixed;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 70% 30%, rgba(99,102,241,0.05) 0%, transparent 50%);
          animation: rotateGlow 20s linear infinite;
          pointer-events: none;
        }

        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .page-header .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .page-header .header-left .header-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
          border: 1px solid rgba(99,102,241,0.15);
        }

        .page-header .header-left .header-icon svg {
          color: #818cf8;
        }

        .page-header .header-left h1 {
          color: #f1f5f9;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .page-header .header-left p {
          color: #94a3b8;
          font-size: 14px;
          margin: 4px 0 0;
        }

        /* Profile Card */
        .profile-card {
          max-width: 700px;
          margin: 0 auto;
          padding: 40px;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 40px rgba(0,0,0,0.2);
          transition: all 0.4s ease;
        }

        .profile-card:hover {
          border-color: rgba(99,102,241,0.15);
          box-shadow: 0 8px 50px rgba(99,102,241,0.05);
        }

        /* Avatar */
        .profile-avatar {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }

        .profile-avatar .avatar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          margin: 0 auto;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          font-size: 40px;
          font-weight: 700;
          color: white;
          box-shadow: 0 8px 30px rgba(99,102,241,0.3);
          position: relative;
        }

        .profile-avatar .avatar-circle .camera-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: 2px solid #0a0e1a;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .profile-avatar .avatar-circle .camera-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
        }

        .profile-avatar .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          padding: 6px 16px;
          border-radius: 20px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.2);
          color: #818cf8;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .profile-avatar .role-badge .role-icon {
          font-size: 14px;
        }

        /* Success/Error Messages */
        .message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.success {
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.2);
          color: #34d399;
        }

        .message.error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }

        /* Form Fields */
        .profile-field {
          margin-bottom: 20px;
        }

        .profile-field label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
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
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: #f1f5f9;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-field .field-value svg {
          color: #64748b;
        }

        .profile-field input,
        .profile-field textarea {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f1f5f9;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
          font-family: inherit;
        }

        .profile-field input:focus,
        .profile-field textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 30px rgba(99,102,241,0.1);
          background: rgba(255,255,255,0.08);
        }

        .profile-field input::placeholder,
        .profile-field textarea::placeholder {
          color: #64748b;
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

        /* Password Field with Toggle */
        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper input {
          width: 100%;
          padding: 12px 16px;
          padding-right: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f1f5f9;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
        }

        .password-input-wrapper input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 30px rgba(99,102,241,0.1);
          background: rgba(255,255,255,0.08);
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          transition: all 0.3s ease;
        }

        .password-toggle:hover {
          color: #f1f5f9;
        }

        /* Buttons */
        .profile-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .btn-edit {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-width: 120px;
        }

        .btn-edit:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.3);
        }

        .btn-save {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #10b981, #22c55e);
          color: white;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-width: 120px;
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(16,185,129,0.3);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 14px 24px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .btn-cancel:hover {
          background: rgba(255,255,255,0.08);
          color: #f1f5f9;
          transform: translateY(-2px);
        }

        .btn-change-password {
          width: 100%;
          padding: 14px;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 14px;
          background: rgba(99,102,241,0.08);
          color: #818cf8;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }

        .btn-change-password:hover {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-2px);
        }

        .btn-change-password.active {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.2);
          color: #f87171;
        }

        .btn-change-password.active:hover {
          background: rgba(239,68,68,0.15);
        }

        /* Password Change Section */
        .password-section {
          margin-top: 24px;
          padding: 20px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          animation: slideIn 0.3s ease;
        }

        .password-section .section-title {
          color: #f1f5f9;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Quick Stats for Admin */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
          padding: 16px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .quick-stat {
          text-align: center;
        }

        .quick-stat .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .quick-stat .stat-label {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .profile-main {
            padding: 16px;
          }

          .profile-card {
            padding: 24px;
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

        @media (max-width: 480px) {
          .profile-card {
            padding: 16px;
          }

          .profile-avatar .avatar-circle {
            width: 80px;
            height: 80px;
            font-size: 30px;
          }

          .quick-stats {
            grid-template-columns: 1fr;
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
                  <Camera size={16} color="white" />
                </div>
              </div>
              <div className="role-badge">
                <span className="role-icon">{isAdmin ? "🛡️" : "👤"}</span>
                {isAdmin ? "Administrator" : "Citizen"}
              </div>
            </div>

            {/* Admin Quick Stats - Only for Admin */}
            {isAdmin && (
              <div className="quick-stats">
                <div className="quick-stat">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Total Complaints</div>
                </div>
                <div className="quick-stat">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="quick-stat">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Resolved</div>
                </div>
              </div>
            )}

            {/* Success/Error Messages */}
            {success && (
              <div className="message success">
                <CheckCircle size={20} />
                {success}
              </div>
            )}
            {error && (
              <div className="message error">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {/* Profile Form */}
            {!isEditing ? (
              // View Mode
              <>
                <div className="profile-field">
                  <label>
                    <User size={16} />
                    Full Name
                  </label>
                  <div className="field-value">
                    <User size={18} />
                    {formData.name || "Not set"}
                  </div>
                </div>

                <div className="profile-field">
                  <label>
                    <Mail size={16} />
                    Email Address
                  </label>
                  <div className="field-value">
                    <Mail size={18} />
                    {formData.email || "Not set"}
                  </div>
                </div>

                <div className="profile-field">
                  <label>
                    <Phone size={16} />
                    Contact Number
                  </label>
                  <div className="field-value">
                    <Phone size={18} />
                    {formData.phone || "Not set"}
                  </div>
                </div>

                {/* Admin-only fields */}
                {isAdmin && (
                  <>
                    <div className="field-grid">
                      <div className="profile-field">
                        <label>
                          <Building size={16} />
                          Department
                        </label>
                        <div className="field-value">
                          <Building size={18} />
                          {formData.department || "Not set"}
                        </div>
                      </div>

                      <div className="profile-field">
                        <label>
                          <MapPin size={16} />
                          Office Location
                        </label>
                        <div className="field-value">
                          <MapPin size={18} />
                          {formData.office || "Not set"}
                        </div>
                      </div>
                    </div>

                    <div className="profile-field">
                      <label>
                        <MapPin size={16} />
                        Address
                      </label>
                      <div className="field-value">
                        <MapPin size={18} />
                        {formData.address || "Not set"}
                      </div>
                    </div>
                  </>
                )}

                <div className="profile-actions">
                  <button className="btn-edit" onClick={toggleEdit}>
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                  <button 
                    className={`btn-change-password ${showChangePassword ? 'active' : ''}`}
                    onClick={toggleChangePassword}
                  >
                    <Key size={18} />
                    {showChangePassword ? 'Cancel' : 'Change Password'}
                  </button>
                </div>

                {/* Change Password Section */}
                {showChangePassword && (
                  <div className="password-section">
                    <div className="section-title">
                      <Key size={20} />
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
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button
                        className="btn-cancel"
                        onClick={toggleChangePassword}
                        style={{ flex: 1 }}
                      >
                        <X size={18} />
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
                            <Loader size={18} className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
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
                    <User size={16} />
                    Full Name <span style={{ color: '#f87171' }}>*</span>
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
                    <Mail size={16} />
                    Email Address <span style={{ color: '#f87171' }}>*</span>
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
                    <Phone size={16} />
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
                          <Building size={16} />
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
                          <MapPin size={16} />
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
                        <MapPin size={16} />
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
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
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