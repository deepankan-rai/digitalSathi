export const UploadFile = ({ file }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mocking file upload for: ${file.name}`);
        resolve({ file_url: "https://placehold.co/600x400/png?text=Placeholder" });
      }, 500);
    });
  };
  
export const InvokeLLM = ({ prompt, file_urls, response_json_schema }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Mocking LLM analysis...");
        resolve({
          caption: "Lost in the vibrant colors and bustling energy of the city. Every street has a story, every corner a new adventure. Feeling inspired and ready for what's next! #CityLife",
          hashtags: ["travelgram", "cityscape", "urbanexploration", "streetphotography", "adventure", "exploremore", "wanderlust", "inspiration"],
          mood: "Energetic and inspired",
          suggestion: "Try adding a question like 'What's your favorite city?' to boost comments!",
        });
      }, 2000);
    });
  };
  