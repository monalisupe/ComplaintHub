import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { PlusCircle, Send, FileText, AlertCircle, CheckCircle, Image, X, Upload } from "lucide-react";

function CreateComplaint() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const categories = [
    "Water Supply",
    "Street Light",
    "Garbage",
    "Road",
    "Drainage",
    "Electricity",
    "Noise Pollution",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
  };

  // ✅ FIXED: Send JSON instead of FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Send as JSON - matches your backend expectation
      const response = await api.post("/complaints", {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        // Photo is commented out for now since backend doesn't handle it yet
        // photo: formData.photo, // Will add later with multer
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/my-complaints");
        }, 2000);
      }
    } catch (err) {
      console.error("Submit Complaint Error:", err);
      setError(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .create-complaint-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e1a 0%, #1a1a2e 50%, #16213e 100%);
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .create-complaint-main {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          position: relative;
          z-index: 1;
        }

        .create-complaint-main::before {
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

        .create-complaint-card {
          max-width: 800px;
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

        .create-complaint-card:hover {
          border-color: rgba(99,102,241,0.15);
          box-shadow: 0 8px 50px rgba(99,102,241,0.05);
        }

        .create-complaint-card .header {
          text-align: center;
          margin-bottom: 32px;
        }

        .create-complaint-card .header .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15));
          margin: 0 auto 16px;
          border: 1px solid rgba(99,102,241,0.15);
        }

        .create-complaint-card .header .icon-wrapper svg {
          color: #818cf8;
        }

        .create-complaint-card .header h2 {
          color: #f1f5f9;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .create-complaint-card .header p {
          color: #94a3b8;
          font-size: 15px;
          margin: 8px 0 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #cbd5e1;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .form-group label .required {
          color: #f87171;
          margin-left: 2px;
        }

        .form-group label .optional {
          color: #64748b;
          font-weight: 400;
          font-size: 12px;
          margin-left: 6px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: #f1f5f9;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #64748b;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 30px rgba(99,102,241,0.1);
          background: rgba(255,255,255,0.08);
        }

        .form-group select {
          appearance: none;
          cursor: pointer;
          color: #94a3b8;
        }

        .form-group select option {
          background: #1a1a2e;
          color: #f1f5f9;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        /* Photo Upload */
        .photo-upload-area {
          border: 2px dashed rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255,255,255,0.02);
          position: relative;
        }

        .photo-upload-area:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.05);
        }

        .photo-upload-area .upload-icon {
          color: #64748b;
          margin-bottom: 8px;
        }

        .photo-upload-area p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        .photo-upload-area .upload-hint {
          color: #64748b;
          font-size: 12px;
          margin-top: 4px;
        }

        .photo-preview {
          position: relative;
          display: inline-block;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .photo-preview img {
          max-width: 200px;
          max-height: 150px;
          object-fit: cover;
          border-radius: 12px;
        }

        .photo-preview .remove-photo {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(239,68,68,0.9);
          color: white;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: all 0.3s ease;
        }

        .photo-preview .remove-photo:hover {
          transform: scale(1.1);
          background: #ef4444;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .btn-submit {
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
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(99,102,241,0.3);
        }

        .btn-submit:disabled {
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
        }

        .btn-cancel:hover {
          background: rgba(255,255,255,0.08);
          color: #f1f5f9;
          transform: translateY(-2px);
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
          margin-bottom: 20px;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.2);
          color: #34d399;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .create-complaint-main {
            padding: 16px;
          }

          .create-complaint-card {
            padding: 24px;
          }

          .create-complaint-card .header h2 {
            font-size: 22px;
          }

          .form-actions {
            flex-direction: column;
          }

          .photo-preview img {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="create-complaint-wrapper">
        <Sidebar />
        <main className="create-complaint-main">
          <Navbar />

          <div className="create-complaint-card">
            <div className="header">
              <div className="icon-wrapper">
                <PlusCircle size={32} />
              </div>
              <h2>Submit New Complaint</h2>
              <p>Fill in the details below to register your complaint</p>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <CheckCircle size={20} />
                Complaint submitted successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input
                  type="text"
                  name="title"
                  placeholder="Brief title of your complaint"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category <span className="required">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description <span className="required">*</span></label>
                <textarea
                  name="description"
                  placeholder="Describe your complaint in detail..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Photo <span className="optional">(optional - coming soon)</span></label>
                {!photoPreview ? (
                  <div 
                    className="photo-upload-area"
                    onClick={() => document.getElementById('photoInput').click()}
                  >
                    <div className="upload-icon">
                      <Upload size={32} />
                    </div>
                    <p>Click to upload a photo</p>
                    <div className="upload-hint">PNG, JPG, JPEG up to 5MB</div>
                    <input
                      id="photoInput"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                ) : (
                  <div className="photo-preview">
                    <img src={photoPreview} alt="Complaint preview" />
                    <button type="button" className="remove-photo" onClick={removePhoto}>
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading || success}
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

export default CreateComplaint;