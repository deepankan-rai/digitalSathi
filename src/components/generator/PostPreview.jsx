import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function PostPreview({ artisanName, description, imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
        {/* Top bar */}
        <CardHeader className="pb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {artisanName ? artisanName[0] : "A"}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{artisanName || "Artisan"}</h3>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Image */}
          {imageUrl && (
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={imageUrl}
                alt="Product"
                className="w-full aspect-square object-cover"
              />
            </div>
          )}

          {/* Instagram actions */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 cursor-pointer transition-colors" />
              <MessageCircle className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
              <Share className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
            </div>
            <Bookmark className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
          </div>

          {/* Caption (description only) */}
          <div className="space-y-3">
            <p className="text-gray-800 leading-relaxed">
              {description || "Beautiful handmade product crafted with love."}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
