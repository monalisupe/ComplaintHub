import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, User, LogOut, Settings, HelpCircle, Bell, Sparkles } from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "All Complaints",
      path: "/all-complaints",
      icon: <FileText size={20} />,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <User size={20} />,
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside style={{
      width: '280px',
      minHeight: '100vh',
      padding: '28px 20px',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(17, 24, 39, 0.8)',
      backdropFilter: 'blur(30px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '0 10px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '16px',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
          boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
          fontSize: '22px',
        }}>
          🛡️
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#f1f5f9' }}>ComplaintHub</h2>
          <span style={{ fontSize: '9px', letterSpacing: '2px', color: '#818cf8', fontWeight: '700' }}>
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* User Profile */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '28px',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          fontWeight: '700',
          fontSize: '18px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
        }}>
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div>
          <strong style={{ display: 'block', color: '#f1f5f9', fontSize: '15px' }}>
            {user?.name || "Admin"}
          </strong>
          <small style={{ color: '#94a3b8', fontSize: '12px' }}>
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Administrator
          </small>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path ||
            (item.path === "/all-complaints" && location.pathname.startsWith("/all-complaints"));

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                border: 'none',
                padding: '14px 18px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                color: active ? '#f1f5f9' : '#94a3b8',
                background: active ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))' : 'transparent',
                border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                transform: active ? 'translateX(4px)' : 'none',
                boxShadow: active ? '0 4px 20px rgba(99,102,241,0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ width: '24px', textAlign: 'center', color: active ? '#818cf8' : '#64748b' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && (
                <span style={{
                  marginLeft: 'auto',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#818cf8',
                  boxShadow: '0 0 20px rgba(99,102,241,0.5)',
                  animation: 'pulseDot 2s ease-in-out infinite',
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button style={{
          border: 'none',
          padding: '12px 18px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.03)',
          color: '#94a3b8',
          transition: 'all 0.3s ease',
          border: '1px solid transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.color = '#e2e8f0';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.color = '#94a3b8';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        >
          <Settings size={18} />
          Settings
        </button>

        <button
          onClick={logout}
          style={{
            border: 'none',
            padding: '14px 18px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            background: 'rgba(239,68,68,0.08)',
            color: '#f87171',
            transition: 'all 0.3s ease',
            border: '1px solid transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(239,68,68,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;