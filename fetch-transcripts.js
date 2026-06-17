const axios = require("axios");
const fs = require("fs");

const SUPADATA_API_KEY = "sd_a9d2738d2b9dac2d83cb5e0442319f0d";

const videos = [
  { author: "alex-berman", url: "https://www.youtube.com/watch?v=881Dr4lMey4" },
  { author: "jason-bay", url: "https://www.youtube.com/watch?v=ZQzX4uTV87Y" },
  { author: "saad-sells", url: "https://www.youtube.com/watch?v=x3Rf2Yy97LM" },
  { author: "morgan-ingram", url: "https://www.youtube.com/watch?v=nUe5IpnleRc" }, 
];

async function fetchTranscript(videoUrl) {
  const response = await axios.get("https://api.supadata.ai/v1/youtube/transcript", {
    params: { url: videoUrl },
    headers: { "x-api-key": SUPADATA_API_KEY }
  });
  return response.data;
}

async function main() {
  for (const video of videos) {
    try {
      console.log(`Fetching: ${video.url}`);
      const transcript = await fetchTranscript(video.url);
      const filename = `research/youtube-transcripts/${video.author}.md`;
      const transcriptText = Array.isArray(transcript.content) 
      ? transcript.content.map(item => item.text).join(" ")
      : JSON.stringify(transcript, null, 2);
    
    const content = `# ${video.author} — YouTube Transcript\nURL: ${video.url}\n\n${transcriptText}`;
      fs.writeFileSync(filename, content);
      console.log(`Saved: ${filename}`);
    } catch (err) {
      console.error(`Failed for ${video.url}:`, err.message);
    }
  }
}

main();