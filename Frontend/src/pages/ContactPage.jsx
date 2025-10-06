import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={8}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography color="text.secondary">
            Get in touch with our travel experts for any assistance
          </Typography>
        </Box>

        {/* Main layout using flex:
            - Left: Contact form card
            - Right: three stacked info cards (split vertically and equal height on large screens)
        */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
            alignItems: "stretch", // ensures children stretch to same height
          }}
        >
          {/* Left - Contact Form (wider) */}
          <Box sx={{ flex: { xs: "unset", lg: 1.2 }, minWidth: 0 }}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardHeader title="Send us a Message" />
              <CardContent
                sx={{
                  // allow scrolling inside the form if content grows,
                  // and provide padding so layout looks neat.
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  overflow: "auto",
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField label="First Name" name="firstName" required fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Last Name" name="lastName" required fullWidth />
                    </Grid>
                  </Grid>

                  <TextField label="Email" type="email" name="email" required fullWidth />
                  <TextField label="Phone Number" type="tel" name="phone" fullWidth />
                  <TextField
                    label="Subject"
                    name="subject"
                    required
                    placeholder="How can we help you?"
                    fullWidth
                  />
                  <TextField
                    label="Message"
                    name="message"
                    required
                    multiline
                    rows={5}
                    placeholder="Tell us about your travel plans or questions..."
                    fullWidth
                  />

                  <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ bgcolor: "green", "&:hover": { bgcolor: "darkgreen" } }}
                    >
                      Send Message
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right - Stacked info cards */}
          <Box
            sx={{
              flex: { xs: "unset", lg: 1 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
              minWidth: 0,
              // ensure right column stretches to match left column height:
              height: { xs: "auto", lg: "auto" },
            }}
          >
            {/* Each card takes equal vertical space on large screens */}
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                // equal share of the parent's height on lg+; on xs they behave naturally
                flex: { xs: "unset", lg: 1 },
                overflow: "hidden",
              }}
            >
              <CardHeader title="Get in Touch" />
              <CardContent sx={{ overflow: "auto" }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon sx={{ color: "green", mr: 2 }} />
                  <Box>
                    <Typography fontWeight="500">Phone</Typography>
                    <Typography color="text.secondary">+91 484 2345678</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <MailIcon sx={{ color: "green", mr: 2 }} />
                  <Box>
                    <Typography fontWeight="500">Email</Typography>
                    <Typography color="text.secondary">support@travelwings.com</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <LocationOnIcon sx={{ color: "green", mr: 2 }} />
                  <Box>
                    <Typography fontWeight="500">Address</Typography>
                    <Typography color="text.secondary">
                      TravelWings Tourism Pvt. Ltd.
                      <br />
                      Marine Drive, Kochi
                      <br />
                      Kerala 682031, India
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <AccessTimeIcon sx={{ color: "green", mr: 2 }} />
                  <Box>
                    <Typography fontWeight="500">Business Hours</Typography>
                    <Typography color="text.secondary">
                      Monday - Friday: 9:00 AM - 7:00 PM
                      <br />
                      Saturday: 9:00 AM - 5:00 PM
                      <br />
                      Sunday: 10:00 AM - 4:00 PM
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: { xs: "unset", lg: 1 },
                overflow: "hidden",
              }}
            >
              <CardHeader title="Emergency Support" />
              <CardContent sx={{ overflow: "auto" }}>
                <Typography color="text.secondary" mb={2}>
                  Need immediate assistance during your trip? Our 24/7 emergency helpline is always available.
                </Typography>

                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon sx={{ color: "red", mr: 2 }} />
                  <Box>
                    <Typography fontWeight="500">Emergency Hotline</Typography>
                    <Typography color="text.secondary">+91 9876543210</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <WhatsAppIcon sx={{ color: "blue", mr: 2 }} />
                  <Box>
                    <Typography fontWeight="500">WhatsApp Support</Typography>
                    <Typography color="text.secondary">+91 9876543211</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: { xs: "unset", lg: 1 },
                overflow: "hidden",
              }}
            >
              <CardHeader title="Office Locations" />
              <CardContent sx={{ overflow: "auto" }}>
                <Typography fontWeight="500">Kochi Office (Head Office)</Typography>
                <Typography color="text.secondary" variant="body2" mb={2}>
                  Marine Drive, Kochi 682031
                </Typography>

                <Typography fontWeight="500">Trivandrum Office</Typography>
                <Typography color="text.secondary" variant="body2" mb={2}>
                  Statue Junction, Trivandrum 695001
                </Typography>

                <Typography fontWeight="500">Munnar Office</Typography>
                <Typography color="text.secondary" variant="body2" mb={2}>
                  Main Bazaar, Munnar 685612
                </Typography>

                <Typography fontWeight="500">Alleppey Office</Typography>
                <Typography color="text.secondary" variant="body2">
                  Boat Jetty Road, Alleppey 688001
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* FAQ Section - full width below */}
        <Card sx={{ mt: 6 }}>
          <CardHeader title="Frequently Asked Questions" />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography fontWeight="500" gutterBottom>
                  How do I book a package?
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  You can book packages directly through our website by selecting your preferred package,
                  choosing dates, and making payment through our secure Razorpay integration.
                </Typography>

                <Typography fontWeight="500" gutterBottom>
                  What is your cancellation policy?
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Free cancellation is available up to 24 hours before your travel date. For cancellations within
                  24 hours, a 50% refund will be provided.
                </Typography>

                <Typography fontWeight="500" gutterBottom>
                  Do you provide travel insurance?
                </Typography>
                <Typography color="text.secondary">
                  We recommend purchasing travel insurance separately. We can help you connect with trusted insurance
                  providers upon request.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography fontWeight="500" gutterBottom>
                  Are your travel agents verified?
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Yes, all travel agents on our platform are verified and licensed. We conduct thorough background checks
                  and quality assessments.
                </Typography>

                <Typography fontWeight="500" gutterBottom>
                  Can I customize packages?
                </Typography>
                <Typography color="text.secondary" mb={2}>
                  Absolutely! Most of our travel agents offer customizable packages. Contact them directly or reach out to
                  our support team for assistance.
                </Typography>

                <Typography fontWeight="500" gutterBottom>
                  What payment methods do you accept?
                </Typography>
                <Typography color="text.secondary">
                  We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure Razorpay
                  payment gateway.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
