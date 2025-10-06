import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Star, ExternalLink, Car } from "lucide-react";
import axios from "axios";

// Backend URL
const SERVER_URL = "http://localhost:5000";

// Utility function
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Card components
function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return <h4 data-slot="card-title" className={cn("leading-none", className)} {...props} />;
}

function CardContent({ className, ...props }) {
  return (
    <div data-slot="card-content" className={cn("px-6 [&:last-child]:pb-6", className)} {...props} />
  );
}

// Button
function Button({ className, variant = "default", size = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-white hover:bg-destructive/90",
    outline:
      "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3",
    lg: "h-10 rounded-md px-6",
    icon: "size-9 rounded-md",
  };

  return (
    <button
      data-slot="button"
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

// Badge
function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-white",
    outline: "text-foreground border",
  };

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

// Image with fallback for recommended packages
function PackageImage({ src, alt, className, style, ...rest }) {
  const [didError, setDidError] = useState(false);

  const imageSrc =
    !didError && src
      ? `${SERVER_URL}/uploads/packages/${src.replace(/^.*[\\/]/, "")}`
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  );
}

// Image fallback for static images (featured destinations)
const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

function ImageWithFallback({ src, alt, className, style, ...rest }) {
  const [didError, setDidError] = useState(false);

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  );
}

// Main Component
export default function TouristDashboard({ user, onNavigate }) {
  const safeUser = user || { name: "Guest", email: "", role: "tourist" };
  const navigate = useNavigate();

  const [recommendedPackages, setRecommendedPackages] = useState([]);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [showAllDestinations, setShowAllDestinations] = useState(false);

  // Fetch only approved packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/packages`);
        const approvedPackages = data.filter((pkg) => pkg.status === "approved");
        setRecommendedPackages(approvedPackages);
      } catch (error) {
        console.error("Failed to fetch packages", error);
      }
    };
    fetchPackages();
  }, []);

  // Featured destinations (static)
  const featuredDestinations = [
    {
      id: 1,
      name: "Alleppey Backwaters",
      image:
        "https://images.unsplash.com/photo-1652805424854-228ba60dd4eb?auto=format&fit=crop&w=1080&q=80",
      description: "Experience serene houseboat cruises through Kerala's famous backwaters",
      rating: 4.8,
      category: "Backwaters",
    },
    {
      id: 2,
      name: "Munnar Hill Station",
      image:
        "https://images.unsplash.com/photo-1685677260082-dbec4b1303ee?auto=format&fit=crop&w=1080&q=80",
      description: "Tea gardens, cool climate, and breathtaking mountain views",
      rating: 4.7,
      category: "Hill Station",
    },
    {
      id: 3,
      name: "Kovalam Beaches",
      image:
        "https://images.unsplash.com/photo-1615289139857-99b7eb0702dd?auto=format&fit=crop&w=1080&q=80",
      description: "Golden sands, lighthouse views, and perfect sunsets",
      rating: 4.6,
      category: "Beach",
    },
  ];

  const handlePackageClick = (packageId) => {
    navigate(`/package-details/${packageId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1>Welcome back, {safeUser.name}!</h1>
          <p className="text-gray-600 mt-2">
            Discover new destinations and plan your perfect Kerala adventure
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate("/explore")}>
            <CardContent className="p-6 text-center">
              <MapPin className="text-green-600 mx-auto mb-2" size={32} />
              <h3>Explore Places</h3>
              <p className="text-sm text-gray-600">Discover destinations</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md" onClick={() => navigate("/packages")}>
            <CardContent className="p-6 text-center">
              <Calendar className="text-blue-600 mx-auto mb-2" size={32} />
              <h3>Book Packages</h3>
              <p className="text-sm text-gray-600">Find travel deals</p>
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

        {/* Featured Destinations & Recommended Packages */}
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
                (destination) => (
                  <Card
                    key={destination.id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex">
                      <div className="w-32 h-24 flex-shrink-0">
                        <ImageWithFallback
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{destination.name}</h3>
                          <Badge variant="secondary">{destination.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{destination.description}</p>
                        <div className="flex items-center">
                          <Star className="text-yellow-500 mr-1" size={16} />
                          <span className="text-sm">{destination.rating}</span>
                        </div>
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
                  <Card
                    key={pkg._id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="h-40">
                      <PackageImage
                        src={pkg.images?.[0]}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{pkg.title}</h3>
                        <span className="font-bold text-green-600">₹{pkg.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pkg.duration}</p>
                      <p className="text-sm text-gray-700 mb-3">
                        by {pkg.createdBy?.name || "Tour Operator"}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pkg.includes?.map((item, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handlePackageClick(pkg._id)}
                      >
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
            <CardTitle className="flex items-center">
              <MapPin className="mr-2" />
              Kerala Map View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="text-gray-400 mx-auto mb-2" size={48} />
                <p className="text-gray-600">Interactive Google Maps integration</p>
                <Button variant="outline" className="mt-2">
                  <ExternalLink className="mr-2" size={16} />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
