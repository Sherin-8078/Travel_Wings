"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, Save } from "lucide-react";
import axiosInstance from "../axiosInstance"; 

export function AddPackagePage({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:5000/api";

  const [packageData, setPackageData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    location: "",
    highlights: [""],
    includes: [""],
    itinerary: [
      {
        day: 1,
        title: "",
        activities: "",
        meals: "",
        accommodation: "",
      },
    ],
    images: [],
  });

  // ----------------------------------------------------
  // Fetch existing package if editing
  // ----------------------------------------------------
  useEffect(() => {
    if (id) {
      axiosInstance
        .get(`/packages/${id}`)
        .then(({ data }) => {
          setPackageData({
            title: data.title || "",
            description: data.description || "",
            duration: data.duration || "",
            price: data.price || "",
            location: data.location || "",
            highlights: data.highlights?.length ? data.highlights : [""],
            includes: data.includes?.length ? data.includes : [""],
            itinerary:
              data.itinerary?.length
                ? data.itinerary
                : [
                    {
                      day: 1,
                      title: "",
                      activities: "",
                      meals: "",
                      accommodation: "",
                    },
                  ],
            images: data.images || [],
          });
        })
        .catch((err) => {
          console.error("Failed to fetch package:", err);
          alert("Failed to load package data.");
          navigate("/seller-dashboard");
        });
    }
  }, [id, navigate]);

  // ----------------------------------------------------
  // Dynamic field handlers
  // ----------------------------------------------------
  const addHighlight = () =>
    setPackageData({
      ...packageData,
      highlights: [...packageData.highlights, ""],
    });

  const updateHighlight = (i, val) => {
    const updated = [...packageData.highlights];
    updated[i] = val;
    setPackageData({ ...packageData, highlights: updated });
  };

  const removeHighlight = (i) =>
    setPackageData({
      ...packageData,
      highlights: packageData.highlights.filter((_, idx) => idx !== i),
    });

  const addInclude = () =>
    setPackageData({ ...packageData, includes: [...packageData.includes, ""] });

  const updateInclude = (i, val) => {
    const updated = [...packageData.includes];
    updated[i] = val;
    setPackageData({ ...packageData, includes: updated });
  };

  const removeInclude = (i) =>
    setPackageData({
      ...packageData,
      includes: packageData.includes.filter((_, idx) => idx !== i),
    });

  const addItineraryDay = () =>
    setPackageData({
      ...packageData,
      itinerary: [
        ...packageData.itinerary,
        {
          day: packageData.itinerary.length + 1,
          title: "",
          activities: "",
          meals: "",
          accommodation: "",
        },
      ],
    });

  const updateItinerary = (i, field, val) => {
    const updated = [...packageData.itinerary];
    updated[i][field] = val;
    setPackageData({ ...packageData, itinerary: updated });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPackageData({ ...packageData, images: [...packageData.images, ...files] });
  };

  // ----------------------------------------------------
  // Submit Handler
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", packageData.title);
      formData.append("description", packageData.description);
      formData.append("duration", packageData.duration);
      formData.append("price", packageData.price);
      formData.append("location", packageData.location);
      formData.append("createdBy", user._id);
      formData.append("highlights", JSON.stringify(packageData.highlights));
      formData.append("includes", JSON.stringify(packageData.includes));
      formData.append("itinerary", JSON.stringify(packageData.itinerary));

      packageData.images.forEach((img) => {
        if (img instanceof File) formData.append("images", img);
      });

      if (id) {
        await axiosInstance.put(`/packages/edit/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Package updated successfully!");
      } else {
        await axiosInstance.post(`/packages/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Package added successfully!");
      }

      navigate("/seller-dashboard");
    } catch (err) {
      console.error("Failed to save package:", err);
      alert("Error saving package. Please try again.");
    }
  };

  // ----------------------------------------------------
  // JSX Render
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">
          {id ? "Edit Package" : "Add New Package"}
        </h1>
        <p className="text-gray-600 mb-6">
          {id
            ? "Update your travel package details"
            : "Create a new travel package for tourists to book"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={packageData.title}
              onChange={(e) =>
                setPackageData({ ...packageData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={packageData.description}
              onChange={(e) =>
                setPackageData({ ...packageData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Duration"
              className="w-1/2 p-2 border rounded"
              value={packageData.duration}
              onChange={(e) =>
                setPackageData({ ...packageData, duration: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="w-1/2 p-2 border rounded"
              value={packageData.price}
              onChange={(e) =>
                setPackageData({ ...packageData, price: e.target.value })
              }
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Location"
              className="w-full p-2 border rounded"
              value={packageData.location}
              onChange={(e) =>
                setPackageData({ ...packageData, location: e.target.value })
              }
              required
            />
          </div>

          {/* Images */}
          <div>
            <p className="font-semibold mb-2">Images</p>
            <input type="file" multiple onChange={handleImageUpload} />

            <div className="flex gap-2 mt-2 overflow-x-auto">
              {packageData.images.map((img, idx) => (
                <img
                  key={idx}
                  src={
                    img instanceof File
                      ? URL.createObjectURL(img)
                      : `${API_BASE.replace("/api", "")}${img}`
                  }
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-1"
          >
            <Save /> {id ? "Update Package" : "Save Package"}
          </button>
        </form>
      </div>
    </div>
  );
}
