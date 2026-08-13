import { useState, useEffect } from "react";
import { 
  X, 
  FileText, 
  Tag, 
  AlignLeft, 
  MapPin, 
  Save, 
  AlertCircle,
  CheckCircle,
  Sparkles,
  Shield,
  Edit,
  Loader,
  RefreshCw
} from "lucide-react";
import api from "../services/api";

function EditComplaintModal({ complaint, isOpen, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = [
    "Street Light",
    "Water Leakage",
    "Water Supply",
    "Drainage",
    "Garbage",
    "Roads",
    "Electricity",
    "Sewage",
    "Public Property Damage",
    "Others",
  ];

  useEffect(() => {
    if (complaint) {
      setFormData({
        title: complaint.title || "",
        category: complaint.category || "",
        description: complaint.description || "",
        location: complaint.location || "",
      });
    }
  }, [complaint]);

  if (!isOpen || !complaint) return null;

  const isPending = complaint.status === "Pending";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const response = await api.put(`/complaints/${complaint._id}`, formData);
      
      setSuccess(true);
      onUpdate(response.data.complaint);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update complaint");
    } finally {
      setLoading(false);
    }
  };

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

  // Soap bubbles for decoration
  const bubbles = [
    { size: '55px', top: '-8px', right: '8%', delay: '0s', duration: '7s' },
    { size: '38px', bottom: '8%', left: '6%', delay: '1.2s', duration: '9s' },
    { size: '30px', top: '45%', right: '3%', delay: '2s', duration: '8s' },
    { size: '42px', bottom: '35%', left: '4%', delay: '0.8s', duration: '6s' },
  ];

  return (
    <>
      <style>{`
        .edit-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1001;
          animation: fadeIn 0.3s ease-out;
          padding: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .edit-modal-content {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 28px;
          max-width: 580px;
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
        .edit-modal-content::before {
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
        .edit-bubble {
          position: absolute;
          border-radius: 50%;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.3);
          pointer-events: none;
          z-index: 1;
          opacity: 0.2;
          transition: all 0.5s ease;
        }

        .edit-bubble:hover {
          opacity: 0.4;
          transform: scale(1.2);
        }

        .edit-bubble-inner {
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }

        .edit-bubble-shine {
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

        .edit-bubble-shine-2 {
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

        @keyframes floatBubbleEdit {
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

        .bubble-float-edit {
          animation: floatBubbleEdit var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .edit-modal-header {
          padding: 24px 28px 18px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 2;
        }

        .edit-modal-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .edit-modal-header-left .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(139,92,246,0.2);
          transition: all 0.3s ease;
        }

        .edit-modal-header-left .icon-wrapper:hover {
          transform: scale(1.05) rotate(-5deg);
          box-shadow: 0 12px 40px rgba(139,92,246,0.3);
        }

        .edit-modal-header-left .icon-wrapper svg {
          color: white;
        }

        .edit-modal-header-left .title-group h3 {
          font-size: 19px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .edit-modal-header-left .title-group .status-badge {
          font-size: 11px;
          padding: 3px 12px;
          border-radius: 20px;
          font-weight: 600;
          color: white;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .status-pending {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 4px 15px rgba(245,158,11,0.2);
        }

        .edit-modal-header-left .title-group .complaint-id {
          font-size: 12px;
          font-family: "Courier New", monospace;
          color: #64748b;
          background: rgba(0,0,0,0.04);
          padding: 2px 10px;
          border-radius: 6px;
          display: inline-block;
          margin-top: 2px;
        }

        .edit-close-btn {
          width: 38px;
          height: 38px;
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

        .edit-close-btn:hover {
          background: rgba(239,68,68,0.1);
          color: #dc2626;
          transform: rotate(90deg) scale(1.05);
        }

        .edit-modal-body {
          padding: 22px 28px 28px;
          position: relative;
          z-index: 2;
        }

        /* Not Editable Warning */
        .not-editable-warning {
          background: linear-gradient(135deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02));
          border: 1px solid rgba(239,68,68,0.1);
          border-radius: 14px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          animation: slideUp 0.4s ease-out;
        }

        .not-editable-warning svg {
          color: #ef4444;
          flex-shrink: 0;
        }

        .not-editable-warning .warning-text {
          color: #dc2626;
          font-size: 14px;
          font-weight: 500;
        }

        .not-editable-warning .warning-sub {
          color: #64748b;
          font-size: 13px;
        }

        .edit-form-group {
          margin-bottom: 18px;
          position: relative;
          z-index: 2;
        }

        .edit-form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 5px;
        }

        .edit-form-group label .required {
          color: #ef4444;
          margin-left: 2px;
        }

        .edit-form-group .input-wrapper {
          position: relative;
        }

        .edit-form-group .input-wrapper svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: all 0.3s ease;
        }

        .edit-form-group .input-wrapper:focus-within svg {
          color: #8b5cf6;
        }

        .edit-form-group input,
        .edit-form-group select,
        .edit-form-group textarea {
          width: 100%;
          padding: 11px 16px 11px 44px;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 14px;
          font-size: 14px;
          color: #0f172a;
          background: rgba(255,255,255,0.6);
          transition: all 0.3s ease;
          outline: none;
        }

        .edit-form-group textarea {
          padding: 11px 16px 11px 44px;
          min-height: 100px;
          resize: vertical;
          font-family: inherit;
        }

        .edit-form-group input:focus,
        .edit-form-group select:focus,
        .edit-form-group textarea:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139,92,246,0.08);
          background: white;
        }

        .edit-form-group input:disabled,
        .edit-form-group select:disabled,
        .edit-form-group textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .edit-form-group input::placeholder,
        .edit-form-group textarea::placeholder {
          color: #94a3b8;
        }

        .edit-success-message {
          padding: 12px 16px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 14px;
          color: #16a34a;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          animation: slideUp 0.4s ease-out;
        }

        .edit-error-message {
          padding: 12px 16px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.1);
          border-radius: 14px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          animation: shake 0.5s ease-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .edit-modal-footer {
          padding: 16px 28px 24px;
          border-top: 1px solid rgba(0,0,0,0.04);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .edit-btn {
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

        .edit-btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          box-shadow: 0 4px 20px rgba(139,92,246,0.2);
        }

        .edit-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 35px rgba(139,92,246,0.35);
        }

        .edit-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .edit-btn-primary .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .edit-btn-secondary {
          background: rgba(0,0,0,0.04);
          color: #64748b;
        }

        .edit-btn-secondary:hover {
          background: rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .edit-btn-disabled {
          background: rgba(0,0,0,0.04);
          color: #94a3b8;
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Scrollbar */
        .edit-modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .edit-modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .edit-modal-content::-webkit-scrollbar-thumb {
          background: rgba(139,92,246,0.2);
          border-radius: 10px;
        }

        .edit-modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(139,92,246,0.3);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .edit-modal-content {
            max-width: 100%;
            border-radius: 20px;
            margin: 10px;
          }

          .edit-modal-header {
            padding: 18px 18px 14px;
          }

          .edit-modal-body {
            padding: 14px 18px 18px;
          }

          .edit-modal-footer {
            padding: 14px 18px 18px;
            flex-direction: column;
          }

          .edit-modal-footer .edit-btn {
            justify-content: center;
            padding: 12px;
          }

          .edit-modal-header-left .icon-wrapper {
            width: 38px;
            height: 38px;
          }

          .edit-modal-header-left .icon-wrapper svg {
            width: 18px;
            height: 18px;
          }

          .edit-modal-header-left .title-group h3 {
            font-size: 16px;
          }

          .edit-form-group input,
          .edit-form-group select,
          .edit-form-group textarea {
            font-size: 13px;
            padding: 9px 12px 9px 38px;
          }

          .edit-form-group .input-wrapper svg {
            width: 18px;
            height: 18px;
            left: 10px;
          }

          .not-editable-warning {
            flex-direction: column;
            text-align: center;
            padding: 12px;
          }
        }

        @media (max-width: 400px) {
          .edit-modal-header {
            flex-direction: column;
            gap: 10px;
          }

          .edit-close-btn {
            align-self: flex-end;
          }
        }
      `}</style>

      <div className="edit-modal-overlay" onClick={onClose}>
        <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
          
          {/* Soap Bubbles */}
          {bubbles.map((bubble, index) => (
            <div
              key={index}
              className="edit-bubble bubble-float-edit"
              style={{
                width: bubble.size,
                height: bubble.size,
                top: bubble.top || 'auto',
                right: bubble.right || 'auto',
                bottom: bubble.bottom || 'auto',
                left: bubble.left || 'auto',
                '--duration': bubble.duration,
                '--delay': bubble.delay,
                background: `linear-gradient(135deg, rgba(139,92,246,0.06), rgba(124,58,237,0.03))`,
              }}
            >
              <div className="edit-bubble-inner" />
              <div className="edit-bubble-shine" />
              <div className="edit-bubble-shine-2" />
            </div>
          ))}

          {/* Header */}
          <div className="edit-modal-header">
            <div className="edit-modal-header-left">
              <div className="icon-wrapper">
                <Edit size={22} />
              </div>
              <div className="title-group">
                <h3>
                  Edit Complaint
                  <span className={`status-badge ${getStatusColor(complaint.status)}`}>
                    {complaint.status || 'Pending'}
                  </span>
                </h3>
                <span className="complaint-id">
                  #{complaint._id?.slice(-6).toUpperCase() || 'N/A'}
                </span>
              </div>
            </div>
            <button className="edit-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="edit-modal-body">
            {/* Not Editable Warning */}
            {!isPending && (
              <div className="not-editable-warning">
                <AlertCircle size={20} />
                <div>
                  <div className="warning-text">This complaint cannot be edited</div>
                  <div className="warning-sub">
                    Only complaints with <strong>Pending</strong> status can be edited.
                    Current status: <strong>{complaint.status}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="edit-success-message">
                <CheckCircle size={18} />
                <span>Complaint updated successfully!</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="edit-error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="edit-form-group">
                <label>
                  Complaint Title <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FileText size={18} />
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter complaint title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={!isPending || loading}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="edit-form-group">
                <label>
                  Category <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <Tag size={18} />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={!isPending || loading}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="edit-form-group">
                <label>
                  Description <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <AlignLeft size={18} style={{ top: '16px', transform: 'none' }} />
                  <textarea
                    name="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isPending || loading}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="edit-form-group">
                <label>Location</label>
                <div className="input-wrapper">
                  <MapPin size={18} />
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter location (optional)"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isPending || loading}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="edit-modal-footer">
                <button 
                  type="button" 
                  className="edit-btn edit-btn-secondary" 
                  onClick={onClose}
                >
                  Cancel
                </button>
                
                {isPending ? (
                  <button
                    type="submit"
                    className="edit-btn edit-btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="edit-btn edit-btn-disabled"
                    disabled
                  >
                    <RefreshCw size={18} />
                    Cannot Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditComplaintModal;