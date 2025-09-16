import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function PostPreview({ post, imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">You</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Your Account</h3>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Image Preview */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={imageUrl}
              alt="Post preview"
              className="w-full h-64 object-cover"
            />
          </div>
          
          {/* Instagram-style interactions */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 cursor-pointer transition-colors" />
              <MessageCircle className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
              <Share className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
            </div>
            <Bookmark className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
          </div>
          
          {/* Caption */}
          <div className="space-y-3">
            <p className="text-gray-800 leading-relaxed">
              <span className="font-semibold mr-2">your_account</span>
              {post.caption}
            </p>
            
            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {post.hashtags?.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors text-xs"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </Badge>
              ))}
            </div>
            
            {/* Mood indicator */}
            {post.mood && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Mood:</span> {post.mood}
                </p>
                {post.suggestion && (
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Tip:</span> {post.suggestion}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}