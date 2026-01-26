import * as fs from "fs";
import { AudioContext } from "web-audio-api";
import MusicTempo from "music-tempo";

const calcTempo = buffer => {
  try {
    const sampleRate = buffer.sampleRate;
    let audioData = [];
    
    // Take the average of the two channels
    if (buffer.numberOfChannels === 2) {
      const channel1Data = buffer.getChannelData(0);
      const channel2Data = buffer.getChannelData(1);
      const { length } = channel1Data;
      for (let i = 0; i < length; i += 1) {
        audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
      }
    } else {
      // Convert Float32Array to regular array
      const channelData = buffer.getChannelData(0);
      audioData = Array.from(channelData);
    }

    // Check if we have enough audio data
    if (audioData.length === 0) {
      // eslint-disable-next-line no-console
      console.error("Error: No audio data extracted from file.");
      process.exit(1);
    }

    // Downsample to reduce data size (target ~11kHz for tempo detection)
    // This helps with performance and can improve tempo detection
    const targetSampleRate = 11025;
    const downsampleFactor = Math.floor(sampleRate / targetSampleRate);
    let downsampledData = [];
    
    if (downsampleFactor > 1) {
      for (let i = 0; i < audioData.length; i += downsampleFactor) {
        downsampledData.push(audioData[i]);
      }
      audioData = downsampledData;
    }

    // eslint-disable-next-line no-console
    console.log(`Processing ${audioData.length} samples (downsampled from ${sampleRate}Hz)...`);

    const mt = new MusicTempo(audioData);

    if (mt.tempo) {
      // eslint-disable-next-line no-console
      console.log(`BPM: ${mt.tempo}`);
    } else {
      // eslint-disable-next-line no-console
      console.error("Error: Could not detect tempo. The audio file might be too short or have no clear beat.");
      process.exit(1);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error processing audio:", error.message);
    if (error.stack) {
      // eslint-disable-next-line no-console
      console.error(error.stack);
    }
    process.exit(1);
  }
};

// Get audio file path from command line arguments
const audioFilePath = process.argv[2];

if (!audioFilePath) {
  // eslint-disable-next-line no-console
  console.error("Error: Please provide an audio file path as an argument.");
  // eslint-disable-next-line no-console
  console.error("Usage: node dist/bundled.js <path-to-audio-file>");
  process.exit(1);
}

if (!fs.existsSync(audioFilePath)) {
  // eslint-disable-next-line no-console
  console.error(`Error: File not found: ${audioFilePath}`);
  process.exit(1);
}

const data = fs.readFileSync(audioFilePath);

const context = new AudioContext();
context.decodeAudioData(data, calcTempo, error => {
  // eslint-disable-next-line no-console
  console.error("Error decoding audio file:", error.message);
  // eslint-disable-next-line no-console
  console.error("Make sure the file is a valid audio format (MP3, WAV, etc.)");
  process.exit(1);
});
