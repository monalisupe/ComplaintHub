import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  FileText,
  Search,
  Eye,
  Clock,
  CheckCircle,
  Loader,
  AlertCircle,
  XCircle,
  Calendar,
  User,
  RefreshCw,
  Check,
  X,
  PenTool,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

function AllComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Status options - ONLY the ones in your system
  const statusOptions = [
    { value: "Pending", label: "Pending", color: "#f59e0b", icon: "⏳" },
    { value: "In Progress", label: "In Progress", color: "#2563eb", icon: "🔄" },
    { value: "Resolved", label: "Resolved", color: "#16a34a", icon: "✅" },
    { value: "Rejected", label: "Rejected", color: "#e11d48", icon: "❌" },
  ];

  // Categories from your system
  const categories = [
    "All",
    "Water Supply",
    "Street Light",
    "Garbage",
    "Road",
    "Drainage",
    "Electricity",
    "Noise Pollution",
    "Other",
  ];

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/complaints");
      setComplaints(response.data.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, status) => {
    try {
      setUpdating(true);
      const response = await api.put(`/admin/complaints/${complaintId}/status`, { status });
      if (response.data.success) {
        setComplaints(complaints.map(c =>
          c._id === complaintId ? { ...c, status } : c
        ));
        setShowStatusModal(false);
        setSelectedComplaint(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusInfo = (status) => {
    const found = statusOptions.find(s => s.value === status);
    return found || { value: status, label: status, color: "#64748b", icon: "📋" };
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || complaint.status === filterStatus;
    const matchesCategory = filterCategory === "All" || complaint.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Statistics
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
    rejected: complaints.filter(c => c.status === "Rejected").length,
  };

  return (
    <>
      <style>{`
        /* ========================================
           ALL COMPLAINTS - PROFESSIONAL WHITE THEME
           ======================================== */

        .all-complaints-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          position: relative;
        }

        .all-complaints-main {
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

        .page-header .header-left .total-count {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 20px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
          margin-left: 8px;
        }

        .btn-refresh {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          color: #475569;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-refresh:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .btn-refresh .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }

        .stat-item {
          padding: 14px 18px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .stat-item:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
          box-shadow: 0 6px 16px rgba(0,0,0,0.04);
        }

        .stat-item .stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
        }

        .stat-item .stat-label {
          font-size: 11px;
          color: #64748b;
          margin-top: 2px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-item .stat-icon-small {
          font-size: 16px;
          display: block;
          margin-bottom: 4px;
        }

        .stat-item.active {
          border-color: #2563eb;
          background: #eff6ff;
        }

        /* Filters */
        .filters-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          padding: 16px 20px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 220px;
          padding: 10px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .search-box:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: #ffffff;
        }

        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: #0f172a;
          font-size: 14px;
          width: 100%;
        }

        .search-box input::placeholder {
          color: #94a3b8;
        }

        .filter-select {
          padding: 10px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          outline: none;
          transition: all 0.2s ease;
          min-width: 140px;
        }

        .filter-select:focus {
          border-color: #2563eb;
          background: #ffffff;
        }

        .filter-select option {
          background: #ffffff;
          color: #0f172a;
        }

        /* Complaints Table */
        .complaints-table-card {
          padding: 24px 28px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }

        .complaints-table-card table {
          width: 100%;
          border-collapse: collapse;
        }

        .complaints-table-card th {
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

        .complaints-table-card td {
          padding: 14px 16px;
          color: #1e293b;
          font-size: 14px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
          vertical-align: middle;
        }

        .complaints-table-card tbody tr:hover td {
          background: #f8fafc;
        }

        .complaint-id {
          font-family: monospace;
          font-weight: 600;
          color: #2563eb;
          font-size: 13px;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .user-avatar-small {
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
          cursor: pointer;
        }

        .status-badge:hover {
          transform: scale(1.04);
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

        .btn-action {
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-action.view-btn {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .btn-action.view-btn:hover {
          background: #2563eb;
          color: #ffffff;
        }

        .btn-action.status-btn {
          background: #f0fdf4;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        .btn-action.status-btn:hover {
          background: #16a34a;
          color: #ffffff;
        }

        /* Status Update Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          max-width: 500px;
          width: 90%;
          padding: 30px;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          color: #0f172a;
          font-size: 20px;
          font-weight: 800;
          margin: 0;
        }

        .modal-close {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          display: grid;
          place-items: center;
        }

        .modal-close:hover {
          background: #fef2f2;
          color: #ef4444;
          border-color: #fecaca;
        }

        .modal-body {
          margin-bottom: 24px;
        }

        .modal-body .complaint-info {
          padding: 16px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          margin-bottom: 18px;
        }

        .modal-body .complaint-info .label {
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modal-body .complaint-info .value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 600;
          margin-top: 2px;
        }

        .status-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .status-option {
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #334155;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-option:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
        }

        .status-option.selected {
          border-color: #2563eb;
          background: #eff6ff;
          color: #2563eb;
        }

        .status-option .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
        }

        .btn-modal-cancel {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-modal-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .btn-modal-update {
          flex: 2;
          padding: 10px 16px;
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
        }

        .btn-modal-update:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-modal-update:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state .empty-icon {
          font-size: 52px;
          margin-bottom: 14px;
        }

        .empty-state h3 {
          color: #0f172a;
          margin: 0 0 6px;
          font-size: 18px;
          font-weight: 700;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .loading-state .spinner {
          width: 42px;
          height: 42px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        .error-state {
          text-align: center;
          padding: 40px 20px;
          color: #b91c1c;
          background: #fef2f2;
          border-radius: 16px;
          border: 1px solid #fecaca;
        }

        /* Detail Modal Styles */
        .detail-row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .detail-row .detail-label {
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          width: 120px;
          flex-shrink: 0;
        }

        .detail-row .detail-value {
          color: #0f172a;
          font-size: 14px;
          font-weight: 500;
          flex: 1;
        }

        .detail-description {
          padding: 12px 16px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 14px;
          line-height: 1.6;
        }

        @media (max-width: 1200px) {
          .stats-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .all-complaints-main {
            padding: 16px;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .page-header .header-left h1 {
            font-size: 22px;
          }

          .filters-bar {
            flex-direction: column;
          }

          .search-box {
            min-width: 100%;
          }

          .filter-select {
            min-width: 100%;
          }

          .status-options-grid {
            grid-template-columns: 1fr;
          }

          .complaints-table-card {
            padding: 16px;
          }

          .detail-row {
            flex-direction: column;
            padding: 8px 0;
          }

          .detail-row .detail-label {
            width: 100%;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="all-complaints-wrapper">
        <AdminSidebar />
        <main className="all-complaints-main">
          <Navbar />

          {/* Page Header */}
          <div className="page-header">
            <div className="header-left">
              <div className="header-icon">
                <FileText size={24} />
              </div>
              <div>
                <h1>
                  All Complaints
                  <span className="total-count">{complaints.length}</span>
                </h1>
                <p>Manage and track all citizen complaints</p>
              </div>
            </div>
            <button className="btn-refresh" onClick={fetchAllComplaints}>
              <RefreshCw size={16} className={loading ? "spinning" : ""} />
              Refresh
            </button>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <div className={`stat-item ${filterStatus === 'All' ? 'active' : ''}`} onClick={() => setFilterStatus("All")}>
              <span className="stat-icon-small">📊</span>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className={`stat-item ${filterStatus === 'Pending' ? 'active' : ''}`} onClick={() => setFilterStatus("Pending")}>
              <span className="stat-icon-small">⏳</span>
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className={`stat-item ${filterStatus === 'In Progress' ? 'active' : ''}`} onClick={() => setFilterStatus("In Progress")}>
              <span className="stat-icon-small">🔄</span>
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className={`stat-item ${filterStatus === 'Resolved' ? 'active' : ''}`} onClick={() => setFilterStatus("Resolved")}>
              <span className="stat-icon-small">✅</span>
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div className={`stat-item ${filterStatus === 'Rejected' ? 'active' : ''}`} onClick={() => setFilterStatus("Rejected")}>
              <span className="stat-icon-small">❌</span>
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by title, user, ID, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Complaints Table */}
          <div className="complaints-table-card">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading complaints...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <AlertCircle size={32} style={{ margin: '0 auto 12px' }} />
                <p>{error}</p>
                <button
                  onClick={fetchAllComplaints}
                  style={{
                    marginTop: '12px',
                    padding: '8px 20px',
                    border: 'none',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No complaints found</h3>
                <p>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Complaint ID</th>
                      <th>User</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((complaint, index) => (
                      <tr key={complaint._id}>
                        <td>{index + 1}</td>
                        <td>
                          <span className="complaint-id">
                            #{complaint._id?.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-small">
                              {complaint.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            {complaint.user?.name || "Unknown"}
                          </div>
                        </td>
                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                          {complaint.title || "Untitled"}
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '8px',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                            fontSize: '11px',
                            fontWeight: 600,
                            whiteSpace: 'nowrap'
                          }}>
                            {complaint.category}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', color: '#64748b' }}>
                          {formatDate(complaint.createdAt)}
                        </td>
                        <td>
                          <button
                            className={getStatusClass(complaint.status)}
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setNewStatus(complaint.status);
                              setShowStatusModal(true);
                            }}
                          >
                            {getStatusInfo(complaint.status).icon} {complaint.status}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              className="btn-action view-btn cursor-pointer"
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowDetailModal(true);
                              }}
                            >
                              <Eye size={13} />
                              View
                            </button>
                            <button
                              className="btn-action status-btn cursor-pointer"
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setNewStatus(complaint.status);
                                setShowStatusModal(true);
                              }}
                            >
                              <PenTool size={13} />
                              Status
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Status Update Modal */}
          {showStatusModal && selectedComplaint && (
            <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Update Status</h2>
                  <button className="modal-close" onClick={() => setShowStatusModal(false)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="complaint-info">
                    <div className="label">Complaint</div>
                    <div className="value">{selectedComplaint.title}</div>
                    <div className="label" style={{ marginTop: '10px' }}>User</div>
                    <div className="value">{selectedComplaint.user?.name}</div>
                    <div className="label" style={{ marginTop: '10px' }}>Current Status</div>
                    <div className="value" style={{ marginTop: '4px' }}>
                      <span className={getStatusClass(selectedComplaint.status)}>
                        {getStatusInfo(selectedComplaint.status).icon} {selectedComplaint.status}
                      </span>
                    </div>
                  </div>

                  <div className="status-options-grid">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        className={`status-option ${newStatus === status.value ? 'selected' : ''}`}
                        onClick={() => setNewStatus(status.value)}
                      >
                        <span className="status-dot" style={{ background: status.color }} />
                        {status.icon} {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn-modal-cancel" onClick={() => setShowStatusModal(false)}>
                    Cancel
                  </button>
                  <button
                    className="btn-modal-update"
                    onClick={() => handleStatusChange(selectedComplaint._id, newStatus)}
                    disabled={updating || newStatus === selectedComplaint.status}
                  >
                    {updating ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Update Status
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Detail View Modal */}
          {showDetailModal && selectedComplaint && (
            <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                  <h2>Complaint Details</h2>
                  <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="complaint-info">
                    <div className="detail-row">
                      <span className="detail-label">Complaint ID</span>
                      <span className="detail-value" style={{ fontFamily: 'monospace', color: '#2563eb' }}>
                        #{selectedComplaint._id?.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">User</span>
                      <span className="detail-value">{selectedComplaint.user?.name || "Unknown"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{selectedComplaint.user?.email || "N/A"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Title</span>
                      <span className="detail-value">{selectedComplaint.title || "Untitled"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Category</span>
                      <span className="detail-value">{selectedComplaint.category}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Submitted</span>
                      <span className="detail-value">
                        {formatDate(selectedComplaint.createdAt)} at {formatTime(selectedComplaint.createdAt)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">
                        <span className={getStatusClass(selectedComplaint.status)}>
                          {getStatusInfo(selectedComplaint.status).icon} {selectedComplaint.status}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div className="label" style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                      Description
                    </div>
                    <div className="detail-description">
                      {selectedComplaint.description || "No description provided."}
                    </div>
                  </div>

                  {selectedComplaint.photo && (
                    <div style={{ marginTop: '16px' }}>
                      <div className="label" style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                        Attachment
                      </div>
                      <img
                        src={selectedComplaint.photo}
                        alt="Complaint attachment"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="btn-modal-cancel"
                    onClick={() => setShowDetailModal(false)}
                    style={{ flex: 1 }}
                  >
                    Close
                  </button>
                  <button
                    className="btn-modal-update"
                    onClick={() => {
                      setShowDetailModal(false);
                      setNewStatus(selectedComplaint.status);
                      setShowStatusModal(true);
                    }}
                    style={{ flex: 1 }}
                  >
                    <PenTool size={16} />
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default AllComplaints;
