# Simple beat detection application

This is a simple beat detection application that analyzes audio files and outputs the BPM (beats per minute) of the track.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run transpile
   ```

## Usage

Run the application with an audio file path:

```bash
npm start -- <path-to-audio-file>
```

Or run directly:
```bash
node dist/bundled.js <path-to-audio-file>
```

### Examples

```bash
npm start -- sample.mp3
npm start -- ./music/song.wav
node dist/bundled.js my-audio-file.mp3
```

## Supported Formats

The application supports common audio formats including MP3, WAV, and other formats supported by the Web Audio API.

## Notes

- After making changes to `src/app.js`, run `npm run transpile` to rebuild before running
- The audio file should have a clear beat pattern for accurate BPM detection
- Longer audio files (at least a few seconds) tend to produce more accurate results
