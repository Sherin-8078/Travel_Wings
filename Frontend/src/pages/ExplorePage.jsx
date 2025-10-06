import React, { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import StarIcon from "@mui/icons-material/Star";
import FilterListIcon from "@mui/icons-material/FilterList";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ExplorePage({ onNavigate }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const districts = [
    "all","Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha",
    "Kottayam","Idukki","Ernakulam","Thrissur","Palakkad",
    "Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod"
  ];

  const categories = [
    "all","Beach","Backwaters","Hill Station","Temple","Wildlife",
    "Heritage","Adventure","Waterfall","Cultural"
  ];

  const attractions = [
    {
      id: 1,
      name: "Alleppey Backwaters",
      district: "Alappuzha",
      category: "Backwaters",
      description:
        "Experience the serene beauty of Kerala's famous backwaters with traditional houseboat cruises through palm-fringed waterways.",
      image:
        "https://images.unsplash.com/photo-1652805424854-228ba60dd4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBob3VzZWJvYXQlMjB0b3VyaXNtfGVufDF8fHx8MTc1ODY1MTg2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.8,
      reviews: 1245,
    },
    {
      id: 2,
      name: "Munnar Tea Gardens",
      district: "Idukki",
      category: "Hill Station",
      description:
        "Rolling hills covered with lush tea plantations, cool climate, and breathtaking mountain views make Munnar a perfect getaway.",
      image:
        "https://images.unsplash.com/photo-1685677260082-dbec4b1303ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhLZXJhbGElMjB0ZW1wbGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU4NjUxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.7,
      reviews: 986,
    },
    {
      id: 3,
      name: "Kovalam Beach",
      district: "Thiruvananthapuram",
      category: "Beach",
      description:
        "Golden sandy beaches with coconut palm groves, lighthouse views, and perfect sunset spots for relaxation.",
      image:
        "https://images.unsplash.com/photo-1615289139857-99b7eb0702dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwkfHxLZXJhbGElMjBiZWFjaCUyMHN1bnNldHxlbnwxfHx8fDE3NTg2NTE4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.6,
      reviews: 756,
    },
    {
      id: 4,
      name: "Kochi Fort Area",
      district: "Ernakulam",
      category: "Heritage",
      description:
        "Historic port city with colonial architecture, Chinese fishing nets, spice markets, and vibrant cultural heritage.",
      image:
        "https://images.unsplash.com/photo-1723158694712-d528f378577a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBzcGljZXMlMjBtYXJrZXR8ZW58MXx8fHwxNzU4NjUxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.5,
      reviews: 632,
    },
    {
      id: 5,
      name: "Guruvayur Temple",
      district: "Thrissur",
      category: "Temple",
      description:
        "One of the most sacred temples in Kerala, famous for its architectural beauty and spiritual significance.",
      image:
        "https://images.unsplash.com/photo-1685677260082-dbec4b1303ee?crop=entropy&cs=tinysrgb&fit=max&fm.jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjB0ZW1wbGUlMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzU4NjUxODYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.9,
      reviews: 543,
    },
    {
      id: 6,
      name: "Wayanad Wildlife Sanctuary",
      district: "Wayanad",
      category: "Wildlife",
      description:
        "Rich biodiversity with elephants, tigers, and exotic birds in their natural habitat amidst dense forests.",
      image:
        "https://images.unsplash.com/photo-1685023620523-9c726f2c499b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLZXJhbGElMjBiYWNrd2F0ZXJzMjBzY2VuaWN8ZW58MXx8fHwxNzU4NjUxODYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.4,
      reviews: 389,
    },
  ];

  const filteredAttractions = attractions.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict =
      selectedDistrict === "all" || a.district === selectedDistrict;
    const matchesCategory =
      selectedCategory === "all" || a.category === selectedCategory;
    return matchesSearch && matchesDistrict && matchesCategory;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Explore Kerala
          </Typography>
          <Typography color="text.secondary" mt={1}>
            Discover the most beautiful destinations in God's Own Country
          </Typography>
        </Box>

        {/* Search & Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" flexWrap="wrap" gap={2}>
              <TextField
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "gray" }} />
                  ),
                }}
                variant="outlined"
                size="small"
                sx={{ flex: "1 1 200px" }}
              />

              <Select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                size="small"
                sx={{ flex: "1 1 200px" }}
              >
                {districts.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d === "all" ? "All Districts" : d}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                size="small"
                sx={{ flex: "1 1 200px" }}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c === "all" ? "All Categories" : c}
                  </MenuItem>
                ))}
              </Select>

              <Button
                variant="outlined"
                startIcon={<PlaceIcon />}
                onClick={() => alert("Map view")}
                sx={{ flex: "1 1 200px" }}
              >
                Map View
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Results Count */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography color="text.secondary">
            Showing {filteredAttractions.length} destinations
          </Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<FilterListIcon />}
          >
            More Filters
          </Button>
        </Box>

        {/* Attractions Flex Layout */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            mb: 4,
          }}
        >
          {filteredAttractions.map((a) => (
            <Card
              key={a.id}
              sx={{
                flex: "1 1 calc(33.333% - 24px)", // 3 cards in a row
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                "&:hover": { boxShadow: 6 },
                position: "relative",
                minWidth: 280,
              }}
            >
              {/* Image */}
              <Box
                component="img"
                src={a.image}
                alt={a.name}
                sx={{
                  height: 200,
                  width: "100%",
                  objectFit: "cover",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
                }}
              />

              {/* Category Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  boxShadow: 2,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {a.category}
              </Box>

              {/* Card Content */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  p: 2.5,
                }}
              >
                {/* Title + Rating */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {a.name}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <StarIcon
                      sx={{ color: "#FBBF24", mr: 0.5, fontSize: 18 }}
                    />
                    <Typography variant="body2">{a.rating}</Typography>
                  </Box>
                </Box>

                {/* District */}
                <Box
                  display="flex"
                  alignItems="center"
                  color="text.secondary"
                  mb={1}
                >
                  <PlaceIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">{a.district}</Typography>
                </Box>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  {a.description}
                </Typography>

                {/* Footer */}
                <Box mt="auto">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="caption" color="text.secondary">
                      {a.reviews} reviews
                    </Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          borderColor: "grey.400",
                          color: "grey.700",
                        }}
                      >
                        Details
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none" }}
                      >
                        Get Directions
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Map Integration
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Explore on Map</Typography>
              <Button
                variant="outlined"
                startIcon={<OpenInNewIcon />}
                onClick={() =>
                  window.open("https://maps.google.com", "_blank")
                }
              >
                Open in Google Maps
              </Button>
            </Box>
            <Box
              sx={{
                height: 400,
                bgcolor: "grey.200",
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <PlaceIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
              <Typography color="text.secondary" mb={1}>
                Interactive Google Maps integration
              </Typography>
              <Typography variant="caption" color="text.secondary">
                View all destinations on an interactive map with directions and
                nearby amenities
              </Typography>
            </Box>
          </CardContent>
        </Card> */}
      </Container>
    </Box>
  );
}
