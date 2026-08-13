import { 
  X, 
  Calendar, 
  Tag, 
  User, 
  MapPin, 
  FileText, 
  Clock,
  AlertCircle,
  CheckCircle,
  Loader,
  Sparkles,
  Shield,
  Eye,
  MessageSquare
} from "lucide-react";

function ComplaintModal({ complaint, isOpen, onClose }) {
  if (!isOpen || !complaint) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "In Progress":
        return "status-progress";
      case "Resolved":
        return "status-resolved";
      case "Rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={18} />;
      case "In Progress":
        return <Loader size={18} className="animate-spin" />;
      case "Resolved":
        return <CheckCircle size={18} />;
      case "Rejected":
        return <AlertCircle size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  // Soap bubbles for decoration
  const bubbles = [
    { size: '60px', top: '-10px', right: '5%', delay: '0s', duration: '7s' },
    { size: '40px', bottom: '5%', left: '8%', delay: '1s', duration: '9s' },
    { size: '35px', top: '50%', right: '2%', delay: '2s', duration: '8s' },
    { size: '45px', bottom: '40%', left: '3%', delay: '0.5s', duration: '6s' },
  ];

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
          padding: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 28px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 30px 80px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.05);
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Glassmorphism shine effect */
        .modal-content::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%);
          animation: rotateGlow 20s linear infinite;
          pointer-events: none;
        }

        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Soap Bubbles */
        .modal-bubble {
          position: absolute;
          border-radius: 50%;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.3);
          pointer-events: none;
          z-index: 1;
          opacity: 0.2;
          transition: all 0.5s ease;
        }

        .modal-bubble:hover {
          opacity: 0.4;
          transform: scale(1.2);
        }

        .modal-bubble-inner {
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }

        .modal-bubble-shine {
          position: absolute;
          top: 20%;
          left: 25%;
          width: 30%;
          height: 20%;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          transform: rotate(-45deg);
          filter: blur(2px);
        }

        .modal-bubble-shine-2 {
          position: absolute;
          bottom: 25%;
          right: 20%;
          width: 15%;
          height: 10%;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          transform: rotate(45deg);
          filter: blur(2px);
        }

        @keyframes floatBubble {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(5px, -8px) scale(1.05) rotate(3deg);
          }
          50% {
            transform: translate(-4px, -12px) scale(0.95) rotate(-3deg);
          }
          75% {
            transform: translate(6px, -5px) scale(1.02) rotate(2deg);
          }
        }

        .bubble-float {
          animation: floatBubble var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .modal-header {
          padding: 28px 30px 20px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 2;
        }

        .modal-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .modal-header-left .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(37,99,235,0.2);
          transition: all 0.3s ease;
        }

        .modal-header-left .icon-wrapper:hover {
          transform: scale(1.05) rotate(-5deg);
          box-shadow: 0 12px 40px rgba(37,99,235,0.3);
        }

        .modal-header-left .icon-wrapper svg {
          color: white;
        }

        .modal-header-left .title-group h3 {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
        }

        .modal-header-left .title-group .complaint-id {
          font-size: 13px;
          font-family: "Courier New", monospace;
          font-weight: 600;
          color: #2563eb;
          background: rgba(37,99,235,0.06);
          padding: 2px 12px;
          border-radius: 8px;
          display: inline-block;
          margin-top: 4px;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 12px;
          background: rgba(0,0,0,0.04);
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .close-btn:hover {
          background: rgba(239,68,68,0.1);
          color: #dc2626;
          transform: rotate(90deg) scale(1.05);
        }

        .modal-body {
          padding: 24px 30px 30px;
          position: relative;
          z-index: 2;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .detail-item {
          background: rgba(255,255,255,0.4);
          border-radius: 14px;
          padding: 14px 16px;
          border: 1px solid rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }

        .detail-item:hover {
          background: rgba(255,255,255,0.7);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        .detail-item .label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .detail-item .label svg {
          width: 14px;
          height: 14px;
        }

        .detail-item .value {
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
          word-break: break-word;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        /* Status Badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .status-badge:hover {
          transform: scale(1.05);
        }

        .status-pending {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 20px rgba(245,158,11,0.25);
        }

        .status-pending:hover {
          box-shadow: 0 6px 30px rgba(245,158,11,0.4);
        }

        .status-progress {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          box-shadow: 0 4px 20px rgba(139,92,246,0.25);
        }

        .status-progress:hover {
          box-shadow: 0 6px 30px rgba(139,92,246,0.4);
        }

        .status-resolved {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 4px 20px rgba(34,197,94,0.25);
        }

        .status-resolved:hover {
          box-shadow: 0 6px 30px rgba(34,197,94,0.4);
        }

        .status-rejected {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 20px rgba(239,68,68,0.25);
        }

        .status-rejected:hover {
          box-shadow: 0 6px 30px rgba(239,68,68,0.4);
        }

        /* Description section */
        .description-section {
          background: rgba(255,255,255,0.3);
          border-radius: 14px;
          padding: 16px 18px;
          border: 1px solid rgba(0,0,0,0.03);
          margin-top: 4px;
          transition: all 0.3s ease;
        }

        .description-section:hover {
          background: rgba(255,255,255,0.6);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }

        .description-section .label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        .description-section .label svg {
          width: 14px;
          height: 14px;
        }

        .description-section .value {
          font-size: 14px;
          color: #0f172a;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        /* Modal Footer */
        .modal-footer {
          padding: 16px 30px 24px;
          border-top: 1px solid rgba(0,0,0,0.04);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .modal-footer .btn {
          padding: 10px 24px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-footer .btn-primary {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          box-shadow: 0 4px 20px rgba(37,99,235,0.2);
        }

        .modal-footer .btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 35px rgba(37,99,235,0.35);
        }

        .modal-footer .btn-secondary {
          background: rgba(0,0,0,0.04);
          color: #64748b;
        }

        .modal-footer .btn-secondary:hover {
          background: rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        /* Scrollbar */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(37,99,235,0.2);
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(37,99,235,0.3);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .modal-content {
            max-width: 100%;
            border-radius: 20px;
            margin: 10px;
          }

          .modal-header {
            padding: 20px 20px 16px;
          }

          .modal-body {
            padding: 16px 20px 20px;
          }

          .modal-footer {
            padding: 14px 20px 18px;
            flex-direction: column;
          }

          .modal-footer .btn {
            justify-content: center;
            padding: 12px;
          }

          .detail-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .modal-header-left .icon-wrapper {
            width: 42px;
            height: 42px;
          }

          .modal-header-left .icon-wrapper svg {
            width: 20px;
            height: 20px;
          }

          .modal-header-left .title-group h3 {
            font-size: 17px;
          }

          .detail-item {
            padding: 10px 12px;
          }

          .detail-item .value {
            font-size: 13px;
          }

          .status-badge {
            font-size: 12px;
            padding: 4px 12px;
          }
        }

        @media (max-width: 400px) {
          .modal-header {
            padding: 16px 16px 12px;
            flex-direction: column;
            gap: 12px;
          }

          .modal-body {
            padding: 12px 16px 16px;
          }

          .modal-footer {
            padding: 12px 16px 16px;
          }

          .close-btn {
            align-self: flex-end;
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          
          {/* Soap Bubbles */}
          {bubbles.map((bubble, index) => (
            <div
              key={index}
              className="modal-bubble bubble-float"
              style={{
                width: bubble.size,
                height: bubble.size,
                top: bubble.top || 'auto',
                right: bubble.right || 'auto',
                bottom: bubble.bottom || 'auto',
                left: bubble.left || 'auto',
                '--duration': bubble.duration,
                '--delay': bubble.delay,
                background: `linear-gradient(135deg, rgba(37,99,235,0.06), rgba(59,130,246,0.03))`,
              }}
            >
              <div className="modal-bubble-inner" />
              <div className="modal-bubble-shine" />
              <div className="modal-bubble-shine-2" />
            </div>
          ))}

          {/* Header */}
          <div className="modal-header">
            <div className="modal-header-left">
              <div className="icon-wrapper">
                <Shield size={24} />
              </div>
              <div className="title-group">
                <h3>{complaint.title || "Complaint Details"}</h3>
                <span className="complaint-id">
                  #{complaint._id?.slice(-6).toUpperCase() || 'N/A'}
                </span>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Detail Grid */}
            <div className="detail-grid">
              <div className="detail-item">
                <div className="label">
                  <Tag size={14} />
                  Category
                </div>
                <div className="value">{complaint.category || 'Uncategorized'}</div>
              </div>

              <div className="detail-item">
                <div className="label">
                  <Clock size={14} />
                  Status
                </div>
                <div className="value">
                  <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="detail-item">
                <div className="label">
                  <Calendar size={14} />
                  Date Submitted
                </div>
                <div className="value">{formatDate(complaint.createdAt || complaint.date)}</div>
              </div>

              <div className="detail-item">
                <div className="label">
                  <MapPin size={14} />
                  Location
                </div>
                <div className="value">{complaint.location || 'Not specified'}</div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <div className="label">
                <MessageSquare size={14} />
                Description
              </div>
              <div className="value">
                {complaint.description || 'No description provided.'}
              </div>
            </div>

            {/* User Info if available */}
            {complaint.user && (
              <div style={{ marginTop: '14px' }}>
                <div className="detail-item full-width">
                  <div className="label">
                    <User size={14} />
                    Reported By
                  </div>
                  <div className="value">
                    {typeof complaint.user === 'object' 
                      ? complaint.user.name || complaint.user.email || 'Unknown'
                      : complaint.user}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              <Eye size={16} />
              Close & Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ComplaintModal;