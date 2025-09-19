"use client";

import React, { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebaseClient";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import PostPreview from "@/components/generator/PostPreview";

export default function Dashboard() {
  // Form states (Left side)
  const [artisanName, setArtisanName] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | ""; text: string }>({
    type: "",
    text: "",
  });

  // Firestore latest post (Right side)
  const [latestPost, setLatestPost] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setLatestPost(snapshot.docs[0].data());
      }
    });
    return unsubscribe;
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) {
      setMessage({ type: "error", text: "⚠ Please select an image." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const artisanId = "art_" + uuidv4().slice(0, 8);

      // Upload image to Storage
      const storageRef = ref(storage, `products/${artisanId}/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (err) => reject(err),
          async () => {
            const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

            // Save to Firestore
            await addDoc(collection(db, "products"), {
              artisanId,
              artisanName,
              productName,
              description,
              price: Number(price),
              contact,
              area,
              imageUrl,
              createdAt: serverTimestamp(),
            });
            resolve();
          }
        );
      });

      setMessage({ type: "success", text: "✅ Product uploaded successfully!" });

      // Reset fields
      setArtisanName("");
      setProductName("");
      setDescription("");
      setPrice("");
      setContact("");
      setArea("");
      setImage(null);
      setPreviewUrl(null);

      const fileInput = document.getElementById("photo-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setMessage({ type: "error", text: "❌ Error: " + (err?.message || err) });
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* LEFT: Dashboard Form */}
        <div className="w-full md:w-1/2">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md">
            <CardContent className="p-8 space-y-6">
              {/* Header */}
              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Digital Saathi Dashboard
              </h1>
              <p className="text-center text-gray-600">Upload artisan product details below</p>

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

                {/* Photo Upload Button */}
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
                    <ImageIcon className="w-5 h-5" /> Upload Product Photo
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
                  {loading ? "Uploading..." : "Submit Product"}
                </Button>
              </form>

              {message.text && (
                <p
                  className={`text-center font-medium text-sm ${
                    message.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Instagram-Style Preview */}
        <div className="w-full md:w-1/2">
          {latestPost ? (
            <>
              <PostPreview
                artisanName={latestPost.artisanName}
                description={latestPost.description}
                imageUrl={latestPost.imageUrl}
              />
              <Button
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                onClick={() => alert("TODO: Connect to Instagram API")}
              >
                Post to Instagram
              </Button>
            </>
          ) : (
            <p className="text-gray-500">No products yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
