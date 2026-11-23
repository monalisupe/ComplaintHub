import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ComplaintModal from "../components/ComplaintModal";
import api from "../services/api";
import { FileText, Clock, CheckCircle, Loader, Eye, AlertCircle, PlusCircle, Calendar, Image } from "lucide-react";

function MyComplaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        return <Clock size={13} />;
      case "in progress":
        return <Loader size={13} className="animate-spin" />;
      case "resolved":
        return <CheckCircle size={13} />;
      case "rejected":
        return <AlertCircle size={13} />;
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
        /* ========================================
           MY COMPLAINTS - PROFESSIONAL WHITE THEME
           ======================================== */

        .my-complaints-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          position: relative;
        }

        .my-complaints-main {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          position: relative;
          z-index: 1;
          background: #f8fafc;
        }

        .my-complaints-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .my-complaints-header .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .my-complaints-header .header-left .header-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }

        .my-complaints-header .header-left .header-icon svg {
          color: #2563eb;
        }

        .my-complaints-header .header-left h1 {
          color: #0f172a;
          font-size: 26px;
          font-weight: 800;
          margin: 0;
        }

        .my-complaints-header .header-left p {
          color: #64748b;
          font-size: 14px;
          margin: 4px 0 0;
        }

        .my-complaints-header .header-left .complaint-count {
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

        .btn-new-complaint {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-new-complaint:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .my-complaints-card {
          padding: 24px 28px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .complaints-grid {
          display: grid;
          gap: 14px;
        }

        .complaint-card-item {
          padding: 18px 22px;
          border-radius: 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .complaint-card-item:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .complaint-card-item .complaint-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .complaint-card-item .complaint-info .complaint-title {
          color: #0f172a;
          font-weight: 600;
          font-size: 15px;
        }

        .complaint-card-item .complaint-info .complaint-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .complaint-card-item .complaint-info .complaint-meta span {
          color: #64748b;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .complaint-card-item .complaint-info .complaint-meta .category-tag {
          padding: 3px 10px;
          border-radius: 8px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 11px;
          font-weight: 600;
        }

        .complaint-card-item .complaint-info .complaint-meta .has-photo {
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
          white-space: nowrap;
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

        .complaint-card-item .complaint-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .btn-view-complaint {
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

        .btn-view-complaint:hover {
          background: #2563eb;
          color: #ffffff;
          border-color: #2563eb;
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

        .empty-state p {
          margin: 0 0 4px;
          font-size: 14px;
        }

        .empty-state .btn-create-first {
          margin-top: 18px;
          padding: 10px 22px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .empty-state .btn-create-first:hover {
          background: #1d4ed8;
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-state {
          text-align: center;
          padding: 40px 20px;
          color: #b91c1c;
          background: #fef2f2;
          border-radius: 16px;
          border: 1px solid #fecaca;
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
                    background: '#2563eb',
                    color: 'white',
                    fontWeight: 600,
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
                      <button
                        className="btn-view-complaint cursor-pointer"
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setIsModalOpen(true);
                        }}
                      >
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

        <ComplaintModal
          isOpen={isModalOpen}
          complaint={selectedComplaint}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
}

export default MyComplaints;
