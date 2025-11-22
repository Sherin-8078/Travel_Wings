import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  BarChart3,
  Settings,
  UserCheck,
  FileText,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../axiosInstance";

// ---------- UTILS ----------
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------- CARD COMPONENTS ----------
function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "bg-white text-gray-900 flex flex-col gap-6 rounded-xl border shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn("px-6 pt-6 grid auto-rows-min gap-1.5", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <h4 className={cn("leading-none text-lg font-semibold", className)} {...props} />
  );
}

function CardContent({ className, ...props }) {
  return <div className={cn("px-6 [&:last-child]:pb-6", className)} {...props} />;
}

// ---------- BUTTON ----------
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
  const Comp = asChild ? "span" : "button";
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border bg-white text-gray-900 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizeClasses = {
    default: "h-9 px-4",
    sm: "h-8 px-3",
    lg: "h-10 px-6",
  };
  return (
    <Comp className={cn(base, variantClasses[variant], sizeClasses[size], className)} {...props} />
  );
}

// ---------- BADGE ----------
function Badge({ className, variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium";
  const variantClasses = {
    default: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    error: "bg-red-100 text-red-800",
  };
  return (
    <span className={cn(base, variantClasses[variant] || variantClasses.default, className)} {...props} />
  );
}

// ---------- IMAGE WITH FALLBACK ----------
const ERROR_IMG_SRC = "https://via.placeholder.com/300x200?text=No+Image";

function ImageWithFallback({ src, alt, className, style, ...props }) {
  const [didError, setDidError] = useState(false);

  if (didError || !src) {
    return (
      <img
        src={ERROR_IMG_SRC}
        alt="No Image"
        className={cn("object-cover", className)}
        style={style}
        {...props}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      style={style}
      onError={() => setDidError(true)}
      {...props}
    />
  );
}

// ---------- ADMIN DASHBOARD ----------
export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [topPackages, setTopPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // --- Fetch Dashboard Data ---
  const fetchAdminData = async () => {
    try {
      const [statsRes, approvalsRes, topRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/admin/pending-approvals"),
        axiosInstance.get("/admin/top-packages"),
      ]);

      setStats(statsRes.data);

      const approvals = [
        ...approvalsRes.data.packages.map((p) => ({
          id: p._id,
          type: "package",
          title: p.title,
          seller: p.createdBy?.name || "Unknown",
          submittedDate: new Date(p.createdAt).toLocaleDateString(),
        })),
        ...approvalsRes.data.sellers.map((s) => ({
          id: s._id,
          type: "seller",
          title: s.name,
          email: s.email,
          submittedDate: new Date(s.createdAt).toLocaleDateString(),
        })),
      ];

      setPendingApprovals(approvals);

      const formattedTop = topRes.data.map((pkg) => {
        const fileName = pkg.image ? pkg.image.replace(/^.*[\\/]/, "") : null;
        return {
          ...pkg,
          image: fileName ? `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/uploads/packages/${fileName}` : null,
        };
      });

      setTopPackages(formattedTop);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // --- Approve Package ---
  const handleApprove = async (id) => {
    try {
      await axiosInstance.put(`/admin/approve-package/${id}`);
      alert("✅ Package approved!");
      fetchAdminData();
    } catch (err) {
      console.error("Error approving package:", err);
      alert("❌ Failed to approve package");
    }
  };

  // --- Reject Package ---
  const handleReject = async (id) => {
    try {
      await axiosInstance.put(`/admin/reject-package/${id}`);
      alert("🚫 Package rejected!");
      fetchAdminData();
    } catch (err) {
      console.error("Error rejecting package:", err);
      alert("❌ Failed to reject package");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  if (!stats) return <p className="p-6 text-red-500">Failed to load dashboard data.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || "Admin"}! Monitor and manage the platform.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <Users className="text-blue-600 mb-2" size={32} />
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Package className="text-green-600 mb-2" size={32} />
              <p className="text-sm text-gray-600">Active Packages</p>
              <p className="text-2xl font-bold">{stats.activePackages}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <DollarSign className="text-purple-600 mb-2" size={32} />
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <TrendingUp className="text-orange-600 mb-2" size={32} />
              <p className="text-sm text-gray-600">Sellers</p>
              <p className="text-2xl font-bold">{stats.sellers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-6 gap-4">
              <Button className="h-16 flex flex-col" onClick={() => navigate("/users")}>
                <UserCheck className="mb-1" size={20} /> Manage Users
              </Button>

              <Button className="h-16 flex flex-col">
                <Package className="mb-1" size={20} /> Review Packages
              </Button>

              <Button className="h-16 flex flex-col">
                <BarChart3 className="mb-1" size={20} /> Analytics
              </Button>

              <Button className="h-16 flex flex-col">
                <FileText className="mb-1" size={20} /> Reports
              </Button>

              <Button className="h-16 flex flex-col">
                <Settings className="mb-1" size={20} /> Settings
              </Button>

              <Button className="h-16 flex flex-col">
                <MapPin className="mb-1" size={20} /> Destinations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <p className="text-gray-500">No pending approvals 🎉</p>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.seller || item.email} • {item.submittedDate}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {item.type === "package" && (
                        <>
                          <Button variant="default" onClick={() => handleApprove(item.id)}>
                            <CheckCircle size={16} /> Approve
                          </Button>

                          <Button variant="destructive" onClick={() => handleReject(item.id)}>
                            <XCircle size={16} /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Packages */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Performing Packages</CardTitle>
          </CardHeader>
          <CardContent>
            {topPackages.length === 0 ? (
              <p className="text-gray-500">No top packages found.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {topPackages.map((pkg) => (
                  <Card key={pkg._id}>
                    <ImageWithFallback
                      src={pkg.image}
                      alt={pkg.title}
                      className="rounded-t-lg w-full h-40"
                    />

                    <CardContent>
                      <p className="font-medium">{pkg.title}</p>
                      <p className="text-sm text-gray-500">{pkg.sellerName}</p>

                      <p className="text-sm text-gray-600 mt-1">
                        {pkg.bookings} bookings • ₹{pkg.revenue}
                      </p>

                      <Badge className="mt-2">{pkg.rating} ★</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
