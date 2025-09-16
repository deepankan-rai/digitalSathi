import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50 overflow-hidden">
        <CardContent className="p-12">
          <div className="text-center space-y-6">
            {/* Animated Icons */}
            <div className="flex justify-center gap-4">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0 
                }}
              >
                <Brain className="w-8 h-8 text-purple-500" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -10, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.3 
                }}
              >
                <Sparkles className="w-8 h-8 text-pink-500" />
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.6 
                }}
              >
                <Wand2 className="w-8 h-8 text-purple-500" />
              </motion.div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                AI Magic in Progress
              </h3>
              <p className="text-gray-600 text-lg">
                Analyzing your image and crafting the perfect post...
              </p>
            </div>
            
            {/* Loading Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                style={{ width: '50%' }}
              />
            </div>
            
            <p className="text-sm text-gray-500">
              This usually takes 5-10 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}