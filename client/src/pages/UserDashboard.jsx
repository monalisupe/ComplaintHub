import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ComplaintTable from "../components/ComplaintTable";
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
  TrendingUp,
  TrendingDown,
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

  // Stats data matching admin colors
  const statCards = [
    {
      title: "Total Complaints",
      value: total,
      icon: <FileText size={24} />,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      subtitle: "All your complaints",
    },
    {
      title: "Pending",
      value: pending,
      icon: <Clock size={24} />,
      color: "orange",
      gradient: "from-orange-500 to-yellow-500",
      subtitle: "Awaiting action",
    },
    {
      title: "In Progress",
      value: progress,
      icon: <Loader size={24} className="animate-spin" />,
      color: "cyan",
      gradient: "from-cyan-500 to-teal-500",
      subtitle: "Being resolved",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: <CheckCircle size={24} />,
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      subtitle: "Successfully resolved",
    },
  ];

  // Floating bubbles
  const bubbles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 30,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.08 + 0.02,
  }));

  return (
    <>
      <style>{`
        /* ========================================
           USER DASHBOARD - PREMIUM DARK THEME
           Matching Admin Dashboard Colors
           ======================================== */

        .user-dashboard-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #16213e 100%);
          position: relative;
          overflow: hidden;
        }

        /* Animated Background Glows */
        .user-bg-glow {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.12;
          animation: floatGlow 20s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 0;
        }

        .user-bg-glow.glow-1 {
          top: -10%;
          left: -5%;
          background: radial-gradient(circle, #6366f1, #8b5cf6);
          animation-delay: 0s;
        }

        .user-bg-glow.glow-2 {
          bottom: -10%;
          right: -5%;
          background: radial-gradient(circle, #06b6d4, #3b82f6);
          animation-delay: -5s;
        }

        .user-bg-glow.glow-3 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #8b5cf6, #ec4899);
          animation-delay: -10s;
          width: 300px;
          height: 300px;
        }

        @keyframes floatGlow {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(10px, -10px) scale(1.05); }
        }

        /* Floating Bubbles */
        .bubble-particle-user {
          position: fixed;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.04);
          backdrop-filter: blur(4px);
          pointer-events: none;
          z-index: 0;
          animation: floatBubble var(--duration) ease-in-out infinite alternate;
          animation-delay: var(--delay);
        }

        @keyframes floatBubble {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(15px, -25px) scale(1.05) rotate(5deg); }
          50% { transform: translate(-10px, -35px) scale(0.95) rotate(-3deg); }
          75% { transform: translate(20px, -15px) scale(1.02) rotate(4deg); }
          100% { transform: translate(-8px, -30px) scale(1) rotate(-2deg); }
        }

        /* Layout */
        .user-layout-premium {
          display: flex;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        .user-main-premium {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          position: relative;
        }

        /* Premium Top Bar */
        .user-topbar-premium {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          margin-bottom: 28px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          transition: all 0.4s ease;
        }

        .user-topbar-premium:hover {
          border-color: rgba(99,102,241,0.3);
          box-shadow: 0 8px 40px rgba(99,102,241,0.1);
        }

        .user-search-premium {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.06);
          padding: 10px 18px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
          flex: 1;
          max-width: 400px;
        }

        .user-search-premium:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 30px rgba(99,102,241,0.15);
          background: rgba(255,255,255,0.08);
        }

        .user-search-premium input {
          background: transparent;
          border: none;
          outline: none;
          color: #e2e8f0;
          font-size: 14px;
          width: 100%;
        }

        .user-search-premium input::placeholder {
          color: #64748b;
        }

        .user-actions-premium {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-action-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.05);
          color: #94a3b8;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .user-action-btn:hover {
          background: rgba(99,102,241,0.15);
          border-color: #6366f1;
          color: #e2e8f0;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.15);
        }

        .user-profile-premium {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 6px 16px 6px 6px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-profile-premium:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-2px);
        }

        .user-avatar-premium {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          font-weight: 700;
          font-size: 16px;
          color: white;
          box-shadow: 0 4px 15px rgba(99,102,241,0.3);
        }

        .user-profile-premium .profile-info strong {
          display: block;
          color: #f1f5f9;
          font-size: 14px;
        }

        .user-profile-premium .profile-info small {
          color: #94a3b8;
          font-size: 11px;
        }

        /* Welcome Section */
        .user-welcome-premium {
          padding: 32px 36px;
          margin-bottom: 28px;
          background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .user-welcome-premium::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(99,102,241,0.1), transparent 70%);
          border-radius: 50%;
          animation: floatGlow 8s ease-in-out infinite alternate;
        }

        .user-welcome-premium:hover {
          border-color: rgba(99,102,241,0.2);
          box-shadow: 0 8px 40px rgba(99,102,241,0.08);
        }

        .user-welcome-premium .welcome-left {
          position: relative;
          z-index: 1;
        }

        .user-badge-premium {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2));
          border: 1px solid rgba(99,102,241,0.2);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #a78bfa;
          text-transform: uppercase;
        }

        .user-welcome-premium h1 {
          margin: 14px 0 6px;
          font-size: 34px;
          font-weight: 800;
          color: #f1f5f9;
        }

        .user-welcome-premium h1 span {
          background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 200%;
          animation: gradientShift 4s ease-in-out infinite alternate;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .user-welcome-premium p {
          color: #94a3b8;
          font-size: 15px;
          margin: 0;
        }

        .user-welcome-premium .welcome-right {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .user-stat-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          color: #cbd5e1;
          font-size: 13px;
          transition: all 0.3s ease;
        }

        .user-stat-chip:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(99,102,241,0.2);
          transform: translateY(-2px);
        }

        .user-stat-chip .chip-value {
          font-weight: 700;
          color: #f1f5f9;
        }

        /* Stats Grid */
        .user-stats-premium {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .user-stat-card-premium {
          position: relative;
          padding: 24px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          overflow: hidden;
        }

        .user-stat-card-premium::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gradient-from), var(--gradient-to));
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .user-stat-card-premium:hover::before {
          opacity: 1;
        }

        .user-stat-card-premium:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .user-stat-card-premium .stat-glow {
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, var(--glow-color), transparent 60%);
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }

        .user-stat-card-premium:hover .stat-glow {
          opacity: 0.1;
        }

        .user-stat-card-premium .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }

        .user-stat-card-premium .stat-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: var(--icon-bg);
          color: var(--icon-color);
          transition: all 0.4s ease;
          position: relative;
          z-index: 1;
        }

        .user-stat-card-premium:hover .stat-icon-wrapper {
          transform: rotate(-10deg) scale(1.1);
        }

        .user-stat-card-premium .stat-value {
          font-size: 36px;
          font-weight: 800;
          color: #f1f5f9;
          margin: 14px 0 4px;
          position: relative;
          z-index: 1;
        }

        .user-stat-card-premium .stat-title {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        .user-stat-card-premium .stat-subtitle {
          color: #64748b;
          font-size: 12px;
          margin-top: 4px;
          position: relative;
          z-index: 1;
        }

        /* Complaint Table */
        .user-table-premium {
          border-radius: 24px;
          padding: 28px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.4s ease;
        }

        .user-table-premium:hover {
          border-color: rgba(255,255,255,0.1);
        }

        .user-table-premium .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .user-table-premium .table-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .user-table-premium .table-header-left .header-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2));
          color: #a78bfa;
        }

        .user-table-premium .table-header h2 {
          margin: 0;
          color: #f1f5f9;
          font-size: 20px;
          font-weight: 700;
        }

        .user-table-premium .table-header p {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 13px;
        }

        .table-wrapper-premium {
          overflow-x: auto;
          border-radius: 16px;
        }

        .user-table-premium table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 6px;
        }

        .user-table-premium th {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 14px 16px;
          text-align: left;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
        }

        .user-table-premium td {
          padding: 14px 16px;
          color: #e2e8f0;
          font-size: 14px;
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .user-table-premium tbody tr {
          transition: all 0.3s ease;
        }

        .user-table-premium tbody tr:hover td {
          background: rgba(99,102,241,0.08);
          transform: scale(1.01);
        }

        .user-table-premium .complaint-id {
          font-family: monospace;
          font-weight: 600;
          color: #818cf8;
          font-size: 13px;
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

        .view-btn-premium {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: none;
          border-radius: 10px;
          background: rgba(99,102,241,0.12);
          color: #818cf8;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-btn-premium:hover {
          background: rgba(99,102,241,0.25);
          transform: translateX(4px);
        }

        /* Loading & Error */
        .user-loading-premium {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
          color: #94a3b8;
        }

        .user-loading-premium .spinner-premium {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(255,255,255,0.05);
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .user-error-premium {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          background: rgba(239,68,68,0.08);
          border-radius: 24px;
          border: 1px solid rgba(239,68,68,0.15);
          padding: 40px;
          color: #f87171;
        }

        .user-error-premium button {
          padding: 10px 24px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-error-premium button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.3);
        }

        .empty-state-premium {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        .empty-state-premium .empty-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }

        .empty-state-premium h3 {
          color: #f1f5f9;
          margin: 0 0 8px;
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
            padding: 24px;
          }

          .user-welcome-premium h1 {
            font-size: 24px;
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

          .user-stat-card-premium .stat-value {
            font-size: 28px;
          }

          .user-table-premium {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .user-welcome-premium h1 {
            font-size: 20px;
          }

          .user-stat-card-premium {
            padding: 16px;
          }

          .user-stat-card-premium .stat-value {
            font-size: 24px;
          }

          .user-table-premium table {
            font-size: 12px;
          }

          .user-table-premium td,
          .user-table-premium th {
            padding: 10px 12px;
          }
        }
      `}</style>

      <div className="user-dashboard-wrapper">
        {/* Animated Background Glows */}
        <div className="user-bg-glow glow-1"></div>
        <div className="user-bg-glow glow-2"></div>
        <div className="user-bg-glow glow-3"></div>

        {/* Floating Bubbles */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble-particle-user"
            style={{
              width: bubble.size + 'px',
              height: bubble.size + 'px',
              left: bubble.left + '%',
              top: bubble.top + '%',
              '--duration': bubble.duration + 's',
              '--delay': bubble.delay + 's',
              opacity: bubble.opacity,
            }}
          />
        ))}

        <div className="user-layout-premium">
          <Sidebar />

          <main className="user-main-premium">
            {/* Premium Top Bar */}
            <header className="user-topbar-premium">
              <div className="user-search-premium">
                <Search size={18} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search your complaints..."
                />
                <kbd style={{
                  background: 'rgba(255,255,255,0.05)',
                  padding: '2px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#64748b',
                  border: '1px solid rgba(255,255,255,0.05)'
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
                  Citizen Panel
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
                  <FileText size={14} color="#818cf8" />
                  <span>Total: <span className="chip-value">{total}</span></span>
                </div>
                <div className="user-stat-chip">
                  <Clock size={14} color="#fbbf24" />
                  <span>Pending: <span className="chip-value">{pending}</span></span>
                </div>
                <div className="user-stat-chip">
                  <Calendar size={14} color="#818cf8" />
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
                <div style={{ fontSize: '48px' }}>⚠️</div>
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
                {/* Stats Cards - Matching Admin Colors */}
                <section className="user-stats-premium">
                  {statCards.map((stat, index) => (
                    <div
                      key={index}
                      className="user-stat-card-premium"
                      style={{
                        '--gradient-from': stat.color === 'blue' ? '#3b82f6' : 
                                          stat.color === 'orange' ? '#f59e0b' :
                                          stat.color === 'cyan' ? '#06b6d4' :
                                          stat.color === 'green' ? '#10b981' : '#3b82f6',
                        '--gradient-to': stat.color === 'blue' ? '#06b6d4' :
                                          stat.color === 'orange' ? '#fbbf24' :
                                          stat.color === 'cyan' ? '#14b8a6' :
                                          stat.color === 'green' ? '#22c55e' : '#06b6d4',
                        '--glow-color': stat.color === 'blue' ? 'rgba(59,130,246,0.3)' :
                                          stat.color === 'orange' ? 'rgba(245,158,11,0.3)' :
                                          stat.color === 'cyan' ? 'rgba(6,182,212,0.3)' :
                                          stat.color === 'green' ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)',
                        '--icon-bg': `linear-gradient(135deg, ${stat.color === 'blue' ? 'rgba(59,130,246,0.2)' : 
                                          stat.color === 'orange' ? 'rgba(245,158,11,0.2)' :
                                          stat.color === 'cyan' ? 'rgba(6,182,212,0.2)' :
                                          stat.color === 'green' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)'}, 
                                          ${stat.color === 'blue' ? 'rgba(6,182,212,0.1)' : 
                                          stat.color === 'orange' ? 'rgba(251,191,36,0.1)' :
                                          stat.color === 'cyan' ? 'rgba(20,184,166,0.1)' :
                                          stat.color === 'green' ? 'rgba(34,197,94,0.1)' : 'rgba(6,182,212,0.1)'})`,
                        '--icon-color': stat.color === 'blue' ? '#60a5fa' : 
                                          stat.color === 'orange' ? '#fbbf24' :
                                          stat.color === 'cyan' ? '#22d3ee' :
                                          stat.color === 'green' ? '#34d399' : '#60a5fa',
                      }}
                    >
                      <div className="stat-glow"></div>
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
                        style={{ marginTop: '16px', padding: '10px 24px' }}
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
                              <td>{complaint.title || "Untitled"}</td>
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
                                <button className="view-btn-premium">
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
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;