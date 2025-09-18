"use client";

import React, { useState } from "react";
import { db /*, storage */ } from "@/lib/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";

export default function Dashboard() {
  const [artisanName, setArtisanName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const artisanId = "art_" + uuidv4().slice(0, 8);

      // 🚫 Storage upload temporarily disabled
      // let imageUrl = null;
      // if (image) {
      //   const storageRef = ref(storage, `products/${artisanId}/${image.name}`);
      //   const uploadTask = uploadBytesResumable(storageRef, image);
      //   imageUrl = await new Promise<string>((resolve, reject) => {
      //     uploadTask.on(
      //       "state_changed",
      //       null,
      //       (err) => reject(err),
      //       async () => {
      //         const url = await getDownloadURL(uploadTask.snapshot.ref);
      //         resolve(url);
      //       }
      //     );
      //   });
      // }

      // Save to Firestore (without imageUrl for now)
      await addDoc(collection(db, "products"), {
        artisanId,
        artisanName,
        productName,
        description,
        price,
        contact,
        area,
        // imageUrl, // uncomment when Storage is ready
        createdAt: serverTimestamp(),
      });

      setMessage("✅ Product saved successfully!");
      // Reset fields
      setArtisanName("");
      setProductName("");
      setDescription("");
      setPrice("");
      setContact("");
      setArea("");
      setImage(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setMessage("❌ Error: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md">
          <CardContent className="p-8 space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Digital Saathi Dashboard
            </h1>
            <p className="text-center text-gray-600">
              Upload artisan product details below
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Artisan Name"
                value={artisanName}
                onChange={(e) => setArtisanName(e.target.value)}
                required
              />
              <input
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
              <textarea
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
              <input
                type="number"
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Price (₹)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <input
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Contact Number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
              <input
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />

              {/* Photo Upload UI (preview only, no Storage upload) */}
              <div className="flex flex-col items-center space-y-3 border-2 border-dashed rounded-lg p-6 text-center hover:bg-purple-50 transition">
                <input
                  type="file"
                  accept="image/*"
                  id="photo-upload"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow hover:opacity-90 transition"
                >
                  <ImageIcon className="w-5 h-5" />
                  Select Product Photo
                </label>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-lg border shadow-md"
                  />
                )}
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="default"
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? "Saving..." : "Submit Product"}
              </Button>
            </form>

            {message && (
              <p className="text-center font-medium text-sm text-gray-700">
                {message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
