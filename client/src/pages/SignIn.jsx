import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CreditCard,
  User,
  Fingerprint,
  Zap,
  Crown,
  Gem,
  Star,
  AlertCircle
} from "lucide-react";
import api from "../services/api";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // Redirect based on role
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Soap bubble positions for floating animation
  const bubbles = [
    { top: '5%', left: '2%', size: '120px', delay: '0s', duration: '8s' },
    { top: '10%', right: '2%', size: '90px', delay: '0.5s', duration: '7s' },
    { bottom: '15%', left: '3%', size: '100px', delay: '1s', duration: '9s' },
    { bottom: '10%', right: '3%', size: '80px', delay: '1.5s', duration: '6s' },
    { top: '45%', left: '1%', size: '70px', delay: '2s', duration: '8s' },
    { top: '40%', right: '1%', size: '60px', delay: '2.5s', duration: '7s' },
    { top: '25%', left: '10%', size: '50px', delay: '3s', duration: '5s' },
    { bottom: '35%', right: '8%', size: '55px', delay: '3.5s', duration: '6s' },
  ];

  // Gradient colors for bubbles
  const bubbleGradients = [
    'from-cyan-400 to-blue-500',
    'from-blue-400 to-indigo-500',
    'from-violet-400 to-purple-500',
    'from-emerald-400 to-teal-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
    'from-sky-400 to-cyan-500',
    'from-fuchsia-400 to-purple-500',
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 flex items-center justify-center px-6 relative overflow-hidden font-['Poppins',sans-serif]"
      style={{
        background: `
          radial-gradient(ellipse at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at ${100 - mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at center, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 1) 100%)
        `
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400/10 animate-float-particle"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: Math.random() * 15 + 10 + 's',
              animationDelay: Math.random() * 10 + 's',
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Floating Glowing Soap Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className={`absolute rounded-full bg-gradient-to-br ${bubbleGradients[index % bubbleGradients.length]} backdrop-blur-md animate-float-slow shadow-[0_0_80px_rgba(34,211,238,0.15)] border border-white/30 cursor-pointer pointer-events-auto hover:scale-110 transition-all duration-700 group`}
            style={{
              width: bubble.size,
              height: bubble.size,
              top: bubble.top,
              left: bubble.left || 'auto',
              right: bubble.right || 'auto',
              bottom: bubble.bottom || 'auto',
              animationDuration: bubble.duration,
              animationDelay: bubble.delay,
              opacity: 0.4,
              boxShadow: `0 0 60px rgba(34, 211, 238, 0.1), inset 0 0 60px rgba(255, 255, 255, 0.05)`,
            }}
          >
            {/* Inner glow effect */}
            <div className="absolute inset-2 rounded-full bg-white/5 backdrop-blur-sm" />
            <div className="absolute inset-4 rounded-full bg-white/5 backdrop-blur-sm" />
            
            {/* Shine effect */}
            <div className="absolute top-2 left-4 w-8 h-4 bg-white/30 rounded-full blur-sm transform -rotate-45" />
            <div className="absolute bottom-4 right-3 w-4 h-2 bg-white/20 rounded-full blur-sm transform rotate-45" />
            
            {/* Sparkle on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <Star className="w-6 h-6 text-white/30 absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse" />
                <Star className="w-4 h-4 text-white/20 absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-pulse delay-300" />
                <Star className="w-5 h-5 text-white/25 absolute left-0 top-1/2 transform -translate-y-1/2 animate-pulse delay-500" />
                <Star className="w-5 h-5 text-white/25 absolute right-0 top-1/2 transform -translate-y-1/2 animate-pulse delay-700" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md animate-slideUpFadeIn">
        
        {/* Decorative floating elements around card */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl animate-pulse delay-700" />

        {/* Login Card */}
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.08)] border border-white/10 p-8 overflow-hidden group hover:shadow-[0_0_100px_rgba(34,211,238,0.12)] transition-all duration-700">
          
          {/* Card Glow Effects */}
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl animate-pulse delay-500" />
          
          {/* Top Gradient Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Logo Section */}
          <div className="flex justify-center mb-6 relative">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-xl opacity-30 animate-pulse-gentle" />
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.2)] border border-cyan-400/20 group-hover:shadow-[0_0_60px_rgba(34,211,238,0.3)] transition-all duration-500 group-hover:scale-110">
                <Shield size={36} className="text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
              </div>
              {/* Sparkle */}
              <div className="absolute -top-2 -right-2 animate-pulse">
                <Sparkles className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.2)] font-['Poppins'] tracking-tight">
              ComplaintHub
            </h1>
            <p className="text-slate-300 mt-2 font-['Inter'] flex items-center justify-center gap-2">
              <span>Welcome back!</span>
              <span className="text-cyan-400">✦</span>
              <span className="text-sm text-slate-400">Sign in to continue</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-['Inter']">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Email Field */}
            <div className="relative group/email">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/email:text-cyan-400 transition-all duration-300">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  pl-12
                  pr-4
                  py-3.5
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-slate-400
                  focus:outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-400/30
                  focus:shadow-[0_0_30px_rgba(59,130,246,0.15)]
                  transition-all
                  duration-300
                  hover:bg-white/10
                  font-['Inter']
                "
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/email:opacity-100 transition-opacity duration-300">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group/password">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/password:text-cyan-400 transition-all duration-300">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  pl-12
                  pr-12
                  py-3.5
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  text-white
                  placeholder-slate-400
                  focus:outline-none
                  focus:border-blue-400
                  focus:ring-2
                  focus:ring-blue-400/30
                  focus:shadow-[0_0_30px_rgba(59,130,246,0.15)]
                  transition-all
                  duration-300
                  hover:bg-white/10
                  font-['Inter']
                "
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group/remember">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="
                      w-4
                      h-4
                      accent-cyan-500
                      cursor-pointer
                      rounded
                      border-white/20
                      bg-white/5
                      focus:ring-2
                      focus:ring-cyan-500/50
                      focus:ring-offset-2
                      focus:ring-offset-transparent
                      transition-all
                      duration-300
                    "
                  />
                </div>
                <span className="text-slate-300 text-sm group-hover/remember:text-white transition-colors duration-300 font-['Inter']">
                  Remember Me
                </span>
              </label>

              <button
                type="button"
                className="
                  text-blue-400
                  text-sm
                  hover:text-purple-400
                  hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]
                  transition-all
                  duration-300
                  font-['Inter']
                  hover:scale-105
                  relative
                  group/forgot
                "
              >
                Forgot Password?
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover/forgot:w-full transition-all duration-300" />
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                group/btn
                w-full
                relative
                overflow-hidden
                bg-gradient-to-r
                from-cyan-500
                via-blue-500
                to-purple-500
                hover:from-cyan-600
                hover:via-blue-600
                hover:to-purple-600
                py-3.5
                rounded-xl
                text-white
                font-semibold
                flex
                justify-center
                items-center
                gap-2
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_50px_rgba(34,211,238,0.4)]
                disabled:opacity-70
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                font-['Poppins']
                text-base
              "
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight
                    size={20}
                    className="group-hover/btn:translate-x-1 transition-transform duration-300"
                  />
                </>
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-slate-300 font-['Inter']">
              Don't have an account?
              <Link
                to="/register"
                className="
                  ml-2
                  font-semibold
                  text-blue-400
                  hover:text-purple-400
                  hover:drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]
                  transition-all
                  duration-300
                  relative
                  group/register
                  hover:scale-105
                  inline-block
                "
              >
                Register
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover/register:w-full transition-all duration-300" />
              </Link>
            </p>

          </form>

          {/* Decorative Bottom Elements */}
          <div className="absolute -bottom-4 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-md border border-white/10 animate-float-slow shadow-[0_0_30px_rgba(34,211,238,0.05)]" />
          <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md border border-white/10 animate-float-medium shadow-[0_0_25px_rgba(139,92,246,0.05)]" />
          
          {/* Footer decorative text */}
          <div className="absolute bottom-2 right-4 text-[8px] text-slate-600/50 font-['Inter'] tracking-widest">
            SECURE • ENCRYPTED
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500/60 font-['Inter'] tracking-wide">
            🔒 Your data is protected with end-to-end encryption
          </p>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(15px, -25px) scale(1.05) rotate(5deg); }
          66% { transform: translate(-15px, 20px) scale(0.95) rotate(-5deg); }
        }

        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-20px, 15px) scale(0.95) rotate(-5deg); }
          66% { transform: translate(20px, -15px) scale(1.05) rotate(5deg); }
        }

        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(25px, -35px) scale(1.8); opacity: 0.6; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }

        @keyframes slideUpFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 12s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-slideUpFadeIn {
          animation: slideUpFadeIn 0.8s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }

        /* Input autofill style */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(15, 23, 42, 0.5) inset !important;
          -webkit-text-fill-color: white !important;
        }

        /* Selection color */
        ::selection {
          background: rgba(34, 211, 238, 0.3);
          color: white;
        }
      `}</style>
    </div>
  );
}

export default SignIn;