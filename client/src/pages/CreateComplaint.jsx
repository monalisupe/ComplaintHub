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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await api.post("/complaints", {
        title: formData.title,
        category: formData.category,
        description: formData.description,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/my-complaints");
        }, 1500);
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
        /* ========================================
           CREATE COMPLAINT - PROFESSIONAL WHITE THEME
           ======================================== */

        .create-complaint-wrapper {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          position: relative;
        }

        .create-complaint-main {
          flex: 1;
          padding: 28px 34px 50px;
          min-width: 0;
          position: relative;
          z-index: 1;
          background: #f8fafc;
        }

        .create-complaint-card {
          max-width: 760px;
          margin: 0 auto;
          padding: 36px 40px;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .create-complaint-card .header {
          text-align: center;
          margin-bottom: 28px;
        }

        .create-complaint-card .header .icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          margin: 0 auto 14px;
        }

        .create-complaint-card .header .icon-wrapper svg {
          color: #2563eb;
        }

        .create-complaint-card .header h2 {
          color: #0f172a;
          font-size: 24px;
          font-weight: 800;
          margin: 0;
        }

        .create-complaint-card .header p {
          color: #64748b;
          font-size: 14px;
          margin: 6px 0 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #334155;
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .form-group label .required {
          color: #ef4444;
          margin-left: 2px;
        }

        .form-group label .optional {
          color: #94a3b8;
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
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          font-size: 14px;
          transition: all 0.2s ease;
          outline: none;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: #94a3b8;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: #ffffff;
        }

        .form-group select {
          cursor: pointer;
        }

        .form-group select option {
          background: #ffffff;
          color: #0f172a;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        /* Photo Upload */
        .photo-upload-area {
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 22px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f8fafc;
          position: relative;
        }

        .photo-upload-area:hover {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .photo-upload-area .upload-icon {
          color: #64748b;
          margin-bottom: 8px;
        }

        .photo-upload-area p {
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          margin: 0;
        }

        .photo-upload-area .upload-hint {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
        }

        .photo-preview {
          position: relative;
          display: inline-block;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
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
          transition: all 0.2s ease;
        }

        .photo-preview .remove-photo:hover {
          background: #dc2626;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .btn-submit {
          flex: 1;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-submit:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 12px 24px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          color: #64748b;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          margin-bottom: 20px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .create-complaint-main {
            padding: 16px;
          }

          .create-complaint-card {
            padding: 24px 20px;
          }

          .create-complaint-card .header h2 {
            font-size: 20px;
          }

          .form-actions {
            flex-direction: column;
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
                <PlusCircle size={28} />
              </div>
              <h2>Submit New Complaint</h2>
              <p>Fill in the details below to register your complaint</p>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <CheckCircle size={18} />
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
                      <Upload size={28} />
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
                      <Send size={16} />
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
