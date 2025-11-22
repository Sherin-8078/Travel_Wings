// TouristDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star, ExternalLink, Car } from "lucide-react";
import axiosInstance from "../axiosInstance"; // ✅ using axiosInstance

// Backend URL (auto reads from render env)
const SERVER_URL =
  import.meta.env.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://travel-wings-2.onrender.com"; // fallback

// Utility function
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Card Components
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border", className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return <h4 className={cn("leading-none", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return (
    <div className={cn("px-6 [&:last-child]:pb-6", className)} {...props} />
  );
}

// Button
function Button({ className, variant = "default", size = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all";
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90",
    outline: "border bg-white hover:bg-gray-100",
    secondary: "bg-secondary hover:bg-secondary/80",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 px-3",
    lg: "h-10 px-6",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

// Badge
function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-primary text-white",
    secondary: "bg-secondary text-black",
    outline: "border text-black",
  };

  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs", variants[variant], className)} {...props} />
  );
}

// Recommended Packages Image
function PackageImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  const imagePath =
    !error && src
      ? `${SERVER_URL}/uploads/packages/${src.replace(/^.*[\\/]/, "")}`
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <img
      src={imagePath}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

// Fallback image for static destinations
const ERROR_IMG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgi...";

function ImageWithFallback({ src, className }) {
  const [error, setError] = useState(false);

  return error ? (
    <img src={ERROR_IMG} className={className} />
  ) : (
    <img src={src} className={className} onError={() => setError(true)} />
  );
}

// MAIN COMPONENT
export default function TouristDashboard({ user, onNavigate }) {
  const navigate = useNavigate();
  const safeUser = user || { name: "Guest" };

  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [showAllDestinations, setShowAllDestinations] = useState(false);

  // Fetch APPROVED packages only
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axiosInstance.get("/api/packages");
        const approved = data.filter((p) => p.status === "approved");
        setRecommendedPackages(approved);
      } catch (err) {
        console.error("Failed to fetch packages:", err);
      }
    };
    fetchPackages();
  }, []);

  const handlePackageClick = (id) => {
    navigate(`/package-details/${id}`);
  };

  // Featured destinations (static)
  const featuredDestinations = [
    {
      id: 1,
      name: "Alleppey Backwaters",
      image:
        "https://images.unsplash.com/photo-1652805424854-228ba60dd4eb?auto=format&fit=crop&w=1080&q=80",
      description: "Serene backwater houseboat cruise",
      rating: 4.8,
      category: "Backwaters",
    },
    {
      id: 2,
      name: "Munnar Hill Station",
      image:
        "https://images.unsplash.com/photo-1685677260082-dbec4b1303ee?auto=format&fit=crop&w=1080&q=80",
      description: "Tea gardens & mountain climate",
      rating: 4.7,
      category: "Hill Station",
    },
    {
      id: 3,
      name: "Kovalam Beach",
      image:
        "https://images.unsplash.com/photo-1615289139857-99b7eb0702dd?auto=format&fit=crop&w=1080&q=80",
      description: "Golden sands & lighthouse views",
      rating: 4.6,
      category: "Beach",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Welcome */}
        <div className="mb-8">
          <h1>Welcome back, {safeUser.name}!</h1>
          <p className="text-gray-600 mt-2">Plan your next Kerala adventure</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate("/explore")}>
            <CardContent className="p-6 text-center">
              <MapPin className="text-green-600 mx-auto mb-2" size={32} />
              <h3>Explore Places</h3>
              <p className="text-sm text-gray-600">Find attractions</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate("/packages")}>
            <CardContent className="p-6 text-center">
              <Calendar className="text-blue-600 mx-auto mb-2" size={32} />
              <h3>Book Packages</h3>
              <p className="text-sm text-gray-600">Travel deals</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md" onClick={() => onNavigate("food")}>
            <CardContent className="p-6 text-center">
              <Star className="text-orange-600 mx-auto mb-2" size={32} />
              <h3>Food Guide</h3>
              <p className="text-sm text-gray-600">Local cuisine</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md">
            <CardContent className="p-6 text-center">
              <Car className="text-purple-600 mx-auto mb-2" size={32} />
              <h3>Book Uber</h3>
              <p className="text-sm text-gray-600">Transportation</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured + Packages */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Featured Destinations */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2>Featured Destinations</h2>
              <Button variant="outline" onClick={() => setShowAllDestinations(!showAllDestinations)}>
                {showAllDestinations ? "Show Less" : "View All"}
              </Button>
            </div>

            <div className="space-y-4">
              {(showAllDestinations ? featuredDestinations : featuredDestinations.slice(0, 2)).map(
                (d) => (
                  <Card key={d.id} className="overflow-hidden hover:shadow">
                    <div className="flex">
                      <div className="w-32 h-24">
                        <ImageWithFallback src={d.image} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{d.name}</h3>
                          <Badge variant="secondary">{d.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{d.description}</p>
                      </CardContent>
                    </div>
                  </Card>
                )
              )}
            </div>
          </div>

          {/* Recommended Packages */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2>Recommended Packages</h2>
              <Button variant="outline" onClick={() => setShowAllPackages(!showAllPackages)}>
                {showAllPackages ? "Show Less" : "View All"}
              </Button>
            </div>

            <div className="space-y-4">
              {(showAllPackages ? recommendedPackages : recommendedPackages.slice(0, 2)).map(
                (pkg) => (
                  <Card key={pkg._id} className="overflow-hidden hover:shadow cursor-pointer">
                    <div className="h-40">
                      <PackageImage src={pkg.images?.[0]} alt={pkg.title} className="w-full h-full object-cover" />
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{pkg.title}</h3>
                        <span className="font-bold text-green-600">₹{pkg.price}</span>
                      </div>

                      <p className="text-sm text-gray-600">{pkg.duration}</p>
                      <p className="text-sm text-gray-700 mb-3">by {pkg.createdBy?.name}</p>

                      <Button className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handlePackageClick(pkg._id)}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              <MapPin className="inline-block mr-2" />
              Kerala Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Google Maps integration here</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
