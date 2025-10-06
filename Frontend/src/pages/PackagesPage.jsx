// PackagesPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import { FilterAlt } from "@mui/icons-material";

const SERVER_URL = "http://localhost:5000"; // Backend URL

export default function PackagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [packages, setPackages] = useState([]);

  const navigate = useNavigate();

  const categories = [
    "all",
    "Backwaters",
    "Hill Station",
    "Beach",
    "Cultural",
    "Adventure",
    "Wildlife",
  ];
  const durations = ["all", "1-2 Days", "3-4 Days", "5-7 Days", "7+ Days"];
  const priceRanges = [
    "all",
    "Under ₹10,000",
    "₹10,000 - ₹25,000",
    "₹25,000 - ₹50,000",
    "Above ₹50,000",
  ];

  // Fetch only approved packages
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/api/packages`)
      .then((res) => {
        const approvedPackages = res.data.filter(
          (pkg) => pkg.status === "approved"
        );
        setPackages(approvedPackages);
      })
      .catch((err) => console.error("Error fetching packages:", err));
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.highlights?.some((h) =>
        h.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || pkg.category === selectedCategory;

    const matchesDuration =
      selectedDuration === "all" ||
      (selectedDuration === "1-2 Days" &&
        (pkg.duration.includes("1 Day") || pkg.duration.includes("2 Days"))) ||
      (selectedDuration === "3-4 Days" &&
        (pkg.duration.includes("3 Days") || pkg.duration.includes("4 Days"))) ||
      (selectedDuration === "5-7 Days" &&
        (pkg.duration.includes("5 Days") ||
          pkg.duration.includes("6 Days") ||
          pkg.duration.includes("7 Days"))) ||
      (selectedDuration === "7+ Days" && pkg.duration.includes("7 Days"));

    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "Under ₹10,000" && pkg.price < 10000) ||
      (priceRange === "₹10,000 - ₹25,000" &&
        pkg.price >= 10000 &&
        pkg.price <= 25000) ||
      (priceRange === "₹25,000 - ₹50,000" &&
        pkg.price > 25000 &&
        pkg.price <= 50000) ||
      (priceRange === "Above ₹50,000" && pkg.price > 50000);

    return matchesSearch && matchesCategory && matchesDuration && matchesPrice;
  });

  const handlePackageClick = (packageId) => {
    navigate(`/package-details/${packageId}`);
  };

  // Image component with fallback
  const ImageWithFallback = ({ src, alt, sx }) => {
    const [didError, setDidError] = useState(false);
    const ERROR_IMG_SRC =
      "https://via.placeholder.com/300x200?text=No+Image";

    const imageSrc =
      !didError && src
        ? `${SERVER_URL}/uploads/packages/${src.replace(/^.*[\\/]/, "")}`
        : ERROR_IMG_SRC;

    return (
      <CardMedia
        component="img"
        sx={sx}
        image={imageSrc}
        alt={alt}
        onError={() => setDidError(true)}
      />
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 4, backgroundColor: "#f9fafb" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700}>
            Kerala Travel Packages
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Discover curated experiences by Sellers & Guides
          </Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 6 }}>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />

              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Duration</InputLabel>
                <Select
                  value={selectedDuration}
                  label="Duration"
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  {durations.map((duration) => (
                    <MenuItem key={duration} value={duration}>
                      {duration === "all" ? "All Durations" : duration}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={priceRange}
                  label="Price Range"
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  {priceRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      {range === "all" ? "All Prices" : range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<FilterAlt />}
                sx={{ height: 40 }}
              >
                More Filters
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Packages List */}
        <Box>
          <Typography variant="h5" mb={3}>
            All Packages
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {filteredPackages.map((pkg) => (
              <Card
                key={pkg._id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <ImageWithFallback
                  src={pkg.images?.[0]}
                  alt={pkg.title}
                  sx={{
                    width: { xs: "100%", md: 300 },
                    height: { xs: 200, md: "100%" },
                    objectFit: "cover",
                  }}
                />

                <CardContent
                  sx={{
                    flex: 1,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6">{pkg.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      by {pkg.createdBy?.name || "Unknown"} (
                      {pkg.createdBy?.role || "Seller/Guide"})
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {pkg.duration} • ₹{pkg.price}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handlePackageClick(pkg._id)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={() => handlePackageClick(pkg._id)}
                    >
                      Book Now
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
