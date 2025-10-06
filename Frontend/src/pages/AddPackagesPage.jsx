"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, X, Save } from "lucide-react";
import axios from "axios";

export function AddPackagePage({ user }) {
  const navigate = useNavigate();
  const { id } = useParams(); // id exists for edit

  const [packageData, setPackageData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    location: "",
    highlights: [""],
    includes: [""],
    itinerary: [{ day: 1, title: "", activities: "", meals: "", accommodation: "" }],
    images: [], // Array of URLs or File objects
  });

  // ---------- Fetch package data if editing ----------
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/packages/${id}`)
        .then(({ data }) => {
          setPackageData({
            title: data.title || "",
            description: data.description || "",
            duration: data.duration || "",
            price: data.price || "",
            location: data.location || "",
            highlights: data.highlights.length ? data.highlights : [""],
            includes: data.includes.length ? data.includes : [""],
            itinerary: data.itinerary.length ? data.itinerary : [{ day: 1, title: "", activities: "", meals: "", accommodation: "" }],
            images: data.images || [],
          });
        })
        .catch(err => {
          console.error("Failed to fetch package:", err);
          alert("Failed to load package data.");
          navigate("/seller-dashboard");
        });
    }
  }, [id, navigate]);

  // ---------- Dynamic fields handlers ----------
  const addHighlight = () => setPackageData({ ...packageData, highlights: [...packageData.highlights, ""] });
  const removeHighlight = (i) => setPackageData({ ...packageData, highlights: packageData.highlights.filter((_, idx) => idx !== i) });
  const updateHighlight = (i, val) => { const updated = [...packageData.highlights]; updated[i] = val; setPackageData({ ...packageData, highlights: updated }); };

  const addInclude = () => setPackageData({ ...packageData, includes: [...packageData.includes, ""] });
  const removeInclude = (i) => setPackageData({ ...packageData, includes: packageData.includes.filter((_, idx) => idx !== i) });
  const updateInclude = (i, val) => { const updated = [...packageData.includes]; updated[i] = val; setPackageData({ ...packageData, includes: updated }); };

  const addItineraryDay = () =>
    setPackageData({ ...packageData, itinerary: [...packageData.itinerary, { day: packageData.itinerary.length + 1, title: "", activities: "", meals: "", accommodation: "" }] });

  const updateItinerary = (i, field, val) => { const updated = [...packageData.itinerary]; updated[i][field] = val; setPackageData({ ...packageData, itinerary: updated }); };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPackageData({ ...packageData, images: [...packageData.images, ...files] });
  };

  // ---------- Submit handler ----------
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

      // Append new images (File objects only)
      packageData.images.forEach((img) => {
        if (img instanceof File) formData.append("images", img);
      });

      if (id) {
        await axios.put(`http://localhost:5000/api/packages/edit/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Package updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/packages/add", formData, {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">{id ? "Edit Package" : "Add New Package"}</h1>
        <p className="text-gray-600 mb-6">{id ? "Update your travel package details" : "Create a new travel package for tourists to book"}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <input type="text" placeholder="Title" className="w-full p-2 border rounded" value={packageData.title} onChange={(e) => setPackageData({ ...packageData, title: e.target.value })} required />
          </div>
          <div>
            <textarea placeholder="Description" className="w-full p-2 border rounded" value={packageData.description} onChange={(e) => setPackageData({ ...packageData, description: e.target.value })} required />
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Duration" className="w-1/2 p-2 border rounded" value={packageData.duration} onChange={(e) => setPackageData({ ...packageData, duration: e.target.value })} required />
            <input type="number" placeholder="Price" className="w-1/2 p-2 border rounded" value={packageData.price} onChange={(e) => setPackageData({ ...packageData, price: e.target.value })} required />
          </div>
          <div>
            <input type="text" placeholder="Location" className="w-full p-2 border rounded" value={packageData.location} onChange={(e) => setPackageData({ ...packageData, location: e.target.value })} required />
          </div>

          {/* Highlights
          <div>
            <p className="font-semibold mb-2">Highlights</p>
            {packageData.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" placeholder="Highlight" className="flex-1 p-2 border rounded" value={h} onChange={(e) => updateHighlight(i, e.target.value)} />
                <button type="button" onClick={() => removeHighlight(i)} className="bg-red-500 text-white px-2 rounded"><X size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={addHighlight} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"><Plus size={14} /> Add Highlight</button>
          </div> */}

          {/* Includes */}
          {/* <div>
            <p className="font-semibold mb-2">Includes</p>
            {packageData.includes.map((inc, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" placeholder="Include" className="flex-1 p-2 border rounded" value={inc} onChange={(e) => updateInclude(i, e.target.value)} />
                <button type="button" onClick={() => removeInclude(i)} className="bg-red-500 text-white px-2 rounded"><X size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={addInclude} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"><Plus size={14} /> Add Include</button>
          </div> */}

          {/* Itinerary
          <div>
            <p className="font-semibold mb-2">Itinerary</p>
            {packageData.itinerary.map((day, i) => (
              <div key={i} className="mb-2 border p-2 rounded">
                <p className="font-semibold">Day {day.day}</p>
                <input type="text" placeholder="Title" className="w-full p-2 border rounded mb-1" value={day.title} onChange={(e) => updateItinerary(i, "title", e.target.value)} />
                <input type="text" placeholder="Activities" className="w-full p-2 border rounded mb-1" value={day.activities} onChange={(e) => updateItinerary(i, "activities", e.target.value)} />
                <input type="text" placeholder="Meals" className="w-full p-2 border rounded mb-1" value={day.meals} onChange={(e) => updateItinerary(i, "meals", e.target.value)} />
                <input type="text" placeholder="Accommodation" className="w-full p-2 border rounded" value={day.accommodation} onChange={(e) => updateItinerary(i, "accommodation", e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={addItineraryDay} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"><Plus size={14} /> Add Day</button>
          </div> */}

          {/* Images */}
          <div>
            <p className="font-semibold mb-2">Images</p>
            <input type="file" multiple onChange={handleImageUpload} />
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {packageData.images.map((img, idx) => (
                <img key={idx} src={img instanceof File ? URL.createObjectURL(img) : `http://localhost:5000${img}`} alt="Preview" className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-1"><Save /> {id ? "Update Package" : "Save Package"}</button>
        </form>
      </div>
    </div>
  );
}
