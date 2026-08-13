import { Routes, Route } from "react-router-dom";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateComplaint from "./pages/CreateComplaint";
import MyComplaints from "./pages/MyComplaints";
import AllComplaints from "./pages/AllComplaints";
import Profile from "./pages/Profile";

import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />

      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <UserDashboard />
          </AuthGuard>
        }
      />

      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AdminDashboard />
          </AuthGuard>
        }
      />

      <Route
        path="/create-complaint"
        element={
          <AuthGuard>
            <CreateComplaint />
          </AuthGuard>
        }
      />

      <Route
        path="/my-complaints"
        element={
          <AuthGuard>
            <MyComplaints />
          </AuthGuard>
        }
      />

      <Route
        path="/all-complaints"
        element={
          <AuthGuard>
            <AllComplaints />
          </AuthGuard>
        }
      />

      <Route
        path="/profile"
        element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        }
      />
    </Routes>
  );
}

export default App;