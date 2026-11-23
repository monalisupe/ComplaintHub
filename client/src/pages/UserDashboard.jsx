import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import ComplaintModal from "../components/ComplaintModal";
import api from "../services/api";

import {
  FileText,
  Clock,
  Loader,
  CheckCircle,
  Sparkles,
  Users,
  Activity,
  Calendar,
  ArrowUpRight,
  Shield,
  Crown,
  Bell,
  Search,
  Settings,
  HelpCircle,
  User,
} from "lucide-react";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch complaints from backend
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/complaints/my");
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err.response?.data?.message || "Failed to load complaints");
      // Fallback to sample data if API fails
      setComplaints([
        {
          _id: "CMP1001",
          title: "No water supply in sector 15",
          category: "Water Supply",
          date: "29 Jul 2026",
          status: "Pending",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "CMP1002",
          title: "Street light not working",
          category: "Street Light",
          date: "28 Jul 2026",
          status: "Resolved",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          _id: "CMP1003",
          title: "Garbage not collected",
          category: "Garbage",
          date: "27 Jul 2026",
          status: "In Progress",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const progress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-badge pending";
      case "in progress":
        return "status-badge progress";
      case "resolved":
        return "status-badge resolved";
      case "rejected":
        return "status-badge rejected";
      default:
        return "status-badge";
    }
  };

  // Stats data
  const statCards = [
    {
      title: "Total Complaints",
      value: total,
      icon: <FileText size={22} />,
      color: "blue",
      subtitle: "All your complaints",
    },
    {
      title: "Pending",
      value: pending,
      icon: <Clock size={22} />,
      color: "orange",
      subtitle: "Awaiting action",
    },
    {
      title: "In Progress",
      value: progress,
      icon: <Loader size={22} className="animate-spin" />,
      color: "cyan",
      subtitle: "Being resolved",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: <CheckCircle size={22} />,
      color: "green",
      subtitle: "Successfully resolved",
    },
  ];

  return (
    <>
      <style>{`
        /* ========================================
           USER DASHBOARD - PROFESSIONAL WHITE THEME
           Matching Login / Register Palette
           ======================================== */

        .user-dashboard-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          position: relative;
        }

        .user-layout-premium {
          display: flex;
          min-height: 100vh;
        }

        .user-main-premium {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          background: #f8fafc;
        }

        /* Top Bar */
        .user-topbar-premium {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          margin-bottom: 24px;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .user-search-premium {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f8fafc;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          flex: 1;
          max-width: 420px;
        }

        .user-search-premium:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: #ffffff;
        }

        .user-search-premium input {
          background: transparent;
          border: none;
          outline: none;
          color: #0f172a;
          font-size: 14px;
          width: 100%;
        }

        .user-search-premium input::placeholder {
          color: #94a3b8;
        }

        .user-actions-premium {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-action-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-action-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #2563eb;
        }

        .user-profile-premium {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 14px 4px 4px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-profile-premium:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .user-avatar-premium {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          background: #2563eb;
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
        }

        .user-profile-premium .profile-info strong {
          display: block;
          color: #0f172a;
          font-size: 13px;
          font-weight: 600;
        }

        .user-profile-premium .profile-info small {
          color: #64748b;
          font-size: 11px;
        }

        /* Welcome Section */
        .user-welcome-premium {
          padding: 28px 32px;
          margin-bottom: 24px;
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .user-badge-premium {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #2563eb;
          text-transform: uppercase;
        }

        .user-welcome-premium h1 {
          margin: 10px 0 6px;
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
        }

        .user-welcome-premium h1 span {
          color: #2563eb;
        }

        .user-welcome-premium p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .user-welcome-premium .welcome-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .user-stat-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .user-stat-chip:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .user-stat-chip .chip-value {
          font-weight: 700;
          color: #0f172a;
        }

        /* Stats Grid */
        .user-stats-premium {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .user-stat-card-premium {
          position: relative;
          padding: 22px 24px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: all 0.25s ease;
          overflow: hidden;
        }

        .user-stat-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -10px rgba(0,0,0,0.08);
          border-color: #cbd5e1;
        }

        .user-stat-card-premium .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .user-stat-card-premium .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: var(--icon-bg);
          color: var(--icon-color);
          transition: all 0.3s ease;
        }

        .user-stat-card-premium:hover .stat-icon-wrapper {
          transform: scale(1.08);
        }

        .user-stat-card-premium .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin: 14px 0 4px;
          line-height: 1;
        }

        .user-stat-card-premium .stat-title {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .user-stat-card-premium .stat-subtitle {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
        }

        /* Complaint Table */
        .user-table-premium {
          border-radius: 18px;
          padding: 24px 28px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .user-table-premium .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .user-table-premium .table-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .user-table-premium .table-header-left .header-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
        }

        .user-table-premium .table-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 18px;
          font-weight: 700;
        }

        .user-table-premium .table-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .table-wrapper-premium {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }

        .user-table-premium table {
          width: 100%;
          border-collapse: collapse;
        }

        .user-table-premium th {
          color: #475569;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 12px 16px;
          text-align: left;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .user-table-premium td {
          padding: 14px 16px;
          color: #1e293b;
          font-size: 14px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }

        .user-table-premium tbody tr:hover td {
          background: #f8fafc;
        }

        .user-table-premium .complaint-id {
          font-family: monospace;
          font-weight: 600;
          color: #2563eb;
          font-size: 13px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .status-badge.progress {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .status-badge.resolved {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .status-badge.rejected {
          background: #ffe4e6;
          color: #be123c;
          border: 1px solid #fecdd3;
        }

        .view-btn-premium {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-btn-premium:hover {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
        }

        /* Loading & Error */
        .user-loading-premium {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          color: #64748b;
        }

        .user-loading-premium .spinner-premium {
          width: 42px;
          height: 42px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .user-error-premium {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          background: #fef2f2;
          border-radius: 18px;
          border: 1px solid #fecaca;
          padding: 36px;
          color: #b91c1c;
        }

        .user-error-premium button {
          padding: 10px 22px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .user-error-premium button:hover {
          background: #1d4ed8;
        }

        .empty-state-premium {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state-premium .empty-icon {
          font-size: 52px;
          margin-bottom: 14px;
        }

        .empty-state-premium h3 {
          color: #0f172a;
          margin: 0 0 6px;
          font-size: 18px;
          font-weight: 700;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .user-stats-premium {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .user-main-premium {
            padding: 16px;
          }

          .user-stats-premium {
            grid-template-columns: 1fr;
          }

          .user-welcome-premium {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }

          .user-welcome-premium h1 {
            font-size: 22px;
          }

          .user-topbar-premium {
            flex-wrap: wrap;
            gap: 12px;
            padding: 12px 16px;
          }

          .user-search-premium {
            max-width: 100%;
            flex: 1 1 100%;
          }

          .user-profile-premium .profile-info {
            display: none;
          }
        }
      `}</style>

      <div className="user-dashboard-wrapper">
        <div className="user-layout-premium">
          <Sidebar />

          <main className="user-main-premium">
            {/* Top Bar */}
            <header className="user-topbar-premium">
              <div className="user-search-premium">
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search your complaints..."
                />
                <kbd style={{
                  background: '#f1f5f9',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#64748b',
                  border: '1px solid #e2e8f0'
                }}>
                  ⌘K
                </kbd>
              </div>

              <div className="user-actions-premium">
                <button className="user-action-btn" title="Notifications">
                  <Bell size={18} />
                </button>
                <button className="user-action-btn" title="Settings">
                  <Settings size={18} />
                </button>
                <button className="user-action-btn" title="Help">
                  <HelpCircle size={18} />
                </button>

                <div className="user-profile-premium">
                  <div className="user-avatar-premium">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="profile-info">
                    <strong>{user?.name || "User"}</strong>
                    <small>Citizen</small>
                  </div>
                </div>
              </div>
            </header>

            {/* Welcome Section */}
            <section className="user-welcome-premium">
              <div className="welcome-left">
                <span className="user-badge-premium">
                  <User size={12} />
                  Citizen Portal
                </span>
                <h1>
                  Welcome, <span>{user?.name || "User"}</span>
                </h1>
                <p>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Track and manage your complaints in real-time
                </p>
              </div>

              <div className="welcome-right">
                <div className="user-stat-chip">
                  <FileText size={14} color="#2563eb" />
                  <span>Total: <span className="chip-value">{total}</span></span>
                </div>
                <div className="user-stat-chip">
                  <Clock size={14} color="#d97706" />
                  <span>Pending: <span className="chip-value">{pending}</span></span>
                </div>
                <div className="user-stat-chip">
                  <Calendar size={14} color="#2563eb" />
                  <span>
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </section>

            {/* Error State */}
            {error && (
              <div className="user-error-premium">
                <div style={{ fontSize: '42px' }}>⚠️</div>
                <p>{error}</p>
                <button onClick={fetchComplaints}>
                  <ArrowUpRight size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="user-loading-premium">
                <div className="spinner-premium"></div>
                <p>Loading your complaints...</p>
              </div>
            )}

            {/* Dashboard Content */}
            {!loading && !error && (
              <>
                {/* Stats Cards */}
                <section className="user-stats-premium">
                  {statCards.map((stat, index) => (
                    <div
                      key={index}
                      className="user-stat-card-premium"
                      style={{
                        borderLeft: `4px solid ${
                          stat.color === 'blue' ? '#2563eb' :
                          stat.color === 'orange' ? '#f59e0b' :
                          stat.color === 'cyan' ? '#0891b2' :
                          stat.color === 'green' ? '#16a34a' : '#2563eb'
                        }`,
                        '--icon-bg': stat.color === 'blue' ? '#eff6ff' :
                                      stat.color === 'orange' ? '#fffbeb' :
                                      stat.color === 'cyan' ? '#ecfeff' :
                                      stat.color === 'green' ? '#f0fdf4' : '#eff6ff',
                        '--icon-color': stat.color === 'blue' ? '#2563eb' :
                                        stat.color === 'orange' ? '#d97706' :
                                        stat.color === 'cyan' ? '#0891b2' :
                                        stat.color === 'green' ? '#16a34a' : '#2563eb',
                      }}
                    >
                      <div className="stat-header">
                        <div className="stat-icon-wrapper">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-title">{stat.title}</div>
                      <div className="stat-subtitle">{stat.subtitle}</div>
                    </div>
                  ))}
                </section>

                {/* My Complaints Table */}
                <section className="user-table-premium">
                  <div className="table-header">
                    <div className="table-header-left">
                      <div className="header-icon">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h2>My Complaints</h2>
                        <p>Track the status of all your submitted complaints</p>
                      </div>
                    </div>
                  </div>

                  {complaints.length === 0 ? (
                    <div className="empty-state-premium">
                      <div className="empty-icon">📋</div>
                      <h3>No complaints found</h3>
                      <p>You haven't submitted any complaints yet.</p>
                      <button
                        className="view-btn-premium"
                        style={{ marginTop: '16px', padding: '10px 24px', background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}
                        onClick={() => window.location.href = '/create-complaint'}
                      >
                        Create New Complaint →
                      </button>
                    </div>
                  ) : (
                    <div className="table-wrapper-premium">
                      <table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Complaint ID</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {complaints.map((complaint, index) => (
                            <tr key={complaint._id}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="complaint-id">
                                  #{complaint._id?.slice(-6).toUpperCase() || complaint._id?.slice(-6) || 'N/A'}
                                </span>
                              </td>
                              <td>{complaint.category}</td>
                              <td style={{ fontWeight: 500 }}>{complaint.title || "Untitled"}</td>
                              <td>
                                {new Date(complaint.createdAt || complaint.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </td>
                              <td>
                                <span className={getStatusClass(complaint.status)}>
                                  {complaint.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="view-btn-premium cursor-pointer"
                                  onClick={() => {
                                    setSelectedComplaint(complaint);
                                    setIsModalOpen(true);
                                  }}
                                >
                                  View <ArrowUpRight size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {/* Complaint Detail Modal */}
                <ComplaintModal
                  isOpen={isModalOpen}
                  complaint={selectedComplaint}
                  onClose={() => setIsModalOpen(false)}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
