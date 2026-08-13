import { Sparkles } from "lucide-react";

function StatsCard({
  title,
  value,
  icon,
  color,
  bgColor,
}) {
  // Soap bubble positions specific to this card
  const bubbles = [
    { size: '40px', top: '-5px', right: '20%', delay: '0s', duration: '6s' },
    { size: '25px', bottom: '-5px', left: '15%', delay: '0.8s', duration: '7s' },
    { size: '30px', top: '40%', right: '-5px', delay: '1.5s', duration: '8s' },
  ];

  return (
    <>
      <style>{`
        .statsCard {
          background: white;
          border-radius: 18px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0,0,0,.08);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          overflow: hidden;
          position: relative;
        }

        /* Animated Background Glow */
        .statsCard::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--cardColor), var(--bgColor));
          opacity: 0;
          transition: opacity 0.5s ease;
          border-radius: 18px;
        }

        .statsCard:hover::after {
          opacity: 0.05;
        }

        .statsCard::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 6px;
          height: 100%;
          background: var(--cardColor);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 18px 0 0 18px;
        }

        .statsCard:hover::before {
          width: 8px;
          box-shadow: 0 0 30px var(--cardColor);
        }

        .statsCard:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 18px 40px rgba(37,99,235,.18), 0 0 60px rgba(37,99,235,.05);
        }

        .cardContent {
          position: relative;
          z-index: 2;
        }

        .cardTitle {
          color: #64748b;
          font-size: 15px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .statsCard:hover .cardTitle {
          color: var(--cardColor);
          transform: translateX(3px);
        }

        .cardValue {
          font-size: 34px;
          font-weight: 700;
          color: #0f172a;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .statsCard:hover .cardValue {
          transform: scale(1.05) translateX(5px);
          background: linear-gradient(135deg, var(--cardColor), var(--bgColor));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .iconBox {
          width: 65px;
          height: 65px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 26px;
          background: var(--bgColor);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 2;
          flex-shrink: 0;
        }

        .statsCard:hover .iconBox {
          transform: rotate(10deg) scale(1.15);
          box-shadow: 0 10px 30px var(--cardColor);
        }

        /* Glow ring around icon */
        .iconBox::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--cardColor), var(--bgColor));
          opacity: 0;
          transition: all 0.5s ease;
          z-index: -1;
        }

        .statsCard:hover .iconBox::before {
          opacity: 0.3;
          animation: borderPulse 1.5s ease-in-out infinite;
        }

        @keyframes borderPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        .statsCard:hover .iconBox svg {
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.3));
        }

        /* Sparkle on hover */
        .sparkle-icon {
          position: absolute;
          top: -8px;
          right: -8px;
          opacity: 0;
          transition: all 0.4s ease;
          z-index: 3;
          color: var(--cardColor);
        }

        .statsCard:hover .sparkle-icon {
          opacity: 1;
          transform: scale(1) rotate(180deg);
        }

        /* Soap Bubbles */
        .bubble-stats {
          position: absolute;
          border-radius: 50%;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transition: all 0.5s ease;
        }

        .statsCard:hover .bubble-stats {
          opacity: 0.3;
        }

        .bubble-stats-inner {
          position: absolute;
          inset: 15%;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
        }

        .bubble-stats-shine {
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

        .bubble-stats-shine-2 {
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

        @keyframes floatBubbleStats {
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

        .bubble-float-stats {
          animation: floatBubbleStats var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        /* Stats Counter Animation */
        .statsCard:hover .cardValue {
          animation: valuePulse 1s ease-in-out;
        }

        @keyframes valuePulse {
          0%, 100% { transform: scale(1.05) translateX(5px); }
          50% { transform: scale(1.1) translateX(5px); }
        }

        /* Hover shine effect */
        .shine-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255,255,255,0.03) 30%,
            rgba(255,255,255,0.06) 50%,
            rgba(255,255,255,0.03) 70%,
            transparent 100%
          );
          transform: rotate(45deg) translateX(-100%);
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          z-index: 1;
        }

        .statsCard:hover .shine-effect {
          transform: rotate(45deg) translateX(100%);
        }

        /* Progress indicator dot */
        .progress-dot {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--cardColor);
          opacity: 0;
          transition: all 0.4s ease;
          z-index: 2;
        }

        .statsCard:hover .progress-dot {
          opacity: 1;
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
      `}</style>

      <div
        className="statsCard"
        style={{
          "--cardColor": color,
          "--bgColor": bgColor,
        }}
      >
        {/* Shine Effect */}
        <div className="shine-effect" />

        {/* Soap Bubbles */}
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className={`bubble-stats bubble-float-stats`}
            style={{
              width: bubble.size,
              height: bubble.size,
              top: bubble.top || 'auto',
              right: bubble.right || 'auto',
              bottom: bubble.bottom || 'auto',
              left: bubble.left || 'auto',
              '--duration': bubble.duration,
              '--delay': bubble.delay,
              background: `linear-gradient(135deg, ${color}10, ${bgColor}05)`,
            }}
          >
            <div className="bubble-stats-inner" />
            <div className="bubble-stats-shine" />
            <div className="bubble-stats-shine-2" />
          </div>
        ))}

        {/* Content */}
        <div className="cardContent">
          <div className="cardTitle">{title}</div>
          <div className="cardValue">{value}</div>
        </div>

        <div className="iconBox">
          {icon}
          <Sparkles className="sparkle-icon" size={14} />
        </div>

        {/* Progress Dot */}
        <div className="progress-dot" />
      </div>
    </>
  );
}

export default StatsCard;