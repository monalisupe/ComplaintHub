import React from "react";
import {
  X,
  Calendar,
  Tag,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader,
  Shield,
  Eye,
  MessageSquare,
} from "lucide-react";

export default function ComplaintModal({ complaint, isOpen, onClose }) {
  if (!isOpen || !complaint) return null;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          style: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "in progress":
        return {
          icon: <Loader className="w-3.5 h-3.5 animate-spin" />,
          style: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "resolved":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          style: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "rejected":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          style: "bg-rose-50 text-rose-700 border-rose-200",
        };
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          style: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  const statusInfo = getStatusBadge(complaint.status);

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in font-sans"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {complaint.title || "Complaint Details"}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-blue-600 font-mono font-bold">
                  #{complaint._id?.slice(-6).toUpperCase() || "N/A"}
                </span>
                <span className="text-slate-300">•</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.style}`}
                >
                  {statusInfo.icon}
                  {complaint.status || "Pending"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3.5 my-5">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
              <Tag className="w-3.5 h-3.5 text-blue-600" /> Category
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {complaint.category || "General"}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> Submitted On
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {formatDate(complaint.createdAt || complaint.date)}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-5">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Description
          </span>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {complaint.description || "No additional description provided."}
          </p>
        </div>

        {/* User Info if available */}
        {complaint.user && (
          <div className="mb-5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-blue-600" /> Reported By:
            </span>
            <span className="text-slate-900 font-bold">
              {typeof complaint.user === "object"
                ? complaint.user.name || complaint.user.email
                : complaint.user}
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" /> Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
