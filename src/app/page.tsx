"use client";

import React, { useState, useRef } from "react";
import { InvokeLLM, UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, Instagram, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


import ImageUploadZone from "../components/generator/ImageUploadZone";
import PostPreview from "../components/generator/PostPreview";
import LoadingState from "../components/generator/LoadingState";

export default function Generator() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [generatedPost, setGeneratedPost] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    try {
      setUploadedImage(file);
      setGeneratedPost(null);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);

      // Upload file and analyze
      setIsAnalyzing(true);
      const { file_url } = await UploadFile({ file });
      
      const analysis = await InvokeLLM({
        prompt: `Analyze this image and create an engaging Instagram post. Include:
        1. A captivating caption that tells a story or evokes emotion
        2. 5-8 relevant hashtags that would boost engagement
        3. Consider the mood, colors, objects, people, setting, and overall vibe
        4. Make it authentic and conversational, not overly promotional
        5. Add some personality and maybe a call-to-action or question for engagement
        
        Format as: Caption text, then hashtags on separate lines.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            caption: { type: "string" },
            hashtags: { 
              type: "array", 
              items: { type: "string" }
            },
            mood: { type: "string" },
            suggestion: { type: "string" }
          }
        }
      });

      setGeneratedPost(analysis);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePostToInstagram = () => {
    if (!generatedPost) return;
    
    const postText = `${generatedPost.caption}\n\n${generatedPost.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')}`;
    
    // Try to open Instagram app first, fallback to web
    const instagramAppUrl = `instagram://camera`;
    const instagramWebUrl = `https://www.instagram.com/`;
    
    // Copy to clipboard first
    navigator.clipboard.writeText(postText);
    
    // Try to open Instagram
    window.open(instagramAppUrl, '_blank');
    
    // Fallback to web after a delay
    setTimeout(() => {
      window.open(instagramWebUrl, '_blank');
    }, 1000);
  };

  const handleCopyToClipboard = async () => {
    if (!generatedPost) return;
    
    const postText = `${generatedPost.caption}\n\n${generatedPost.hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ')}`;
    
    await navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetUpload = () => {
    setUploadedImage(null);
    setImageUrl(null);
    setGeneratedPost(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PostCraft AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-light">
            Transform your photos into engaging social media posts with AI magic
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Analysis */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!uploadedImage && !isAnalyzing && (
                <ImageUploadZone 
                  onImageUpload={handleImageUpload}
                  fileInputRef={fileInputRef}
                />
              )}

              {isAnalyzing && (
                <LoadingState />
              )}

              {uploadedImage && !isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="w-full h-80 object-cover"
                      />
                    </CardContent>
                  </Card>
                  
                  <Button
                    variant="outline"
                    onClick={resetUpload}
                    className="w-full border-purple-200 hover:bg-purple-50 transition-colors duration-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New Image
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Generated Post */}
          <div className="space-y-6">
            <AnimatePresence>
              {generatedPost && (
                <PostPreview 
                  post={generatedPost}
                  imageUrl={imageUrl}
                />
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <AnimatePresence>
              {generatedPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    onClick={handlePostToInstagram}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-12"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Post to Instagram
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCopyToClipboard}
                    className="flex-1 border-purple-200 hover:bg-purple-50 transition-colors duration-200 h-12"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        Copy Text
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}