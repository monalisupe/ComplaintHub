import { Search, Bell, ChevronDown, Sparkles } from "lucide-react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <style>{`
      .navbar{
          height:85px;
          background:rgba(255,255,255,.75);
          backdrop-filter:blur(18px);
          border-radius:18px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding:0 28px;
          box-shadow:0 10px 35px rgba(0,0,0,.08);
          margin-bottom:30px;
          position:relative;
          overflow:hidden;
      }

      /* Animated Background Glow */
      .navbar::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 70% 30%, rgba(37,99,235,0.03) 0%, transparent 50%);
          animation: rotateGlow 15s linear infinite;
          pointer-events: none;
      }

      @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }

      .searchBox{
          width:360px;
          height:48px;
          background:#f8fafc;
          border-radius:12px;
          display:flex;
          align-items:center;
          padding:0 18px;
          transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position:relative;
          z-index:2;
      }

      .searchBox::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
      }

      .searchBox:hover::before {
          opacity: 1;
      }

      .searchBox:hover{
          box-shadow:0 8px 25px rgba(37,99,235,.25);
          transform: translateY(-2px) scale(1.01);
          background: white;
      }

      .searchBox:focus-within {
          box-shadow:0 8px 30px rgba(37,99,235,.3);
          transform: translateY(-2px) scale(1.02);
          background: white;
      }

      .searchBox input{
          border:none;
          outline:none;
          background:none;
          margin-left:12px;
          width:100%;
          font-size:15px;
          color: #0f172a;
          transition: all 0.3s ease;
      }

      .searchBox input::placeholder {
          color: #94a3b8;
          transition: color 0.3s ease;
      }

      .searchBox:hover input::placeholder {
          color: #64748b;
      }

      .searchBox svg {
          transition: all 0.3s ease;
          color: #94a3b8;
      }

      .searchBox:hover svg {
          color: #2563eb;
          transform: scale(1.1);
      }

      .rightSection{
          display:flex;
          align-items:center;
          gap:25px;
          position:relative;
          z-index:2;
      }

      .notification{
          width:46px;
          height:46px;
          border-radius:50%;
          background:#eff6ff;
          display:flex;
          justify-content:center;
          align-items:center;
          cursor:pointer;
          transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position:relative;
          overflow:hidden;
      }

      .notification::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          opacity: 0;
          transform: scale(0);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .notification:hover::before {
          opacity: 1;
          transform: scale(1);
      }

      .notification:hover{
          background:#2563eb;
          color:white;
          transform:translateY(-3px) scale(1.05);
          box-shadow:0 10px 30px rgba(37,99,235,.3);
      }

      .notification svg {
          position: relative;
          z-index: 1;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .notification:hover svg {
          transform: scale(1.15) rotate(10deg);
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
      }

      .notification::after {
          content: '';
          position: absolute;
          top: 6px;
          right: 6px;
          width: 10px;
          height: 10px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
          z-index: 2;
          animation: pulseDot 2s ease-in-out infinite;
      }

      @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
      }

      .profile{
          display:flex;
          align-items:center;
          gap:15px;
          cursor:pointer;
          padding:10px 15px;
          border-radius:14px;
          transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position:relative;
      }

      .profile::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(37,99,235,0.05), rgba(59,130,246,0.05));
          opacity: 0;
          transition: opacity 0.4s ease;
      }

      .profile:hover::before {
          opacity: 1;
      }

      .profile:hover{
          background:#f1f5f9;
          transform:translateY(-2px) scale(1.02);
          box-shadow:0 8px 25px rgba(0,0,0,.08);
      }

      .avatar{
          width:50px;
          height:50px;
          border-radius:50%;
          background:linear-gradient(135deg,#2563eb,#3b82f6);
          display:flex;
          justify-content:center;
          align-items:center;
          color:white;
          font-weight:700;
          font-size:18px;
          position:relative;
          transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink:0;
      }

      .profile:hover .avatar {
          transform: scale(1.08) rotate(-5deg);
          box-shadow:0 0 30px rgba(37,99,235,.3);
      }

      .avatar::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
      }

      .profile:hover .avatar::after {
          opacity: 0.3;
          animation: borderPulse 1.5s ease-in-out infinite;
      }

      @keyframes borderPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
      }

      .userInfo h4{
          margin:0;
          color:#0f172a;
          transition: all 0.3s ease;
          font-weight: 600;
      }

      .profile:hover .userInfo h4 {
          color: #2563eb;
      }

      .userInfo p{
          margin:0;
          font-size:13px;
          color:#64748b;
          transition: all 0.3s ease;
      }

      .status{
          display:flex;
          align-items:center;
          gap:6px;
      }

      .dot{
          width:8px;
          height:8px;
          border-radius:50%;
          background:#22c55e;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .profile:hover .dot {
          animation: dotPulse 1.5s ease-in-out infinite;
          box-shadow:0 0 20px rgba(34,197,94,.4);
      }

      @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.7; }
      }

      .profile svg:last-child {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          color: #94a3b8;
      }

      .profile:hover svg:last-child {
          transform: rotate(180deg) scale(1.1);
          color: #2563eb;
      }

      /* Soap Bubbles */
      .bubble-nav {
          position: absolute;
          border-radius: 50%;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          pointer-events: none;
          z-index: 1;
          opacity: 0.25;
          transition: all 0.5s ease;
      }

      .bubble-nav:hover {
          opacity: 0.5;
          transform: scale(1.2);
      }

      .bubble-nav-inner {
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
      }

      .bubble-nav-shine {
          position: absolute;
          top: 20%;
          left: 25%;
          width: 30%;
          height: 20%;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transform: rotate(-45deg);
          filter: blur(2px);
      }

      .bubble-nav-shine-2 {
          position: absolute;
          bottom: 25%;
          right: 20%;
          width: 15%;
          height: 10%;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: rotate(45deg);
          filter: blur(2px);
      }

      @keyframes floatBubbleNav {
          0%, 100% {
              transform: translate(0, 0) scale(1) rotate(0deg);
          }
          25% {
              transform: translate(8px, -12px) scale(1.05) rotate(5deg);
          }
          50% {
              transform: translate(-6px, -20px) scale(0.95) rotate(-3deg);
          }
          75% {
              transform: translate(10px, -8px) scale(1.02) rotate(4deg);
          }
      }

      .bubble-float-nav {
          animation: floatBubbleNav var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
      }

      /* Sparkle Particles */
      .sparkle-nav {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(37,99,235,0.4);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: sparkleFloatNav 3s ease-in-out infinite;
      }

      @keyframes sparkleFloatNav {
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
          .navbar {
              padding: 0 15px;
              height: 70px;
              border-radius: 12px;
          }
          .searchBox {
              width: 200px;
              height: 40px;
          }
          .rightSection {
              gap: 12px;
          }
          .userInfo {
              display: none;
          }
          .profile {
              padding: 5px 10px;
          }
          .avatar {
              width: 40px;
              height: 40px;
              font-size: 14px;
          }
          .notification {
              width: 40px;
              height: 40px;
          }
      }

      @media (max-width: 480px) {
          .searchBox {
              width: 130px;
          }
          .searchBox input {
              font-size: 13px;
          }
          .rightSection {
              gap: 8px;
          }
          .notification::after {
              width: 8px;
              height: 8px;
              top: 4px;
              right: 4px;
          }
      }
      `}</style>

      <div className="navbar">
        {/* Soap Bubbles */}
        <div 
          className="bubble-nav bubble-float-nav"
          style={{
            width: '80px',
            height: '80px',
            top: '-10px',
            left: '10%',
            '--duration': '7s',
            '--delay': '0s',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(59,130,246,0.05))',
          }}
        >
          <div className="bubble-nav-inner" />
          <div className="bubble-nav-shine" />
          <div className="bubble-nav-shine-2" />
        </div>

        <div 
          className="bubble-nav bubble-float-nav"
          style={{
            width: '60px',
            height: '60px',
            bottom: '-5px',
            right: '15%',
            '--duration': '9s',
            '--delay': '1s',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(59,130,246,0.04))',
          }}
        >
          <div className="bubble-nav-inner" />
          <div className="bubble-nav-shine" />
          <div className="bubble-nav-shine-2" />
        </div>

        <div 
          className="bubble-nav bubble-float-nav"
          style={{
            width: '50px',
            height: '50px',
            top: '50%',
            right: '30%',
            '--duration': '8s',
            '--delay': '2s',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(59,130,246,0.03))',
          }}
        >
          <div className="bubble-nav-inner" />
          <div className="bubble-nav-shine" />
          <div className="bubble-nav-shine-2" />
        </div>

        {/* Sparkle Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle-nav"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}

        <div className="searchBox">
          <Search size={18}/>
          <input
            type="text"
            placeholder="Search complaints..."
          />
        </div>

        <div className="rightSection">
          <div className="notification">
            <Bell size={20}/>
          </div>

          <div className="profile">
            <div className="avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="userInfo">
              <h4>{user?.name || 'User'}</h4>

              <div className="status">
                <div className="dot"></div>
                <p>Online</p>
              </div>
            </div>

            <ChevronDown size={18}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;