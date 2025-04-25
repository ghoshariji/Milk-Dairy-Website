import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import API from "../api";
import Loader from "../components/Loader/Loader";

const Authentication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // default to true so loader shows while checking

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No token found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await API.get("/api/auth/security/validate-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          toast.error("Invalid token. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Session expired or token invalid.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-60 backdrop-blur-md">
          <Loader />
        </div>
      )}
    </>
  );
};

export default Authentication;
