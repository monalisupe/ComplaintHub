import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { FileText, Clock, CheckCircle, Loader, Eye, AlertCircle, PlusCircle, Calendar, Image } from "lucide-react";

function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/complaints/my");
      setComplaints(response.data.complaints || []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(err.response?.data?.message || "Failed to load complaints");
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
        return <Clock size={14} />;
      case "in progress":
        return <Loader size={14} className="animate-spin" />;
      case "resolved":
        return <CheckCircle size={14} />;
      case "rejected":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <style>{`
        .my-complaints-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #16213e 100%);
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .my-complaints-main {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .my-complaints-main::before {
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

        .my-complaints-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .my-complaints-header .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .my-complaints-header .header-left .header-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
          border: 1px solid rgba(99,102,241,0.15);
        }

        .my-complaints-header .header-left .header-icon svg {
          color: #818cf8;
        }

        .my-complaints-header .header-left h1 {
          color: #f1f5f9;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .my-complaints-header .header-left p {
          color: #94a3b8;
          font-size: 14px;
          margin: 4px 0 0;
        }

        .my-complaints-header .header-left .complaint-count {
          display: inline-block;
          padding: 2px 12px;
          border-radius: 20px;
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          font-size: 13px;
          font-weight: 600;
          margin-left: 8px;
        }

        .btn-new-complaint {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-new-complaint:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.3);
        }

        .my-complaints-card {
          padding: 28px;
          border-radius: 24px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.4s ease;
        }

        .my-complaints-card:hover {
          border-color: rgba(255,255,255,0.12);
        }

        .complaints-grid {
          display: grid;
          gap: 16px;
        }

        .complaint-card-item {
          padding: 20px 24px;
          border-radius: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .complaint-card-item:hover {
          background: rgba(99,102,241,0.06);
          border-color: rgba(99,102,241,0.15);
          transform: translateX(4px);
        }

        .complaint-card-item .complaint-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .complaint-card-item .complaint-info .complaint-title {
          color: #f1f5f9;
          font-weight: 600;
          font-size: 16px;
        }

        .complaint-card-item .complaint-info .complaint-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .complaint-card-item .complaint-info .complaint-meta span {
          color: #94a3b8;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .complaint-card-item .complaint-info .complaint-meta .category-tag {
          padding: 2px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.06);
          color: #94a3b8;
          font-size: 12px;
        }

        .complaint-card-item .complaint-info .complaint-meta .has-photo {
          color: #818cf8;
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
          white-space: nowrap;
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

        .complaint-card-item .complaint-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .btn-view-complaint {
          padding: 8px 16px;
          border: none;
          border-radius: 10px;
          background: rgba(99,102,241,0.12);
          color: #818cf8;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-view-complaint:hover {
          background: rgba(99,102,241,0.25);
          transform: translateX(4px);
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

        .empty-state p {
          margin: 0 0 4px;
        }

        .empty-state .btn-create-first {
          margin-top: 16px;
          padding: 12px 24px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .empty-state .btn-create-first:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.3);
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-state {
          text-align: center;
          padding: 60px 20px;
          color: #f87171;
          background: rgba(239,68,68,0.08);
          border-radius: 16px;
          border: 1px solid rgba(239,68,68,0.15);
        }

        @media (max-width: 768px) {
          .my-complaints-main {
            padding: 16px;
          }

          .my-complaints-header .header-left h1 {
            font-size: 22px;
          }

          .complaint-card-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .complaint-card-item .complaint-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .my-complaints-card {
            padding: 16px;
          }
        }
      `}</style>

      <div className="my-complaints-wrapper">
        <Sidebar />
        <main className="my-complaints-main">
          <Navbar />

          <div className="my-complaints-header">
            <div className="header-left">
              <div className="header-icon">
                <FileText size={24} />
              </div>
              <div>
                <h1>
                  My Complaints
                  <span className="complaint-count">{complaints.length}</span>
                </h1>
                <p>Track all your submitted complaints</p>
              </div>
            </div>
            <button
              className="btn-new-complaint"
              onClick={() => navigate("/create-complaint")}
            >
              <PlusCircle size={18} />
              New Complaint
            </button>
          </div>

          <div className="my-complaints-card">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading your complaints...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <AlertCircle size={32} style={{ margin: '0 auto 12px' }} />
                <p>{error}</p>
                <button
                  onClick={fetchComplaints}
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
            ) : complaints.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No complaints yet</h3>
                <p>You haven't submitted any complaints.</p>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Click the button below to create your first complaint.
                </p>
                <button
                  className="btn-create-first"
                  onClick={() => navigate("/create-complaint")}
                >
                  <PlusCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  Create Your First Complaint
                </button>
              </div>
            ) : (
              <div className="complaints-grid">
                {complaints.map((complaint) => (
                  <div key={complaint._id} className="complaint-card-item">
                    <div className="complaint-info">
                      <div className="complaint-title">
                        {complaint.title || "Untitled Complaint"}
                      </div>
                      <div className="complaint-meta">
                        <span className="category-tag">{complaint.category}</span>
                        <span>
                          <Calendar size={12} />
                          {formatDate(complaint.createdAt)}
                        </span>
                        <span>
                          <FileText size={12} />
                          #{complaint._id?.slice(-6).toUpperCase()}
                        </span>
                        {complaint.photo && (
                          <span className="has-photo">
                            <Image size={12} />
                            Has photo
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="complaint-actions">
                      <span className={getStatusClass(complaint.status)}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </span>
                      <button className="btn-view-complaint">
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default MyComplaints;