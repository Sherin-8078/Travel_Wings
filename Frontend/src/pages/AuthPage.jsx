// AuthPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

// ---------------- API ----------------
const API = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------------- AuthForm ----------------
function AuthForm({
  tab,
  loginForm,
  setLoginForm,
  signupForm,
  setSignupForm,
  onLogin,
  navigateDashboard,
}) {
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaToken) return alert("Please verify the CAPTCHA");

    try {
      setLoading(true);
      const res = await API.post("/login", {
        email: loginForm.email.trim(),
        password: loginForm.password,
        captchaToken,
      });

      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      navigateDashboard(user.role);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      setCaptchaToken(null);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!captchaToken) return alert("Please verify the CAPTCHA");

    try {
      setLoading(true);
      const res = await API.post("/signup", {
        ...signupForm,
        email: signupForm.email.trim(),
        captchaToken,
      });

      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
      navigateDashboard(user.role);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
      setCaptchaToken(null);
    }
  };

  return (
    <>
      {/* ---------- LOGIN ---------- */}
      {tab === 0 && (
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            required
            fullWidth
          />
          <ReCAPTCHA
            sitekey="6LeAg94rAAAAADpDJ7QYTkFA47gTdXBF0B2psl90"
            onChange={(token) => setCaptchaToken(token)}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      )}

      {/* ---------- SIGNUP ---------- */}
      {tab === 1 && (
        <Box
          component="form"
          onSubmit={handleSignup}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Full Name"
            value={signupForm.name}
            onChange={(e) =>
              setSignupForm({ ...signupForm, name: e.target.value })
            }
            required
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={signupForm.email}
            onChange={(e) =>
              setSignupForm({ ...signupForm, email: e.target.value })
            }
            required
            fullWidth
          />
          <TextField
            label="Phone"
            value={signupForm.phone}
            onChange={(e) =>
              setSignupForm({ ...signupForm, phone: e.target.value })
            }
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={signupForm.password}
            onChange={(e) =>
              setSignupForm({ ...signupForm, password: e.target.value })
            }
            required
            fullWidth
          />

          {/* ---------- Role Selector ---------- */}
          <TextField
            select
            label="Signup as"
            value={signupForm.role}
            onChange={(e) =>
              setSignupForm({ ...signupForm, role: e.target.value })
            }
            required
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="tourist">Tourist</option>
            <option value="seller">Seller</option>
            <option value="guide">Guide</option>
          </TextField>

          {/* Seller fields */}
          {signupForm.role === "seller" && (
            <>
              <TextField
                label="Agency Name"
                value={signupForm.agencyName}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, agencyName: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Business License No."
                value={signupForm.license}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, license: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Location"
                value={signupForm.location}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, location: e.target.value })
                }
                required
                fullWidth
              />
            </>
          )}

          {/* Guide fields */}
          {signupForm.role === "guide" && (
            <>
              <TextField
                label="Languages Known"
                value={signupForm.languages}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, languages: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Experience (years)"
                type="number"
                value={signupForm.experience}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, experience: e.target.value })
                }
                required
                fullWidth
              />
              <TextField
                label="Location"
                value={signupForm.location}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, location: e.target.value })
                }
                required
                fullWidth
              />
            </>
          )}

          <ReCAPTCHA
            sitekey="6LeAg94rAAAAADpDJ7QYTkFA47gTdXBF0B2psl90"
            onChange={(token) => setCaptchaToken(token)}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Box>
      )}
    </>
  );
}

// ---------------- Main AuthPage ----------------
export default function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "tourist",
    agencyName: "",
    license: "",
    location: "",
    languages: "",
    experience: "",
  });

  const navigateDashboard = (role) => {
    const routes = {
      seller: "/seller-dashboard",
      guide: "/seller-dashboard",
      admin: "/admin-dashboard",
      tourist: "/tourist-dashboard",
    };
    navigate(routes[role] || "/tourist-dashboard");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      onLogin(JSON.parse(user));
      navigateDashboard(JSON.parse(user).role);
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 450 }}>
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="success.main"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            TravelWings
          </Typography>
          <Typography color="text.secondary">
            Your Kerala travel companion
          </Typography>
        </Box>

        <Card>
          <CardHeader
            title={
              <Tabs
                value={tab}
                onChange={(_, newVal) => setTab(newVal)}
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            }
            sx={{ pb: 0 }}
          />
          <CardContent>
            <AuthForm
              tab={tab}
              loginForm={loginForm}
              setLoginForm={setLoginForm}
              signupForm={signupForm}
              setSignupForm={setSignupForm}
              onLogin={onLogin}
              navigateDashboard={navigateDashboard}
            />
          </CardContent>
        </Card>

        <Box textAlign="center" mt={3}>
          <Button color="inherit" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
