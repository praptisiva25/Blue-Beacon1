"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import LocationPicker from "../../components/LocationPicker";
import { CATEGORIES } from "../../lib/categories";


type CategoryGroup = keyof typeof CATEGORIES;
type CategoryKey<G extends CategoryGroup> = keyof typeof CATEGORIES[G];


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReportPage() {
  const router = useRouter();

  
  const [group, setGroup] = useState<CategoryGroup | "">("");
  const [category, setCategory] = useState<string>("");
  const [subCategory, setSubCategory] = useState<string>("");

  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [urgent, setUrgent] = useState(false);

  
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  
  const [image, setImage] = useState<File | null>(null);

  
  const submit = async () => {
    if (
      !group ||
      !category ||
      !subCategory ||
      !title ||
      lat === null ||
      lng === null ||
      !image
    ) {
      alert("Please fill all required fields and select a location on the map");
      return;
    }

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      alert("User not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("userId", data.user.id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryGroup", group);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("severity", severity);
    formData.append("urgent", String(urgent));
    formData.append("latitude", String(lat));
    formData.append("longitude", String(lng));
    formData.append("image", image);

    await fetch("http://localhost:8080/api/reports", {
      method: "POST",
      body: formData,
    });

    alert("Report submitted successfully");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Report an Issue</h1>

       
        <select
          className="w-full border p-2 mb-3"
          value={group}
          onChange={(e) => {
            setGroup(e.target.value as CategoryGroup);
            setCategory("");
            setSubCategory("");
          }}
        >
          <option value="">Category Group</option>
          {(Object.keys(CATEGORIES) as CategoryGroup[]).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

       
        {group && (
          <select
            className="w-full border p-2 mb-3"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory("");
            }}
          >
            <option value="">Category</option>
            {Object.keys(CATEGORIES[group]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

      
        {group && category && (
          <select
            className="w-full border p-2 mb-3"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="">Sub Category</option>
            {(CATEGORIES[group][category as keyof typeof CATEGORIES[CategoryGroup]] as readonly string[]).map(
  (sc) => (
    <option key={sc} value={sc}>
      {sc}
    </option>
  )
)}

          </select>
        )}


        <input
          className="w-full border p-2 mb-3"
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

   
        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Description (optional)"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full border p-2 mb-3"
          value={severity}
          onChange={(e) =>
            setSeverity(e.target.value as "LOW" | "MEDIUM" | "HIGH")
          }
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

      
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
          />
          Mark as urgent
        </label>

    
        <div className="mb-4">
          <p className="font-semibold mb-2">Select issue location on map</p>

          <LocationPicker
            onSelect={(latitude: number, longitude: number) => {
              setLat(latitude);
              setLng(longitude);
            }}
          />

          {lat !== null && lng !== null && (
            <p className="text-sm mt-2 text-gray-600">
              Selected: {lat.toFixed(5)}, {lng.toFixed(5)}
            </p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />


        <button
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold"
          onClick={submit}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}
