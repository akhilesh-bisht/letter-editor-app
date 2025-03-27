import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import { Suspense } from "react";
import LetterEditor from "./Letter-Editor";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("authToken");
    navigate("/signup");
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Letter Editor</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white p-6 rounded-lg shadow-lg text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Welcome, {user?.displayName || "User"}!
        </h2>
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-20 h-20 rounded-full mx-auto my-4"
          />
        )}
        <p className="text-gray-600">{user?.email}</p>
      </div>

      {/* Letter Editor with Suspense */}
      <Suspense
        fallback={
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <LetterEditor />
      </Suspense>
    </main>
  );
}
