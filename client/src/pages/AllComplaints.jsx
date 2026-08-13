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
    { value: "Pending", label: "Pending", color: "#fbbf24", icon: "⏳" },
    { value: "In Progress", label: "In Progress", color: "#818cf8", icon: "🔄" },
    { value: "Resolved", label: "Resolved", color: "#34d399", icon: "✅" },
    { value: "Rejected", label: "Rejected", color: "#f87171", icon: "❌" },
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
    return found || { value: status, label: status, color: "#94a3b8", icon: "📋" };
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

  // Statistics - ONLY real statuses
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
        .all-complaints-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #16213e 100%);
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .all-complaints-main {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .all-complaints-main::before {
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

        .page-header .header-left .total-count {
          display: inline-block;
          padding: 2px 12px;
          border-radius: 20px;
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          font-size: 13px;
          font-weight: 600;
          margin-left: 8px;
        }

        .btn-refresh {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-refresh:hover {
          background: rgba(255,255,255,0.08);
          color: #f1f5f9;
          transform: translateY(-2px);
        }

        .btn-refresh .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Stats Row - ONLY real statuses */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-item {
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.06);
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-item:hover {
          transform: translateY(-4px);
          border-color: rgba(99,102,241,0.2);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }

        .stat-item .stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #f1f5f9;
        }

        .stat-item .stat-label {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
          font-weight: 500;
        }

        .stat-item .stat-icon-small {
          font-size: 16px;
          display: block;
          margin-bottom: 4px;
        }

        .stat-item.active {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.08);
        }

        /* Filters */
        .filters-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
          padding: 16px 20px;
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.06);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 200px;
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 30px rgba(99,102,241,0.1);
        }

        .search-box input {
          background: transparent;
          border: none;
          outline: none;
          color: #f1f5f9;
          font-size: 14px;
          width: 100%;
        }

        .search-box input::placeholder {
          color: #64748b;
        }

        .filter-select {
          padding: 10px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          color: #cbd5e1;
          font-size: 14px;
          cursor: pointer;
          outline: none;
          transition: all 0.3s ease;
          min-width: 140px;
        }

        .filter-select:focus {
          border-color: #6366f1;
        }

        .filter-select option {
          background: #1a1a2e;
          color: #f1f5f9;
        }

        /* Complaints Table */
        .complaints-table-card {
          padding: 24px;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.4s ease;
        }

        .complaints-table-card:hover {
          border-color: rgba(255,255,255,0.12);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .complaints-table-card table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }

        .complaints-table-card th {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 12px 16px;
          text-align: left;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
        }

        .complaints-table-card td {
          padding: 14px 16px;
          color: #e2e8f0;
          font-size: 14px;
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
          transition: all 0.3s ease;
          vertical-align: middle;
        }

        .complaints-table-card tbody tr {
          transition: all 0.3s ease;
        }

        .complaints-table-card tbody tr:hover td {
          background: rgba(99,102,241,0.06);
          transform: scale(1.01);
        }

        .complaint-id {
          font-family: monospace;
          font-weight: 600;
          color: #818cf8;
          font-size: 13px;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-avatar-small {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          font-size: 11px;
          font-weight: 700;
          color: white;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
        }

        .status-badge:hover {
          transform: scale(1.05);
        }

        .status-badge.pending {
          background: rgba(245,158,11,0.15);
          color: #fbbf24;
          border: 1px solid rgba(245,158,11,0.2);
        }

        .status-badge.progress {
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          border: 1px solid rgba(99,102,241,0.2);
        }

        .status-badge.resolved {
          background: rgba(16,185,129,0.15);
          color: #34d399;
          border: 1px solid rgba(16,185,129,0.2);
        }

        .status-badge.rejected {
          background: rgba(239,68,68,0.15);
          color: #f87171;
          border: 1px solid rgba(239,68,68,0.2);
        }

        .btn-action {
          padding: 6px 14px;
          border: none;
          border-radius: 10px;
          background: rgba(99,102,241,0.12);
          color: #818cf8;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-action:hover {
          background: rgba(99,102,241,0.25);
          transform: translateX(4px);
        }

        .btn-action.view-btn {
          background: rgba(99,102,241,0.12);
          color: #818cf8;
        }

        .btn-action.view-btn:hover {
          background: rgba(99,102,241,0.25);
        }

        .btn-action.status-btn {
          background: rgba(52,211,153,0.12);
          color: #34d399;
        }

        .btn-action.status-btn:hover {
          background: rgba(52,211,153,0.25);
        }

        /* Status Update Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-content {
          max-width: 500px;
          width: 90%;
          padding: 32px;
          border-radius: 24px;
          background: rgba(26, 26, 46, 0.95);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 80px rgba(0,0,0,0.5);
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
          color: #f1f5f9;
          font-size: 22px;
          font-weight: 700;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.3s ease;
          display: grid;
          place-items: center;
        }

        .modal-close:hover {
          background: rgba(239,68,68,0.15);
          color: #f87171;
        }

        .modal-body {
          margin-bottom: 24px;
        }

        .modal-body .complaint-info {
          padding: 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 16px;
        }

        .modal-body .complaint-info .label {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modal-body .complaint-info .value {
          color: #f1f5f9;
          font-size: 15px;
          margin-top: 2px;
        }

        .status-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .status-option {
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.03);
          color: #94a3b8;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-option:hover {
          border-color: rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          transform: translateY(-2px);
        }

        .status-option.selected {
          border-color: #6366f1;
          background: rgba(99,102,241,0.1);
          color: #f1f5f9;
        }

        .status-option .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
        }

        .btn-modal-cancel {
          flex: 1;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-modal-cancel:hover {
          background: rgba(255,255,255,0.08);
          color: #f1f5f9;
        }

        .btn-modal-update {
          flex: 2;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-modal-update:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.3);
        }

        .btn-modal-update:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        .empty-state .empty-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #f1f5f9;
          margin: 0 0 8px;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        .loading-state .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255,255,255,0.05);
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        .error-state {
          text-align: center;
          padding: 60px 20px;
          color: #f87171;
          background: rgba(239,68,68,0.08);
          border-radius: 16px;
          border: 1px solid rgba(239,68,68,0.15);
        }

        /* Detail Modal Styles */
        .detail-row {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .detail-row .detail-label {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
          width: 100px;
          flex-shrink: 0;
        }

        .detail-row .detail-value {
          color: #f1f5f9;
          font-size: 14px;
          flex: 1;
        }

        .detail-description {
          padding: 12px 16px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: #e2e8f0;
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
            padding: 6px 0;
          }

          .detail-row .detail-label {
            width: 100%;
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .stats-row {
            grid-template-columns: 1fr 1fr;
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
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              Refresh
            </button>
          </div>

          {/* Stats Row - ONLY real statuses */}
          <div className="stats-row">
            <div className="stat-item" onClick={() => setFilterStatus("All")}>
              <span className="stat-icon-small">📊</span>
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item" onClick={() => setFilterStatus("Pending")}>
              <span className="stat-icon-small">⏳</span>
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-item" onClick={() => setFilterStatus("In Progress")}>
              <span className="stat-icon-small">🔄</span>
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-item" onClick={() => setFilterStatus("Resolved")}>
              <span className="stat-icon-small">✅</span>
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div className="stat-item" onClick={() => setFilterStatus("Rejected")}>
              <span className="stat-icon-small">❌</span>
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-bar">
            <div className="search-box">
              <Search size={18} color="#64748b" />
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
                    background: '#6366f1',
                    color: 'white',
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
                        <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {complaint.title || "Untitled"}
                        </td>
                        <td>
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.06)',
                            color: '#94a3b8',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}>
                            {complaint.category}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
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
                              className="btn-action view-btn"
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowDetailModal(true);
                              }}
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button
                              className="btn-action status-btn"
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setNewStatus(complaint.status);
                                setShowStatusModal(true);
                              }}
                            >
                              <PenTool size={14} />
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
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="complaint-info">
                    <div className="label">Complaint</div>
                    <div className="value">{selectedComplaint.title}</div>
                    <div className="label" style={{ marginTop: '8px' }}>User</div>
                    <div className="value">{selectedComplaint.user?.name}</div>
                    <div className="label" style={{ marginTop: '8px' }}>Current Status</div>
                    <div className="value">
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
                        <Loader size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
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
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="complaint-info">
                    <div className="detail-row">
                      <span className="detail-label">Complaint ID</span>
                      <span className="detail-value" style={{ fontFamily: 'monospace', color: '#818cf8' }}>
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
                    <div className="label" style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                      Description
                    </div>
                    <div className="detail-description">
                      {selectedComplaint.description || "No description provided."}
                    </div>
                  </div>

                  {selectedComplaint.photo && (
                    <div style={{ marginTop: '16px' }}>
                      <div className="label" style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                        Attachment
                      </div>
                      <img 
                        src={selectedComplaint.photo} 
                        alt="Complaint attachment"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.08)',
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
                    <PenTool size={18} />
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