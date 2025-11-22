// BookingConfirmationPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { CheckCircle, Download, Calendar, Users, MapPin, Phone, Mail } from "lucide-react";

// ---------- UTILS ----------
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------- UI COMPONENTS ----------
function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-white text-gray-900 flex flex-col gap-6 rounded-xl border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("px-6 pt-6 border-b pb-6", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }) {
  return (
    <h4 className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </h4>
  );
}

function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("px-6 pb-6", className)} {...props}>
      {children}
    </div>
  );
}

function Button({ className, variant = "default", size = "default", children, onClick, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none outline-none";
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border bg-white text-gray-900 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-10 px-6 text-base",
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
}

function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

// ---------- MAIN COMPONENT ----------
export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axiosInstance.get(`/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch booking details.");
        navigate("/my-bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  if (loading) return <p className="text-center mt-10">Loading booking details...</p>;
  if (!booking) return null;

  const pkg = booking.package;
  const tourist = booking.tourist;
  const seller = booking.seller;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Your adventure is all set. We'll send you a confirmation email shortly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Booking Summary
                  <Badge>{booking.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-semibold">{booking._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <p className="font-semibold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pkg ? (
                  <>
                    <h3 className="font-semibold text-lg">{pkg.title}</h3>
                    <p className="text-gray-600">Duration: {pkg.duration}</p>
                    <p className="text-gray-600">Location: {pkg.location}</p>
                  </>
                ) : (
                  <p className="text-gray-500">Package details not available</p>
                )}

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-gray-400" size={16} />
                    <div>
                      <p className="text-gray-600">Travel Date</p>
                      <p className="font-medium">{new Date(booking.travelDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 text-gray-400" size={16} />
                    <div>
                      <p className="text-gray-600">Guests</p>
                      <p className="font-medium">{booking.guests} Adults</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 text-gray-400" size={16} />
                    <div>
                      <p className="text-gray-600">Total Price</p>
                      <p className="font-medium">₹{booking.totalPrice}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Tourist</h4>
                    <p>{tourist?.name}</p>
                    <p className="flex items-center"><Mail className="mr-2" size={14} />{tourist?.email}</p>
                    <p className="flex items-center"><Phone className="mr-2" size={14} />{tourist?.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Travel Agent</h4>
                    <p>{seller?.name}</p>
                    <p className="flex items-center"><Mail className="mr-2" size={14} />{seller?.email}</p>
                    <p className="flex items-center"><Phone className="mr-2" size={14} />{seller?.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full"><Download size={16} /> Download Voucher</Button>
                <Button variant="outline" className="w-full"><Mail size={16} /> Email Confirmation</Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/bookings")}>
                  View All Bookings
                </Button>
                <Button variant="ghost" className="w-full text-green-600" onClick={() => navigate("/packages")}>
                  Book Another Trip
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
