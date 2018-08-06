import * as fs from "fs";
import { AudioContext } from "web-audio-api";
import MusicTempo from "music-tempo";

const calcTempo = buffer => {
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
    audioData = buffer.getChannelData(0);
  }
  const mt = new MusicTempo(audioData);

  console.log(mt.tempo);
  // console.log(mt.beats);
};

const data = fs.readFileSync("real_bongo_nyah.mp3");

const context = new AudioContext();
context.decodeAudioData(data, calcTempo);
