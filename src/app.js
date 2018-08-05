import * as fs from "fs";
import {AudioContext} from "web-audio-api";
import MusicTempo from "music-tempo";

var calcTempo = function (buffer) {
    var audioData = [];
    // Take the average of the two channels
    if (buffer.numberOfChannels == 2) {
      var channel1Data = buffer.getChannelData(0);
      var channel2Data = buffer.getChannelData(1);
      var length = channel1Data.length;
      for (var i = 0; i < length; i++) {
        audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
      }
    } else {
      audioData = buffer.getChannelData(0);
    }
    var mt = new MusicTempo(audioData);
   
    console.log(mt.tempo);
    //console.log(mt.beats);
  }
   
  var data = fs.readFileSync("real_bongo_nyah.mp3");
   
  var context = new AudioContext();
  context.decodeAudioData(data, calcTempo);
