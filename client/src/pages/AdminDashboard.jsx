import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Bell,
  Search,
  Settings,
  HelpCircle,
  Sparkles,
  Shield,
  Crown,
  UserCheck,
  Clock as ClockIcon,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowUpRight,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");

      if (response.data.success) {
        setStats(response.data.stats || {});
        setRecentComplaints(response.data.recentComplaints || []);
      }
    } catch (err) {
      console.error("Admin Dashboard Error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <ClockIcon size={13} />;
      case "in progress":
        return <Activity size={13} className="animate-pulse" />;
      case "resolved":
        return <CheckCircle2 size={13} />;
      case "rejected":
        return <XCircle size={13} />;
      default:
        return null;
    }
  };

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.totalComplaints || 0,
      icon: <FileText size={22} />,
      color: "blue",
      accent: "#2563eb",
      trend: "+12.5%",
      trendUp: true,
      subtitle: "All time complaints",
    },
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: <Users size={22} />,
      color: "purple",
      accent: "#7c3aed",
      trend: "+8.2%",
      trendUp: true,
      subtitle: "Registered citizens",
    },
    {
      title: "Pending",
      value: stats.pending || 0,
      icon: <Clock size={22} />,
      color: "orange",
      accent: "#f59e0b",
      trend: "-3.1%",
      trendUp: false,
      subtitle: "Awaiting action",
    },
    {
      title: "In Progress",
      value: stats.inProgress || 0,
      icon: <Activity size={22} className="animate-pulse" />,
      color: "cyan",
      accent: "#0891b2",
      trend: "+5.7%",
      trendUp: true,
      subtitle: "Being resolved",
    },
    {
      title: "Resolved",
      value: stats.resolved || 0,
      icon: <CheckCircle size={22} />,
      color: "green",
      accent: "#16a34a",
      trend: "+23.4%",
      trendUp: true,
      subtitle: "Successfully resolved",
    },
    {
      title: "Rejected",
      value: stats.rejected || 0,
      icon: <AlertCircle size={22} />,
      color: "red",
      accent: "#e11d48",
      trend: "-2.8%",
      trendUp: false,
      subtitle: "Invalid complaints",
    },
  ];

  return (
    <>
      <style>{`
        /* ========================================
           ADMIN DASHBOARD - PROFESSIONAL WHITE THEME
           Matching Login / Register Palette
           ======================================== */

        .admin-dashboard-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          position: relative;
        }

        .admin-layout-premium {
          display: flex;
          min-height: 100vh;
        }

        .admin-main-premium {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          background: #f8fafc;
        }

        /* Top Bar */
        .admin-topbar-premium {
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

        .admin-search-premium {
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

        .admin-search-premium:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: #ffffff;
        }

        .admin-search-premium input {
          background: transparent;
          border: none;
          outline: none;
          color: #0f172a;
          font-size: 14px;
          width: 100%;
        }

        .admin-search-premium input::placeholder {
          color: #94a3b8;
        }

        .admin-actions-premium {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-action-btn {
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
          position: relative;
        }

        .admin-action-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #2563eb;
        }

        .admin-action-btn .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #ffffff;
        }

        .admin-profile-premium {
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

        .admin-profile-premium:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .admin-avatar-premium {
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

        .admin-profile-premium .profile-info strong {
          display: block;
          color: #0f172a;
          font-size: 13px;
          font-weight: 600;
        }

        .admin-profile-premium .profile-info small {
          color: #64748b;
          font-size: 11px;
        }

        /* Welcome Section */
        .admin-welcome-premium {
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

        .admin-badge-premium {
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

        .admin-welcome-premium h1 {
          margin: 10px 0 6px;
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
        }

        .admin-welcome-premium h1 span {
          color: #2563eb;
        }

        .admin-welcome-premium p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .admin-welcome-premium .welcome-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .admin-stat-chip {
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

        .admin-stat-chip:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .admin-stat-chip .chip-value {
          font-weight: 700;
          color: #0f172a;
        }

        /* Stats Grid */
        .admin-stats-premium {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }

        .admin-stat-card-premium {
          position: relative;
          padding: 22px 24px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: all 0.25s ease;
          overflow: hidden;
        }

        .admin-stat-card-premium:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -10px rgba(0,0,0,0.08);
          border-color: #cbd5e1;
        }

        .admin-stat-card-premium .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .admin-stat-card-premium .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: var(--icon-bg);
          color: var(--icon-color);
          transition: all 0.3s ease;
        }

        .admin-stat-card-premium:hover .stat-icon-wrapper {
          transform: scale(1.08);
        }

        .admin-stat-card-premium .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: var(--trend-bg);
          color: var(--trend-color);
        }

        .admin-stat-card-premium .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin: 14px 0 4px;
          line-height: 1;
        }

        .admin-stat-card-premium .stat-title {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-stat-card-premium .stat-subtitle {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
        }

        /* Recent Complaints Table */
        .admin-table-premium {
          border-radius: 18px;
          padding: 24px 28px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .admin-table-premium .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .admin-table-premium .table-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .admin-table-premium .table-header-left .header-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #2563eb;
        }

        .admin-table-premium .table-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 18px;
          font-weight: 700;
        }

        .admin-table-premium .table-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .view-all-btn-premium {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-all-btn-premium:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .table-wrapper-premium {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }

        .admin-table-premium table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table-premium th {
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

        .admin-table-premium td {
          padding: 14px 16px;
          color: #1e293b;
          font-size: 14px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }

        .admin-table-premium tbody tr:hover td {
          background: #f8fafc;
        }

        .admin-table-premium .complaint-id {
          font-family: monospace;
          font-weight: 600;
          color: #2563eb;
          font-size: 13px;
        }

        .admin-table-premium .user-name {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .admin-table-premium .user-name .user-avatar-small {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          font-size: 11px;
          font-weight: 700;
          color: #2563eb;
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
        .admin-loading-premium {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          color: #64748b;
        }

        .admin-loading-premium .spinner-premium {
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

        .admin-error-premium {
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

        .admin-error-premium button {
          padding: 10px 22px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .admin-error-premium button:hover {
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
          .admin-stats-premium {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .admin-main-premium {
            padding: 16px;
          }

          .admin-stats-premium {
            grid-template-columns: 1fr;
          }

          .admin-welcome-premium {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
          }

          .admin-welcome-premium h1 {
            font-size: 22px;
          }

          .admin-topbar-premium {
            flex-wrap: wrap;
            gap: 12px;
            padding: 12px 16px;
          }

          .admin-search-premium {
            max-width: 100%;
            flex: 1 1 100%;
          }

          .admin-profile-premium .profile-info {
            display: none;
          }
        }
      `}</style>

      <div className="admin-dashboard-wrapper">
        <div className="admin-layout-premium">
          <AdminSidebar />

          <main className="admin-main-premium">
            {/* Top Bar */}
            <header className="admin-topbar-premium">
              <div className="admin-search-premium">
                <Search size={18} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search complaints, users..."
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

              <div className="admin-actions-premium">
                <button className="admin-action-btn" title="Notifications">
                  <Bell size={18} />
                  <span className="notification-dot"></span>
                </button>
                <button className="admin-action-btn" title="Settings">
                  <Settings size={18} />
                </button>
                <button className="admin-action-btn" title="Help">
                  <HelpCircle size={18} />
                </button>

                <div className="admin-profile-premium">
                  <div className="admin-avatar-premium">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div className="profile-info">
                    <strong>{user?.name || "Admin"}</strong>
                    <small>Administrator</small>
                  </div>
                </div>
              </div>
            </header>

            {/* Welcome Section */}
            <section className="admin-welcome-premium">
              <div className="welcome-left">
                <span className="admin-badge-premium">
                  <Shield size={12} />
                  Admin Panel
                </span>
                <h1>
                  Welcome, <span>{user?.name || "Admin"}</span>
                </h1>
                <p>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  Manage complaints, users and monitor platform activity in real-time
                </p>
              </div>

              <div className="welcome-right">
                <div className="admin-stat-chip">
                  <Crown size={14} color="#d97706" />
                  <span>Total: <span className="chip-value">{stats.totalComplaints || 0}</span></span>
                </div>
                <div className="admin-stat-chip">
                  <UserCheck size={14} color="#16a34a" />
                  <span>Users: <span className="chip-value">{stats.totalUsers || 0}</span></span>
                </div>
                <div className="admin-stat-chip">
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
              <div className="admin-error-premium">
                <div style={{ fontSize: '42px' }}>⚠️</div>
                <p>{error}</p>
                <button onClick={fetchDashboardData}>
                  <ArrowUpRight size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="admin-loading-premium">
                <div className="spinner-premium"></div>
                <p>Loading dashboard data...</p>
              </div>
            )}

            {/* Dashboard Content */}
            {!loading && !error && (
              <>
                {/* Stats Cards */}
                <section className="admin-stats-premium">
                  {statCards.map((stat, index) => (
                    <div
                      key={index}
                      className="admin-stat-card-premium"
                      style={{
                        borderLeft: `4px solid ${stat.accent}`,
                        '--icon-bg': stat.color === 'blue' ? '#eff6ff' :
                                      stat.color === 'purple' ? '#f5f3ff' :
                                      stat.color === 'orange' ? '#fffbeb' :
                                      stat.color === 'cyan' ? '#ecfeff' :
                                      stat.color === 'green' ? '#f0fdf4' : '#fff1f2',
                        '--icon-color': stat.accent,
                        '--trend-bg': stat.trendUp ? '#dcfce7' : '#fee2e2',
                        '--trend-color': stat.trendUp ? '#15803d' : '#b91c1c',
                      }}
                    >
                      <div className="stat-header">
                        <div className="stat-icon-wrapper">
                          {stat.icon}
                        </div>
                        <div className="stat-trend">
                          {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {stat.trend}
                        </div>
                      </div>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-title">{stat.title}</div>
                      <div className="stat-subtitle">{stat.subtitle}</div>
                    </div>
                  ))}
                </section>

                {/* Recent Complaints Table */}
                <section className="admin-table-premium">
                  <div className="table-header">
                    <div className="table-header-left">
                      <div className="header-icon">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h2>Recent Complaints</h2>
                        <p>Latest complaints submitted by citizens</p>
                      </div>
                    </div>
                    <button
                      className="view-all-btn-premium"
                      onClick={() => navigate("/all-complaints")}
                    >
                      View All
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {recentComplaints.length === 0 ? (
                    <div className="empty-state-premium">
                      <div className="empty-icon">📋</div>
                      <h3>No complaints found</h3>
                      <p>There are currently no complaints available to display.</p>
                    </div>
                  ) : (
                    <div className="table-wrapper-premium">
                      <table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Complaint ID</th>
                            <th>User</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentComplaints.map((complaint, index) => (
                            <tr key={complaint._id}>
                              <td>{index + 1}</td>
                              <td>
                                <span className="complaint-id">
                                  #{complaint._id?.slice(-6).toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <div className="user-name">
                                  <div className="user-avatar-small">
                                    {complaint.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                  </div>
                                  {complaint.user?.name || "Unknown"}
                                </div>
                              </td>
                              <td>{complaint.category}</td>
                              <td>
                                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </td>
                              <td>
                                <span className={getStatusClass(complaint.status)}>
                                  {getStatusIcon(complaint.status)}
                                  {complaint.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="view-btn-premium"
                                  onClick={() => navigate("/all-complaints")}
                                >
                                  View <Eye size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
