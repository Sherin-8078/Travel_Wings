// ProfilePage.jsx
import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from "lucide-react";

// ---------- UTILS ----------
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ---------- UI COMPONENTS ----------
function Card({ className, children, ...props }) {
  return (
    <div className={cn("bg-white text-gray-900 flex flex-col gap-6 rounded-xl border", className)} {...props}>
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
    <button className={cn(base, variants[variant], sizes[size], className)} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-green-100 text-green-800 px-2 py-0.5 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "border rounded-md px-3 py-1 w-full text-sm outline-none focus:ring-2 focus:ring-green-500",
        className
      )}
      {...props}
    />
  );
}

function Label({ className, children, ...props }) {
  return (
    <label className={cn("block text-sm font-medium mb-1", className)} {...props}>
      {children}
    </label>
  );
}

function Tabs({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  );
}

function TabsList({ className, children, ...props }) {
  return (
    <div className={cn("inline-flex h-9 rounded-xl bg-gray-200 p-[3px]", className)} {...props}>
      {children}
    </div>
  );
}

function TabsTrigger({ className, value, activeValue, onClick, children, ...props }) {
  const isActive = value === activeValue;
  return (
    <button
      className={cn(
        "flex-1 px-3 py-1 rounded-xl text-sm font-medium transition",
        isActive ? "bg-white text-green-700" : "text-gray-600 hover:bg-gray-100",
        className
      )}
      onClick={() => onClick(value)}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({ className, active, value, children, ...props }) {
  return active === value ? <div className={cn(className)} {...props}>{children}</div> : null;
}

// ---------- MAIN COMPONENT ----------
export function ProfilePage({ user, onNavigate, onUpdateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(user.role === "tourist" ? "bookings" : "packages");
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    location: "Kerala, India",
    bio: "Travel enthusiast exploring the beauty of Kerala",
  });

  const recentBookings = [
    { id: 1, packageTitle: "Kerala Complete Circuit", bookingDate: "2025-01-15", travelDate: "2025-02-15", status: "confirmed", amount: "₹25,000" },
    { id: 2, packageTitle: "Backwater Bliss", bookingDate: "2024-12-20", travelDate: "2025-01-05", status: "completed", amount: "₹12,000" },
  ];

  const sellerPackages = [
    { id: 1, title: "Kerala Complete Circuit", bookings: 8, status: "active", price: "₹25,000" },
    { id: 2, title: "Backwater Bliss", bookings: 12, status: "active", price: "₹12,000" },
  ];

  const handleSave = () => {
    onUpdateUser({ name: formData.name, email: formData.email, role: user.role, phone: formData.phone });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ name: user.name, email: user.email, phone: user.phone || "", location: "Kerala, India", bio: "Travel enthusiast exploring the beauty of Kerala" });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-green-600" size={40} />
                </div>
                {!isEditing ? (
                  <>
                    <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
                    <p className="text-gray-600 mb-2">{user.email}</p>
                    <Badge className={user.role === "tourist" ? "bg-blue-600" : "bg-green-600"}>
                      {user.role === "tourist" ? "Tourist" : "Travel Agent"}
                    </Badge>
                    <div className="mt-6 space-y-3 text-sm text-left">
                      <div className="flex items-center">
                        <Phone className="mr-2 text-gray-400" size={16} />
                        <span>{user.phone || "Phone not added"}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 text-gray-400" size={16} />
                        <span>{formData.location}</span>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(true)} className="mt-6 w-full" variant="outline">
                      <Edit className="mr-2" size={16} /> Edit Profile
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4 text-left">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Save className="mr-2" size={16} /> Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="flex-1">
                        <X className="mr-2" size={16} /> Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs className="w-full">
              <TabsList>
                {user.role === "tourist" ? (
                  <>
                    <TabsTrigger value="bookings" activeValue={activeTab} onClick={setActiveTab}>My Bookings</TabsTrigger>
                    <TabsTrigger value="wishlist" activeValue={activeTab} onClick={setActiveTab}>Wishlist</TabsTrigger>
                    <TabsTrigger value="settings" activeValue={activeTab} onClick={setActiveTab}>Settings</TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger value="packages" activeValue={activeTab} onClick={setActiveTab}>My Packages</TabsTrigger>
                    <TabsTrigger value="bookings" activeValue={activeTab} onClick={setActiveTab}>Bookings</TabsTrigger>
                    <TabsTrigger value="settings" activeValue={activeTab} onClick={setActiveTab}>Settings</TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* Tabs Content */}
              <TabsContent value="bookings" active={activeTab}>
                {user.role === "tourist" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>My Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentBookings.length > 0 ? (
                        <div className="space-y-4">
                          {recentBookings.map((booking) => (
                            <div key={booking.id} className="border rounded-lg p-4">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-semibold">{booking.packageTitle}</h4>
                                <Badge className={booking.status === "confirmed" ? "bg-green-600" : "bg-blue-600"}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="mr-2" size={14} /> Booked: {booking.bookingDate}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="mr-2" size={14} /> Travel: {booking.travelDate}
                                </div>
                                <div className="flex items-center">
                                  <span className="font-semibold text-green-600">{booking.amount}</span>
                                </div>
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button size="sm" variant="outline">View Details</Button>
                                {booking.status === "confirmed" && <Button size="sm" variant="outline">Download Voucher</Button>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">No bookings yet</p>
                          <Button onClick={() => onNavigate("packages")}>Browse Packages</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : null}
              </TabsContent>

              <TabsContent value="packages" active={activeTab}>
                {user.role === "seller" ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>My Packages</CardTitle>
                        <Button onClick={() => onNavigate("add-package")}>Add New Package</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {sellerPackages.length > 0 ? (
                        <div className="space-y-4">
                          {sellerPackages.map((pkg) => (
                            <div key={pkg.id} className="border rounded-lg p-4">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-semibold">{pkg.title}</h4>
                                <Badge className="bg-green-600">{pkg.status}</Badge>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>{pkg.bookings} bookings</span>
                                <span className="font-semibold text-green-600">{pkg.price}</span>
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="outline">View</Button>
                                <Button size="sm" variant="outline">Analytics</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">No packages created yet</p>
                          <Button onClick={() => onNavigate("add-package")}>Create Your First Package</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : null}
              </TabsContent>

              <TabsContent value="wishlist" active={activeTab}>
                {user.role === "tourist" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>My Wishlist</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                      <Button onClick={() => onNavigate("packages")}>Browse Packages</Button>
                    </CardContent>
                  </Card>
                ) : null}
              </TabsContent>

              <TabsContent value="settings" active={activeTab}>
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center"><input type="checkbox" className="mr-2" defaultChecked /> Email notifications for bookings</label>
                        <label className="flex items-center"><input type="checkbox" className="mr-2" defaultChecked /> SMS alerts for travel updates</label>
                        <label className="flex items-center"><input type="checkbox" className="mr-2" /> Marketing emails</label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Privacy</h4>
                      <div className="space-y-2">
                        <label className="flex items-center"><input type="checkbox" className="mr-2" defaultChecked /> Make profile visible to other users</label>
                        <label className="flex items-center"><input type="checkbox" className="mr-2" /> Show travel history</label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Account Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">Change Password</Button>
                        <Button variant="outline" className="w-full">Download My Data</Button>
                        <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
