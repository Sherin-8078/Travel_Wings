// BookingsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Phone,
  Mail,
  Download
} from "lucide-react";

import axiosInstance from "../axiosInstance";  // ✅ USE axiosInstance here

// ---------- UTILS ----------
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------- UI COMPONENTS ----------
const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      "bg-white text-gray-900 flex flex-col gap-6 rounded-xl border shadow",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn("px-6 py-4", className)} {...props}>
    {children}
  </div>
);

const Button = ({
  className,
  variant = "default",
  size = "default",
  children,
  onClick,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:pointer-events-none outline-none";
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border bg-white text-gray-900 hover:bg-gray-100",
    ghost: "hover:bg-gray-100"
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-10 px-6 text-base"
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, status }) => {
  const color =
    status === "approved"
      ? "bg-green-600 text-white"
      : status === "pending"
      ? "bg-yellow-500 text-white"
      : status === "rejected" || status === "cancelled"
      ? "bg-red-600 text-white"
      : "bg-gray-400 text-white";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium",
        color
      )}
    >
      {children}
    </span>
  );
};

// ---------- MAIN COMPONENT ----------
export default function BookingsPage({ user }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = user || { role: "tourist", name: "Guest", _id: "" };

  // ---------- FETCH BOOKINGS ----------
  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser._id) {
        setLoading(false);
        return;
      }

      try {
        const endpoint =
          currentUser.role === "tourist"
            ? `/bookings/tourist/${currentUser._id}`   // ✅ NO localhost
            : `/bookings/seller/${currentUser._id}`;

        const { data } = await axiosInstance.get(endpoint);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        alert("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  // ---------- APPROVE / REJECT ----------
  const approveBooking = async (bookingId) => {
    try {
      const { data } = await axiosInstance.patch(`/bookings/approve/${bookingId}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? data.booking : b))
      );
      alert("Booking approved!");
    } catch (err) {
      console.error("Approve failed:", err);
      alert("Failed to approve booking.");
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      const { data } = await axiosInstance.patch(`/bookings/reject/${bookingId}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? data.booking : b))
      );
      alert("Booking rejected!");
    } catch (err) {
      console.error("Reject failed:", err);
      alert("Failed to reject booking.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading bookings...</p>
    );

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            {currentUser.role === "tourist"
              ? "My Bookings"
              : "Customer Bookings"}
          </h1>
          <p className="text-gray-600 mt-2">
            {currentUser.role === "tourist"
              ? "Track and manage your travel bookings."
              : "Manage customer bookings and travel arrangements."}
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <CardContent>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.package.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {currentUser.role === "tourist"
                          ? `by ${booking.seller.name}`
                          : `Customer: ${booking.tourist.name}`}
                      </p>
                    </div>
                    <Badge status={booking.status}>{booking.status}</Badge>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">Booked On</p>
                        <p className="font-medium">
                          {new Date(
                            booking.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">Travel Date</p>
                        <p className="font-medium">
                          {new Date(
                            booking.travelDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="mr-2 text-gray-400" size={16} />
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-medium">{booking.guests} Adults</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-green-600">
                        ₹{booking.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          navigate(`/booking/${booking._id}`)
                        }
                      >
                        View Details
                      </Button>

                      {booking.status === "approved" && (
                        <Button size="sm" variant="outline">
                          <Download className="mr-1" size={14} /> Voucher
                        </Button>
                      )}

                      {currentUser.role === "seller" &&
                        booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() =>
                                approveBooking(booking._id)
                              }
                            >
                              Confirm Booking
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() =>
                                rejectBooking(booking._id)
                              }
                            >
                              Reject Booking
                            </Button>
                          </>
                        )}
                    </div>

                    {currentUser.role === "seller" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="mr-1" size={14} /> Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="mr-1" size={14} /> Email
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No bookings found.</p>
            <Button
              onClick={() =>
                navigate(
                  currentUser.role === "tourist"
                    ? "/packages"
                    : "/seller-dashboard"
                )
              }
            >
              {currentUser.role === "tourist"
                ? "Browse Packages"
                : "Back to Dashboard"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
