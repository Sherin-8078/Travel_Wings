import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Chip,
  Button,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { CalendarToday, People, Star } from "@mui/icons-material";

export default function PackageDetailsPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [travelDate, setTravelDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  // ---------- Fetch Package Details ----------
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await axiosInstance.get(`/packages/${id}`); 
        setPkg(res.data);
      } catch (err) {
        console.error("Error fetching package:", err);
        alert("Failed to load package details.");
      }
    };
    fetchPackage();
  }, [id]);

  if (!pkg) return <Typography p={4}>Loading package details...</Typography>;

  // ---------- Handle Booking ----------
  const handleBookNow = async () => {
    if (!user) {
      alert("⚠ Please login to book this package!");
      navigate("/auth");
      return;
    }
    if (!travelDate) {
      alert("⚠ Please select a travel date.");
      return;
    }
    if (!pkg.createdBy?._id) {
      alert("Seller information missing.");
      return;
    }

    setLoading(true);
    try {
      const bookingPayload = {
        packageId: pkg._id,
        touristId: user._id,
        sellerId: pkg.createdBy._id,
        travelDate,
        guests,
        totalPrice: pkg.price * guests,
      };

      const res = await axiosInstance.post(`/bookings`, bookingPayload);

      navigate(`/booking-confirmation/${res.data.booking._id}`);
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      alert("❌ Booking failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 4, backgroundColor: "#f9fafb" }}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        
        {/* ---------- Package Image ---------- */}
        <Card sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
          <CardMedia
            component="img"
            height="400"
            image={pkg.images?.[0] || "https://via.placeholder.com/800"}
            alt={pkg.title}
          />
        </Card>

        {/* ---------- Package Info ---------- */}
        <Typography variant="h4" fontWeight={700} mb={1}>
          {pkg.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          by {pkg.createdBy?.name || "Unknown"} ({pkg.createdBy?.role || "Seller"})
        </Typography>

        <Stack direction="row" spacing={2} mb={4} flexWrap="wrap" alignItems="center">
          <Chip icon={<CalendarToday />} label={pkg.duration || "N/A"} />
          <Chip icon={<People />} label={`Group Size: ${pkg.groupSize || "N/A"}`} />
          <Chip icon={<Star />} label={`${pkg.rating || 4.5} Stars`} color="warning" />
          <Chip label={`₹${pkg.price}`} color="success" />
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* ---------- Summary ---------- */}
        {pkg.summary && (
          <Box mb={4}>
            <Typography variant="h5" mb={1}>
              Summary
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {pkg.summary}
            </Typography>
          </Box>
        )}

        {/* ---------- Description ---------- */}
        {pkg.description && (
          <Box mb={4}>
            <Typography variant="h5" mb={1}>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {pkg.description}
            </Typography>
          </Box>
        )}

        {/* ---------- Inclusions ---------- */}
        {pkg.inclusions?.length > 0 && (
          <Box mb={4}>
            <Typography variant="h5" mb={1}>
              Inclusions
            </Typography>
            <ul style={{ paddingLeft: "20px", color: "gray" }}>
              {pkg.inclusions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Box>
        )}

        {/* ---------- Booking Section ---------- */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" mb={2}>
          Booking Details
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
          <TextField
            type="date"
            label="Travel Date"
            InputLabelProps={{ shrink: true }}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            fullWidth
          />
          <TextField
            type="number"
            label="Guests"
            inputProps={{ min: 1 }}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            fullWidth
          />
        </Stack>

        {/* ---------- Actions ---------- */}
        <Stack direction="row" spacing={2} mt={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/contact/${pkg.createdBy?._id}`)}
          >
            Contact Seller
          </Button>

          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleBookNow}
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Now"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
