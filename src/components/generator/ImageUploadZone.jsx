import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Image } from "lucide-react";
import { motion } from "framer-motion";

export default function ImageUploadZone({ onImageUpload, fileInputRef }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card 
        className={`border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragActive 
            ? 'border-purple-400 bg-purple-50 shadow-lg scale-105' 
            : 'border-purple-200 hover:border-purple-300 bg-white/60 backdrop-blur-sm shadow-xl'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-12">
          <div className="text-center space-y-6">
            <motion.div
              animate={{ 
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 5 : 0 
              }}
              transition={{ duration: 0.2 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center"
            >
              <Image className="w-10 h-10 text-purple-500" />
            </motion.div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Upload Your Photo
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Supports JPG, PNG, GIF up to 10MB
              </p>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="border-purple-200 hover:bg-purple-50 transition-colors duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Browse Files
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-pink-200 hover:bg-pink-50 transition-colors duration-200"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </motion.div>
  );
}