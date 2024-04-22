# Virtual-Assistant-Demo

This project is a virtual assistant constructed using React with Vite.

## Demo

https://github.com/ChrisLinOvO/virtual-assistant-demo/assets/65522190/6a52c11b-3a5d-4c1f-b426-b114e7bb660e

## Introduction

The user employs voice input to input Google Cloud Speech-to-Text (STT), which returns text. This text is then rendered in real-time mode, while the avatar performs specified actions and voice files.

Useful Links 🔗

Rhubarb LipSync:

https://github.com/DanielSWolf/rhubarb-lip-sync

Ready Player Me:

https://readyplayer.me/

And the documentation:

https://docs.readyplayer.me/ready-player-me/api-reference/rest-api/avatars/get-3d-avatars#examples-7

Convert MP3 to OGG:

https://convertio.co/mp3-ogg/

Eleven Labs (TTS):

https://elevenlabs.io/speech-synthesis

Mixamo Animations:

https://www.mixamo.com/#/

React Three Fiber documentation:

https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

R3F Drei:

https://github.com/pmndrs/drei

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ChrisLinOvO/virtual-assistant-demo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd virtual-assistant-demo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

To start the development server, run the following command:

```bash
npm run dev
```

Open http://localhost:5173/ to view the app in your browser.

## Notes

- Optoin 1:

  - Make sure [GCP authentication](https://cloud.google.com/docs/authentication/application-default-credentials) is configured.

  - Create a `.env.local` file and set `VITE_GOOGLE_API_KEY=''`.

- Optoin 2:

  - Create a Text to Speech MP3 file using [AI TTS Online](https://elevenlabs.io/text-to-speech) and download it.

  - Convert the MP3 file to OGG format using an online converter like [Convert MP3 to OGG](https://convertio.co/zh/mp3-ogg/).

  - Create a `lip_sync.json` file responsible for defining mouth shape elements for lip-syncing using [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync?tab=readme-ov-file#how-to-run-rhubarb-lip-sync).

  ```bash
  Ex: /rhubarb -f json ../public/audios/dance.ogg -o dance.json
  ```

- Optoin 3:

  - Create an avatar model using [Ready Player Me](https://readyplayer.me/) creator and download the GLB file.

  - Add animations by using [Mixamo Animations](https://www.mixamo.com/#/). Import the GLB file to Mixamo, select the desired action, and export it as an FBX file.

  - Convert the FBX file to GLB format using a tool like [Blender's](https://www.blender.org/download/)GLB converter.

  - If you need to change avatar morph targets, refer to the [documentation](https://docs.readyplayer.me/ready-player-me/api-reference/rest-api/avatars/get-3d-avatars#examples-7). This project uses `?morphTargets=Oculus Visemes` in the browser URL to download the GLB file.

## Contact

If you have any questions or feedback, feel free to contact the project maintainer:

Name: 林志隆

Email: qq2120621@gmail.com
