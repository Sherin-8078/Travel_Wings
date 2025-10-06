import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import StarIcon from "@mui/icons-material/Star";

export default function LandingPage({ onNavigate }) {
    const navigate = useNavigate();
  
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: 600,
          background: "linear-gradient(to right, #065f46, #2563eb)",
          color: "white",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1685023620523-9c726f2c499b?ixlib=rb-4.1.0&q=80&w=1080&fit=max')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <Container
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box maxWidth={600}>
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Discover the Magic of Kerala
            </Typography>
            <Typography variant="h6" paragraph>
              Your complete travel companion for exploring God's Own Country.
              Find destinations, book packages, and experience Kerala like never
              before.
            </Typography>

            {/* Search Bar */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                p: 2,
                mb: 3,
              }}
            >
              <SearchIcon sx={{ color: "gray" }} />
              <TextField
                placeholder="Search for places, packages, experiences..."
                variant="standard"
                fullWidth
                InputProps={{ disableUnderline: true }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "success.main",
                  "&:hover": { bgcolor: "success.dark" },
                }}
              >
                Search
              </Button>
            </Stack>

            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "orange",
                "&:hover": { bgcolor: "darkorange" },
                px: 4,
                py: 1.5,
              }}
              onClick={() => navigate("/explore")}
            >
              Start Exploring Kerala
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 16, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={12}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Why Choose TravelWings?
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
              We provide everything you need for an unforgettable Kerala experience
            </Typography>
          </Box>

          {/* Flexbox Row for Features */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 4,
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            {/* Card 1 */}
            <Card
              sx={{
                textAlign: "center",
                p: 6,
                flex: { xs: "1 1 100%", md: "1 1 33%" },
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={() => navigate("/explore")}
            >
              <CardContent sx={{ pt: 6 }}>
                <LocationOnIcon sx={{ fontSize: 48, color: "green", mb: 4 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Explore Destinations
                </Typography>
                <Typography color="text.secondary">
                  Discover hidden gems and popular attractions across Kerala with detailed guides and maps
                </Typography>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card
              sx={{
                textAlign: "center",
                p: 6,
                flex: { xs: "1 1 100%", md: "1 1 33%" },
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={() => navigate("/packages")}
            >
              <CardContent sx={{ pt: 6 }}>
                <GroupIcon sx={{ fontSize: 48, color: "green", mb: 4 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Curated Packages
                </Typography>
                <Typography color="text.secondary">
                  Book authentic travel packages from verified local sellers and travel agents
                </Typography>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card
              sx={{
                textAlign: "center",
                p: 6,
                flex: { xs: "1 1 100%", md: "1 1 33%" },
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
              }}
              onClick={() => navigate("/contact")}
            >
              <CardContent sx={{ pt: 6 }}>
                <StarIcon sx={{ fontSize: 48, color: "green", mb: 4 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  24/7 Support
                </Typography>
                <Typography color="text.secondary">
                  Get real-time assistance with maps, transportation, and local recommendations
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

     {/* Featured Destinations */}
<Box sx={{ py: 16 }}>
  <Container>
    <Box textAlign="center" mb={12}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Featured Destinations
      </Typography>
      <Typography color="text.secondary">
        Explore the most beautiful places in Kerala
      </Typography>
    </Box>

    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        justifyContent: "center",
      }}
    >
      {[
        {
          title: "Alleppey Backwaters",
          desc: "Houseboat experiences",
          img: "https://images.unsplash.com/photo-1652805424854-228ba60dd4eb?ixlib=rb-4.1.0&q=80&w=1080&fit=max",
        },
        {
          title: "Kochi",
          desc: "Historic port city",
          img: "https://images.unsplash.com/photo-1723158694712-d528f378577a?ixlib=rb-4.1.0&q=80&w=1080&fit=max",
        },
        {
          title: "Guruvayur",
          desc: "Temple architecture",
          img: "https://images.unsplash.com/photo-1685677260082-dbec4b1303ee?ixlib=rb-4.1.0&q=80&w=1080&fit=max",
        },
        {
          title: "Kovalam",
          desc: "Beautiful beaches",
          img: "https://images.unsplash.com/photo-1615289139857-99b7eb0702dd?ixlib=rb-4.1.0&q=80&w=1080&fit=max",
        },
      ].map((place, i) => (
        <Card
          key={i}
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" }, // responsive width
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { boxShadow: 6 },
          }}
        >
          <Box
            component="img"
            src={place.img}
            alt={place.title}
            sx={{ height: 200, width: "100%", objectFit: "cover" }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {place.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {place.desc}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Container>
</Box>


      {/* CTA Section */}
      <Box sx={{ py: 10, bgcolor: "success.main", color: "white" }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Explore Kerala?
          </Typography>
          <Typography variant="h6" mb={4}>
            Join thousands of travelers who have discovered the beauty of God's
            Own Country
          </Typography>
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
          >
            <Button
              size="large"
              variant="outlined"
              sx={{
                bgcolor: "white",
                color: "success.main",
                "&:hover": { bgcolor: "grey.100" },
              }}
              onClick={() => onNavigate("signup")}
            >
              Sign Up Now
            </Button>
            <Button
              size="large"
              variant="outlined"
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": { bgcolor: "white", color: "success.main" },
              }}
              onClick={() => onNavigate("packages")}
            >
              Browse Packages
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
