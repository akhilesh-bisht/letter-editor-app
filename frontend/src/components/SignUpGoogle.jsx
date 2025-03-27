import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { FaGoogle } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function SignUpGoogle() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      //  Store token
      localStorage.setItem("authToken", token);
      toast.success("Google Signup Successful! 🚀");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <ToastContainer />
      <button
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 cursor-pointer border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition"
      >
        <FaGoogle className="text-red-500" /> Sign up with Google
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default SignUpGoogle;
