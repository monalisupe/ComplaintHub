import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  LogOut,
  Sparkles,
  Shield,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

function Sidebar() {
  const [complaintsCount, setComplaintsCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "New Complaint",
      icon: <PlusCircle size={20} />,
      path: "/create-complaint",
    },
    {
      name: "My Complaints",
      icon: <FileText size={20} />,
      path: "/my-complaints",
    },
    {
      name: "Profile",
      icon: <User size={20} />,
      path: "/profile",
    },
  ];

  // Fetch complaints count for badge
  useEffect(() => {
    const fetchComplaintsCount = async () => {
      try {
        const response = await api.get("/complaints/my");
        setComplaintsCount(response.data.complaints?.length || 0);
      } catch (error) {
        console.error("Error fetching complaints count:", error);
        setComplaintsCount(0);
      }
    };
    fetchComplaintsCount();
  }, []);

  // Soap bubble positions
  const bubbles = [
    { top: '8%', left: '10%', size: '70px', delay: '0s', duration: '7s' },
    { top: '20%', right: '10%', size: '50px', delay: '0.8s', duration: '9s' },
    { bottom: '25%', left: '8%', size: '60px', delay: '1.5s', duration: '8s' },
    { bottom: '15%', right: '8%', size: '45px', delay: '2s', duration: '6s' },
    { top: '50%', left: '5%', size: '40px', delay: '2.5s', duration: '10s' },
    { top: '60%', right: '5%', size: '55px', delay: '1s', duration: '7s' },
    { top: '80%', left: '12%', size: '35px', delay: '3s', duration: '8s' },
    { bottom: '40%', right: '12%', size: '50px', delay: '0.5s', duration: '9s' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        /* ========================================
           SIDEBAR - PREMIUM DARK THEME
           ======================================== */

        .sidebar-premium {
          width: 270px;
          min-height: 100vh;
          padding: 28px 18px;
          display: flex;
          flex-direction: column;
          background: rgba(17, 24, 39, 0.85);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-right: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          overflow: hidden;
          box-shadow: 4px 0 30px rgba(0,0,0,0.3);
        }

        /* Animated Background Glow */
        .sidebar-premium::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 50%, rgba(99,102,241,0.05) 0%, transparent 50%);
          animation: rotateGlowSidebar 20s linear infinite;
          pointer-events: none;
        }

        @keyframes rotateGlowSidebar {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Logo */
        .logo-premium {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 8px 10px 25px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 24px;
          position: relative;
          z-index: 2;
        }

        .logo-premium .logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          box-shadow: 0 8px 30px rgba(99,102,241,0.3);
          animation: floatIcon 3s ease-in-out infinite;
          position: relative;
        }

        .logo-premium .logo-icon .shield {
          color: white;
        }

        @keyframes floatIcon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(3deg); }
        }

        .logo-premium .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-premium .logo-text h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: 0.5px;
        }

        .logo-premium .logo-text h2 span {
          background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-premium .logo-text small {
          font-size: 9px;
          letter-spacing: 2px;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
        }

        /* User Profile in Sidebar */
        .sidebar-user-premium {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          margin-bottom: 28px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .sidebar-user-premium:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(99,102,241,0.2);
          transform: translateY(-2px);
        }

        .sidebar-user-premium .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          font-weight: 700;
          font-size: 16px;
          color: white;
          box-shadow: 0 4px 15px rgba(99,102,241,0.3);
        }

        .sidebar-user-premium .user-info strong {
          display: block;
          color: #f1f5f9;
          font-size: 14px;
        }

        .sidebar-user-premium .user-info small {
          color: #94a3b8;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Menu */
        .menu-premium {
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
          z-index: 2;
          flex: 1;
        }

        .menu-premium a {
          text-decoration: none;
          color: #94a3b8;
          position: relative;
        }

        .menuItem-premium {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          font-weight: 500;
          font-size: 15px;
          color: #94a3b8;
          position: relative;
          border: 1px solid transparent;
        }

        /* Hover Effect */
        .menuItem-premium:hover {
          color: #f1f5f9;
          background: rgba(99,102,241,0.1);
          transform: translateX(4px);
          border-color: rgba(99,102,241,0.15);
        }

        .menuItem-premium:hover svg {
          color: #818cf8;
          transform: scale(1.1);
        }

        /* Active State */
        .menuItem-premium.active {
          color: #f1f5f9;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.12));
          border-color: rgba(99,102,241,0.2);
          box-shadow: 0 4px 20px rgba(99,102,241,0.08);
          transform: translateX(4px);
        }

        .menuItem-premium.active svg {
          color: #818cf8;
        }

        .menuItem-premium.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          border-radius: 0 4px 4px 0;
          background: linear-gradient(180deg, #6366f1, #8b5cf6);
          box-shadow: 0 0 20px rgba(99,102,241,0.3);
        }

        .menuItem-premium svg {
          width: 20px;
          height: 20px;
          transition: all 0.3s ease;
          color: #64748b;
        }

        .menuItem-premium.active svg {
          color: #818cf8;
        }

        /* Badge */
        .menuItem-premium .badge {
          margin-left: auto;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          background: rgba(99,102,241,0.15);
          color: #818cf8;
          transition: all 0.3s ease;
        }

        .menuItem-premium.active .badge {
          background: rgba(99,102,241,0.25);
          box-shadow: 0 0 20px rgba(99,102,241,0.15);
        }

        /* Logout Button */
        .logout-premium {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 14px;
          cursor: pointer;
          color: #f87171;
          font-weight: 500;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          z-index: 2;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.1);
        }

        .logout-premium:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 30px rgba(239,68,68,0.3);
          border-color: #ef4444;
        }

        .logout-premium:hover svg {
          transform: translateX(-5px) rotate(-10deg) scale(1.1);
        }

        .logout-premium svg {
          transition: all 0.3s ease;
        }

        /* Soap Bubbles */
        .bubble-premium {
          position: absolute;
          border-radius: 50%;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.08);
          pointer-events: none;
          z-index: 1;
          opacity: 0.2;
          transition: all 0.5s ease;
        }

        .bubble-premium:hover {
          opacity: 0.4;
          transform: scale(1.2);
        }

        .bubble-premium-inner {
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }

        .bubble-premium-shine {
          position: absolute;
          top: 20%;
          left: 25%;
          width: 30%;
          height: 20%;
          background: rgba(255,255,255,0.15);
          border-radius: 50%;
          transform: rotate(-45deg);
          filter: blur(2px);
        }

        .bubble-premium-shine-2 {
          position: absolute;
          bottom: 25%;
          right: 20%;
          width: 15%;
          height: 10%;
          background: rgba(255,255,255,0.08);
          border-radius: 50%;
          transform: rotate(45deg);
          filter: blur(2px);
        }

        @keyframes floatBubblePremium {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) scale(1.05) rotate(5deg);
          }
          50% {
            transform: translate(-8px, -25px) scale(0.95) rotate(-3deg);
          }
          75% {
            transform: translate(12px, -10px) scale(1.02) rotate(4deg);
          }
        }

        .bubble-float-premium {
          animation: floatBubblePremium var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        /* Sparkle Particles */
        .sparkle-premium {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(99,102,241,0.4);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: sparkleFloatPremium 3s ease-in-out infinite;
        }

        @keyframes sparkleFloatPremium {
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
          .sidebar-premium {
            width: 220px;
            padding: 20px 14px;
          }

          .logo-premium .logo-text h2 {
            font-size: 17px;
          }

          .menuItem-premium {
            font-size: 13px;
            padding: 12px 14px;
          }

          .sidebar-user-premium .user-info strong {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .sidebar-premium {
            display: none;
          }
        }
      `}</style>

      <div className="sidebar-premium">
        {/* Soap Bubbles */}
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className="bubble-premium bubble-float-premium"
            style={{
              width: bubble.size,
              height: bubble.size,
              top: bubble.top || 'auto',
              left: bubble.left || 'auto',
              right: bubble.right || 'auto',
              bottom: bubble.bottom || 'auto',
              '--duration': bubble.duration,
              '--delay': bubble.delay,
              background: `radial-gradient(circle at 30% 30%, rgba(99,102,241,0.1), rgba(139,92,246,0.04))`,
            }}
          >
            <div className="bubble-premium-inner" />
            <div className="bubble-premium-shine" />
            <div className="bubble-premium-shine-2" />
          </div>
        ))}

        {/* Sparkle Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle-premium"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}

        {/* Logo */}
        <div className="logo-premium">
          <div className="logo-icon">
            <Shield size={28} className="shield" />
          </div>
          <div className="logo-text">
            <h2><span>Complaint</span>Hub</h2>
            <small>Citizen Portal</small>
          </div>
        </div>

        {/* User Profile */}
        <div className="sidebar-user-premium">
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <strong>{user?.name || "User"}</strong>
            <small>
              <Sparkles size={12} style={{ display: 'inline' }} />
              Citizen
            </small>
          </div>
        </div>

        {/* Menu */}
        <div className="menu-premium">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "menuItem-premium active" : "menuItem-premium"
              }
            >
              {item.icon}
              {item.name}
              {item.name === "My Complaints" && complaintsCount > 0 && (
                <span className="badge">{complaintsCount}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div className="logout-premium" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </div>
      </div>
    </>
  );
}

export default Sidebar;