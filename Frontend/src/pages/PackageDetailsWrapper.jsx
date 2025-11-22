// PackageDetailsWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";   // ✅ Use axiosInstance
import PackageDetails from "./PackageDetails";

export default function PackageDetailsWrapper({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        // ✅ No localhost — axiosInstance auto-adds backend URL from .env
        const { data } = await axiosInstance.get(`/packages/${id}`);
        setPkg(data);
      } catch (err) {
        console.error("Failed to fetch package", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading package details...</p>;

  return <PackageDetails pkg={pkg} onNavigate={navigate} user={user} />;
}
