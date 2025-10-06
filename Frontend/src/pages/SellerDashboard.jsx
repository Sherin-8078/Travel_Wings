// SellerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Package,
  Users,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

// --------- BACKEND URL ----------
const SERVER_URL = "http://localhost:5000";

// --------- UTILS ----------
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --------- COMPONENTS ----------
const Card = ({ className, ...props }) => (
  <div
    className={cn(
      "bg-white text-gray-900 flex flex-col gap-4 rounded-xl border shadow",
      className
    )}
    {...props}
  />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("px-4 py-2", className)} {...props} />
);

const Button = ({ className, size = "default", ...props }) => {
  const sizeClass = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2";
  return (
    <button
      className={cn(
        "bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center gap-2",
        sizeClass,
        className
      )}
      {...props}
    />
  );
};

const Badge = ({ className, variant = "default", ...props }) => {
  const base =
    "inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium";
  const variantClass =
    variant === "approved"
      ? "bg-green-600 text-white"
      : variant === "pending"
      ? "bg-yellow-500 text-white"
      : variant === "rejected"
      ? "bg-red-500 text-white"
      : "bg-gray-300 text-gray-800";
  return <span className={cn(base, variantClass, className)} {...props} />;
};

// Image component with fallback
const ImageWithFallback = ({ src, alt, className, style, ...rest }) => {
  const [didError, setDidError] = useState(false);
  const ERROR_IMG_SRC = "https://via.placeholder.com/300x200?text=No+Image";

  // Strip any extra path from src and prepend backend path
  const filename = src ? src.replace(/^.*[\\/]/, "") : "";
  const imageSrc =
    !didError && filename ? `${SERVER_URL}/uploads/packages/${filename}` : ERROR_IMG_SRC;

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-gray-100 flex items-center justify-center",
        className
      )}
      style={style}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="absolute top-0 left-0 w-full h-full object-cover"
        onError={() => setDidError(true)}
        {...rest}
      />
    </div>
  );
};

// --------- MAIN COMPONENT ----------
export default function SellerDashboard({ user }) {
  const navigate = useNavigate();
  const [myPackages, setMyPackages] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // --------- API CALLS ---------
  const fetchPackages = async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/packages/seller/${user._id}`
      );
      const normalized = data.map((pkg) => ({
        ...pkg,
        status: pkg.status || "pending",
        bookings: pkg.bookings || 0,
      }));
      setMyPackages(normalized);
    } catch (err) {
      console.error("Failed to fetch packages:", err);
    }
  };

  const fetchBookings = async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/bookings/seller/${user._id}`
      );
      const bookingsArray = data.bookings || data;
      const normalized = bookingsArray.map((b) => ({
        id: b._id,
        customerName: b.tourist?.name || "Unknown",
        packageTitle: b.package?.title || "Package",
        packageId: b.package?._id,
        bookingDate: new Date(b.createdAt).toLocaleDateString(),
        amount: b.totalPrice || 0,
        status: b.status || "pending",
      }));
      normalized.sort(
        (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
      );
      setRecentBookings(normalized);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  const fetchPendingApprovals = async () => {
    if (!user?._id) return;
    try {
      const bookingPending = await axios.get(
        `${SERVER_URL}/api/bookings/seller/${user._id}/pending`
      );
      const pendingBookings = bookingPending.data.bookings.map((b) => ({
        id: b._id,
        title: b.package?.title,
        type: "booking",
        submittedDate: new Date(b.createdAt).toLocaleDateString(),
        tourist: b.tourist?.name,
      }));
      setPendingApprovals(pendingBookings);
    } catch (err) {
      console.error("Failed to fetch pending approvals:", err);
    }
  };

  // --------- CRUD HANDLERS ---------
  const handleApprove = async (id, type) => {
    try {
      if (type === "booking") {
        await axios.patch(`${SERVER_URL}/api/bookings/approve/${id}`);
        setRecentBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
        );
      }
      setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  const handleReject = async (id, type) => {
    try {
      if (type === "booking") {
        await axios.patch(`${SERVER_URL}/api/bookings/reject/${id}`);
        setRecentBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
        );
      }
      setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  // --------- EFFECTS ---------
  useEffect(() => {
    fetchPackages();
    fetchBookings();
    fetchPendingApprovals();
  }, [user]);

  // --------- STATS ---------
const approvedBookings = recentBookings.filter((b) => b.status === "approved");

const totalRevenue = approvedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

const stats = [
  { title: "Total Packages", value: myPackages.length, icon: Package, color: "text-blue-600" },
  { title: "Approved Bookings", value: approvedBookings.length, icon: Users, color: "text-green-600" },
  { title: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-purple-600" },
  { title: "Approved Packages", value: myPackages.filter((p) => p.status === "approved").length, icon: Eye, color: "text-orange-600" },
];

  // --------- RENDER ---------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.name}! Manage your travel packages and bookings.
            </p>
          </div>
          <Button onClick={() => navigate("/add-package")} className="mt-2 md:mt-0">
            <Plus size={16} /> Add New Package
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={stat.color} size={32} />
            </Card>
          ))}
        </div>

        {/* Pending Approvals */}
        <Card className="mb-8">
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
            {pendingApprovals.length === 0 ? (
              <p className="text-gray-500">No pending bookings 🎉</p>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        {item.tourist || item.submittedDate}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(item.id, item.type)}>
                        <CheckCircle size={16} /> Approve
                      </Button>
                      <Button size="sm" className="bg-red-600" onClick={() => handleReject(item.id, item.type)}>
                        <XCircle size={16} /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Packages & Bookings */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Packages */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">My Packages</h2>
              <Button size="sm" className="bg-gray-200 text-gray-700">View All</Button>
            </div>
            <div className="space-y-4">
              {myPackages.length === 0 && (
                <p className="text-center text-gray-500">No packages yet</p>
              )}
              {myPackages.map((pkg) => (
                <Card key={pkg._id} className="flex overflow-hidden gap-4">
                  {/* Image */}
                  <div className="w-32 h-24 flex-shrink-0 rounded overflow-hidden">
                    <ImageWithFallback
                      src={pkg.images?.[0]}
                      alt={pkg.title}
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{pkg.title}</h3>
                      <Badge variant={pkg.status}>{pkg.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pkg.duration}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-600">₹{pkg.price}</span>
                      <span className="text-sm text-gray-600">{pkg.bookings} bookings</span>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-gray-200 text-gray-700"
                        onClick={() => navigate(`/package-details/${pkg._id}`)}
                      >
                        <Eye size={14} /> View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gray-200 text-gray-700"
                        onClick={() => navigate(`/edit-package/${pkg._id}`)}
                      >
                        <Edit size={14} /> Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-600 text-white"
                        onClick={() => handleReject(pkg._id, "package")}
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Bookings</h2>
              <Button size="sm" className="bg-gray-200 text-gray-700">View All</Button>
            </div>
            <div className="space-y-4">
              {recentBookings.length === 0 && (
                <p className="text-center text-gray-500">No bookings yet</p>
              )}
              {recentBookings.map((b) => (
                <Card key={b.id} className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-medium">{b.packageTitle}</p>
                    <p className="text-sm text-gray-500">{b.customerName}</p>
                    <p className="text-sm text-gray-400">{b.bookingDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={b.status}>{b.status}</Badge>
                    <span className="font-semibold text-green-600">₹{b.amount}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
