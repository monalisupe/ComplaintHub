import { Eye, Sparkles, Calendar, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

function ComplaintTable({ complaints = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const itemsPerPage = 5;

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "pending";
      case "In Progress":
        return "progress";
      case "Resolved":
        return "resolved";
      case "Rejected":
        return "rejected";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "In Progress":
        return "🔄";
      case "Resolved":
        return "✅";
      case "Rejected":
        return "❌";
      default:
        return "📋";
    }
  };

  const filteredComplaints = complaints.filter(item => {
    const matchesSearch = item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.status?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const statusOptions = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

  return (
    <>
      <style>{`
        .tableContainer {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 25px;
          margin-top: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.02);
          border: 1px solid rgba(255,255,255,0.5);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }

        .tableContainer:hover {
          box-shadow: 0 20px 60px rgba(37,99,235,0.08), 0 2px 10px rgba(0,0,0,0.02);
          transform: translateY(-2px);
        }

        .tableContainer::before {
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

        .tableHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          position: relative;
          z-index: 2;
          flex-wrap: wrap;
          gap: 15px;
        }

        .tableTitle {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tableTitle::after {
          content: '';
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, #2563eb20, transparent);
          margin-left: 10px;
          min-width: 50px;
        }

        .titleBadge {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          font-size: 13px;
          padding: 2px 14px;
          border-radius: 20px;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(37,99,235,0.2);
          white-space: nowrap;
        }

        .titleBadge:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(37,99,235,0.3);
        }

        .tableControls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .searchBox {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 8px 14px;
          transition: all 0.3s ease;
        }

        .searchBox:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .searchBox input {
          border: none;
          outline: none;
          background: transparent;
          margin-left: 8px;
          font-size: 14px;
          color: #0f172a;
          width: 160px;
        }

        .searchBox input::placeholder {
          color: #94a3b8;
        }

        .searchBox svg {
          color: #94a3b8;
          transition: color 0.3s ease;
        }

        .searchBox:focus-within svg {
          color: #2563eb;
        }

        .filterDropdown {
          padding: 8px 14px;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 12px;
          background: rgba(255,255,255,0.8);
          color: #0f172a;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
        }

        .filterDropdown:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        .filterDropdown:hover {
          border-color: #2563eb;
        }

        .tableWrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          position: relative;
          z-index: 2;
          width: 100%;
          border-radius: 16px;
        }

        /* ✅ FIXED: Table with proper column widths */
        table {
          width: 100%;
          min-width: 580px;
          border-collapse: separate;
          border-spacing: 0 6px;
          table-layout: fixed;
        }

        /* ✅ FIXED: Set exact column widths */
        thead th:nth-child(1) { width: 50px; }
        thead th:nth-child(2) { width: 130px; }
        thead th:nth-child(3) { width: 130px; }
        thead th:nth-child(4) { width: 120px; }
        thead th:nth-child(5) { width: 140px; }
        thead th:nth-child(6) { width: 90px; }

        thead th {
          padding: 14px 12px;
          text-align: left;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
          background: rgba(241, 245, 249, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid rgba(0,0,0,0.04);
          white-space: nowrap;
        }

        thead th:first-child {
          border-radius: 12px 0 0 0;
        }

        thead th:last-child {
          border-radius: 0 12px 0 0;
        }

        tbody tr {
          background: rgba(255,255,255,0.5);
          backdrop-filter: blur(5px);
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
        }

        tbody tr:hover {
          background: rgba(255,255,255,0.9);
          transform: scale(1.005) translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
        }

        /* ✅ FIXED: Prevent text overflow in cells */
        tbody td {
          padding: 12px 12px;
          border-bottom: 1px solid rgba(0,0,0,0.03);
          color: #0f172a;
          font-size: 13px;
          vertical-align: middle;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        tbody tr td:first-child {
          border-radius: 12px 0 0 12px;
        }

        tbody tr td:last-child {
          border-radius: 0 12px 12px 0;
        }

        .row-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: rgba(37,99,235,0.08);
          color: #2563eb;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        tbody tr:hover .row-number {
          background: #2563eb;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(37,99,235,0.3);
        }

        .complaint-id {
          font-family: "Courier New", monospace;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.5px;
          font-size: 12px;
          background: rgba(37,99,235,0.06);
          padding: 3px 10px;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: inline-block;
          white-space: nowrap;
        }

        tbody tr:hover .complaint-id {
          background: #2563eb;
          color: white;
          box-shadow: 0 4px 15px rgba(37,99,235,0.2);
        }

        .category-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 10px;
          background: rgba(241, 245, 249, 0.8);
          border-radius: 12px;
          font-size: 12px;
          color: #475569;
          transition: all 0.3s ease;
          white-space: nowrap;
          max-width: 100%;
        }

        tbody tr:hover .category-tag {
          background: rgba(37,99,235,0.06);
          color: #2563eb;
        }

        .date-cell {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #64748b;
          font-size: 12px;
          white-space: nowrap;
        }

        tbody tr:hover .date-cell {
          color: #0f172a;
        }

        .date-cell svg {
          width: 13px;
          height: 13px;
          opacity: 0.6;
        }

        .status {
          padding: 4px 12px;
          border-radius: 30px;
          color: white;
          font-size: 11px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          letter-spacing: 0.3px;
        }

        .status::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 30px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        tbody tr:hover .status::before {
          opacity: 1;
        }

        .pending {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          box-shadow: 0 4px 15px rgba(245,158,11,0.25);
        }

        tbody tr:hover .pending {
          box-shadow: 0 6px 25px rgba(245,158,11,0.4);
          transform: scale(1.05);
        }

        .progress {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          box-shadow: 0 4px 15px rgba(139,92,246,0.25);
        }

        tbody tr:hover .progress {
          box-shadow: 0 6px 25px rgba(139,92,246,0.4);
          transform: scale(1.05);
        }

        .resolved {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          box-shadow: 0 4px 15px rgba(34,197,94,0.25);
        }

        tbody tr:hover .resolved {
          box-shadow: 0 6px 25px rgba(34,197,94,0.4);
          transform: scale(1.05);
        }

        .rejected {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 15px rgba(239,68,68,0.25);
        }

        tbody tr:hover .rejected {
          box-shadow: 0 6px 25px rgba(239,68,68,0.4);
          transform: scale(1.05);
        }

        .viewBtn {
          border: none;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          padding: 5px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(37,99,235,0.15);
        }

        .viewBtn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .viewBtn:hover::before {
          opacity: 1;
        }

        .viewBtn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 30px rgba(37,99,235,0.35);
        }

        .viewBtn:active {
          transform: scale(0.95);
        }

        .viewBtn svg {
          transition: all 0.4s ease;
          width: 13px;
          height: 13px;
        }

        .viewBtn:hover svg {
          transform: translateX(2px) scale(1.1);
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid rgba(0,0,0,0.05);
          position: relative;
          z-index: 2;
          flex-wrap: wrap;
          gap: 10px;
        }

        .paginationInfo {
          color: #64748b;
          font-size: 13px;
        }

        .paginationInfo strong {
          color: #0f172a;
        }

        .paginationButtons {
          display: flex;
          gap: 6px;
        }

        .pageBtn {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 10px;
          background: rgba(255,255,255,0.6);
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 500;
        }

        .pageBtn:hover {
          background: rgba(37,99,235,0.08);
          border-color: #2563eb;
          color: #2563eb;
          transform: translateY(-2px);
        }

        .pageBtn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
          box-shadow: 0 4px 15px rgba(37,99,235,0.2);
        }

        .pageBtn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        .empty-icon {
          display: block;
          margin: 0 auto 15px;
          opacity: 0.3;
        }

        /* Soap Bubbles */
        .bubble-table {
          position: absolute;
          border-radius: 50%;
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.3);
          pointer-events: none;
          z-index: 1;
          opacity: 0.2;
          transition: all 0.5s ease;
        }

        .tableContainer:hover .bubble-table {
          opacity: 0.3;
        }

        .bubble-table-inner {
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
        }

        .bubble-table-shine {
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

        .bubble-table-shine-2 {
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

        @keyframes floatBubbleTable {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(6px, -10px) scale(1.05) rotate(3deg);
          }
          50% {
            transform: translate(-5px, -15px) scale(0.95) rotate(-3deg);
          }
          75% {
            transform: translate(8px, -6px) scale(1.02) rotate(2deg);
          }
        }

        .bubble-float-table {
          animation: floatBubbleTable var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .sparkle-table {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(37,99,235,0.2);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: sparkleFloatTable 3s ease-in-out infinite;
        }

        @keyframes sparkleFloatTable {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .tableContainer {
            padding: 15px;
            border-radius: 16px;
          }
          
          .tableTitle {
            font-size: 18px;
          }
          
          .tableHeader {
            flex-direction: column;
            align-items: stretch;
          }

          .tableControls {
            flex-direction: column;
            width: 100%;
          }

          .searchBox {
            width: 100%;
          }

          .searchBox input {
            width: 100%;
          }

          .filterDropdown {
            width: 100%;
          }

          th, td {
            padding: 8px 8px;
            font-size: 11px;
          }
          
          .status {
            padding: 3px 8px;
            font-size: 10px;
          }
          
          .viewBtn {
            padding: 4px 10px;
            font-size: 10px;
          }
          
          .viewBtn span {
            display: none;
          }

          .complaint-id {
            font-size: 10px;
            padding: 2px 6px;
          }

          .category-tag {
            font-size: 10px;
            padding: 2px 6px;
          }

          .date-cell {
            font-size: 10px;
          }

          .row-number {
            width: 22px;
            height: 22px;
            font-size: 10px;
          }

          .pagination {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .tableContainer {
            padding: 10px;
            border-radius: 12px;
          }

          .tableTitle {
            font-size: 16px;
          }

          .titleBadge {
            font-size: 11px;
            padding: 2px 10px;
          }

          th, td {
            padding: 6px 4px;
            font-size: 10px;
          }
          
          .status {
            padding: 2px 6px;
            font-size: 9px;
          }

          .complaint-id {
            font-size: 9px;
            padding: 2px 4px;
          }

          .category-tag {
            font-size: 9px;
            padding: 2px 4px;
          }

          .date-cell {
            font-size: 9px;
          }

          .row-number {
            width: 18px;
            height: 18px;
            font-size: 9px;
          }

          .viewBtn {
            padding: 3px 6px;
            font-size: 9px;
          }

          .viewBtn svg {
            width: 10px;
            height: 10px;
          }

          .pageBtn {
            width: 28px;
            height: 28px;
            font-size: 10px;
          }
        }
      `}</style>

      <div className="tableContainer">
        <div className="tableHeader">
          <div className="tableTitle">
            Recent Complaints
            <span className="titleBadge">{complaints.length} Total</span>
          </div>

          <div className="tableControls">
            <div className="searchBox">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filterDropdown"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Complaint ID</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedComplaints.length === 0 ? (
                <tr>
                  <td className="empty" colSpan="6">
                    <Sparkles className="empty-icon" size={32} />
                    No complaints found.
                    <div style={{ fontSize: '13px', marginTop: '5px', color: '#94a3b8' }}>
                      {searchTerm || filterStatus !== "All" ? "Try adjusting your filters" : "Start by creating your first complaint"}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedComplaints.map((item, index) => (
                  <tr key={item._id || item.id || index}>
                    <td>
                      <span className="row-number">
                        {startIndex + index + 1}
                      </span>
                    </td>

                    <td>
                      <span className="complaint-id">
                        #{item._id?.slice(-6).toUpperCase() || item.id?.slice(-6).toUpperCase() || 'N/A'}
                      </span>
                    </td>

                    <td>
                      <span className="category-tag">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>

                    <td>
                      <span className="date-cell">
                        <Calendar size={13} />
                        {new Date(item.date || item.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    <td>
                      <span className={`status ${getStatusClass(item.status)}`}>
                        {getStatusIcon(item.status)} {item.status || 'Pending'}
                      </span>
                    </td>

                    <td>
                      <button className="viewBtn">
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredComplaints.length > 0 && (
          <div className="pagination">
            <div className="paginationInfo">
              Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, filteredComplaints.length)}</strong> of <strong>{filteredComplaints.length}</strong> entries
            </div>

            <div className="paginationButtons">
              <button
                className="pageBtn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`pageBtn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                className="pageBtn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ComplaintTable;