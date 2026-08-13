import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Shield, Loader, Lock, AlertTriangle } from "lucide-react";

const ProtectedRoute = ({ 
  children, 
  isAuthenticated, 
  userRole, 
  requiredRoles = [], 
  redirectTo = "/login",
  isLoading = false 
}) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Simulate authentication check
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Loading state
  if (isLoading || isChecking) {
    return (
      <>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f0f4ff 0%, #e8edf5 100%);
            animation: fadeIn 0.6s ease-out;
          }

          .loading-spinner {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 3px solid #e2e8f0;
            border-top-color: #2563eb;
            animation: spin 0.8s linear infinite;
          }

          .loading-text {
            margin-top: 24px;
            color: #1e293b;
            font-weight: 500;
            font-size: 16px;
          }

          .loading-subtext {
            color: #94a3b8;
            font-size: 14px;
            margin-top: 8px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Verifying access...</div>
          <div className="loading-subtext">Please wait while we check your credentials</div>
        </div>
      </>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    return (
      <>
        <style>{`
          .unauthorized-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            padding: 20px;
            animation: fadeIn 0.6s ease-out;
          }

          .unauthorized-card {
            background: white;
            padding: 48px;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
            text-align: center;
            max-width: 480px;
            border: 1px solid rgba(239, 68, 68, 0.1);
          }

          .unauthorized-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }

          .unauthorized-title {
            color: #1e293b;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 12px;
          }

          .unauthorized-subtitle {
            color: #64748b;
            font-size: 16px;
            margin-bottom: 8px;
          }

          .unauthorized-role {
            display: inline-block;
            padding: 4px 16px;
            background: rgba(37, 99, 235, 0.1);
            color: #2563eb;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 8px;
          }

          .unauthorized-actions {
            margin-top: 32px;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn-primary {
            padding: 12px 28px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          }

          .btn-secondary {
            padding: 12px 28px;
            background: white;
            color: #1e293b;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .btn-secondary:hover {
            background: #f1f5f9;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 480px) {
            .unauthorized-card {
              padding: 32px 20px;
            }
            .unauthorized-title {
              font-size: 24px;
            }
          }
        `}</style>
        <div className="unauthorized-container">
          <div className="unauthorized-card">
            <div className="unauthorized-icon">
              <Lock size={40} color="#ef4444" />
            </div>
            <h1 className="unauthorized-title">Access Denied</h1>
            <p className="unauthorized-subtitle">
              You don't have permission to access this page.
            </p>
            <p className="unauthorized-subtitle" style={{ fontSize: '14px', color: '#94a3b8' }}>
              Required role{requiredRoles.length > 1 ? 's' : ''}: 
            </p>
            <div className="unauthorized-role">
              {requiredRoles.join(', ')}
            </div>
            <div className="unauthorized-actions">
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </button>
              <button 
                className="btn-secondary"
                onClick={() => window.location.href = '/login'}
              >
                Switch Account
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Render children if all checks pass
  return children;
};

// Higher-Order Component for easier usage
export const withProtection = (Component, options = {}) => {
  return function ProtectedComponent(props) {
    const { requiredRoles = [], redirectTo = "/login" } = options;
    
    // These would come from your auth context/state
    const isAuthenticated = true; // Replace with actual auth check
    const userRole = "admin"; // Replace with actual user role
    const isLoading = false;

    return (
      <ProtectedRoute
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        requiredRoles={requiredRoles}
        redirectTo={redirectTo}
        isLoading={isLoading}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

export default ProtectedRoute;