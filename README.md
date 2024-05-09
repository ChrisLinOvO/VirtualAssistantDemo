# Virtual-Assistant-Demo

This project is a virtual assistant constructed using React with Vite.

## Demo

https://github.com/ChrisLinOvO/VirtualAssistantDemo/assets/65522190/3b4283eb-3c07-49b7-920c-a2e51b67016b

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

## Env Setting

`.env` must be added to the directory, `VITE_GOOGLE_API_KEY` is a required item。

```
VITE_TITLE=DEFAULT_TITLE
VITE_SUB_TITLE=DEFAULT_SUB_TITLE
VITE_ENVIRONMENT=DEFAULT_ENVIRONMENT
VITE_GOOGLE_API_KEY='xxxxxxx'
```

## Dynamic Environment Variables for Dockerized

1. Setting environment

run `npm run dev` will get the `.env.development` environment variable.
run `npm run build` will get the `.env.production` environment variable.

Example:

```
// .env
VITE_TITLE=DEFAULT_TITLE
VITE_SUB_TITLE=DEFAULT_SUB_TITLE
VITE_ENVIRONMENT=DEFAULT_ENVIRONMENT
VITE_GOOGLE_API_KEY='xxxxxx'
```

```
// .env.development
VITE_TITLE=DEV_TITLE
VITE_SUB_TITLE=DEV_SUB_TITLE
VITE_ENVIRONMENT=DEV_ENVIRONMENT
```

```
// .env.production
VITE_TITLE=PROD_TITLE
VITE_SUB_TITLE=PROD_SUB_TITLE
VITE_ENVIRONMENT=PROD_ENVIRONMENT
```

2. Add shell script
   Since all environment values now start with `PROD_`, you can create a script that looks for all environment variables starting with `PROD_` and performs replacements for each of them. Create a shell script called `.env.sh` inside your project

```shell
#!/bin/sh
for i in $(env | grep PROD_)
do
	key=$(echo $i | cut -d '=' -f 1)
	value=$(echo $i | cut -d '=' -f 2-)
	echo $key=$value
    # sed All files
	# find /usr/share/nginx/html -type f -exec sed -i "s|${key}|${value}|g" '{}' +

    # sed JS and CSS only
    find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done
```

3. Add Nginx server
   We can package the React application and run it on Nginx server. Of particular note is configuring the Nginx server to return the index.html file when a 404 error occurs, so that React routing can correctly handle the path to the website.

```conf
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html =404;
  }
}
```

4. Create a Dockerfile

- Stage 1: Build Image
- Stage 2: use the compiled app, ready for production with Nginx

```Dockerfile
# Stage 1: Build Image
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: use the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
```

5. Create a Docker image and run a Docker container

```zsh
docker image build -t <your_image_name> .
```

You can utilize Docker to dynamically alter variables, thus achieving dynamically generated results in a production environment.

```zsh
docker run -p 8088:80 -e PROD_TITLE=IS_PROD_TITLE -e PROD_ENVIRONMENT=IS_PROD <your_image_name>
```

## Notes

- Optoin 1:

  - Make sure [GCP authentication](https://cloud.google.com/docs/authentication/application-default-credentials) is configured.

  - Create a `.env` file and set `VITE_GOOGLE_API_KEY=''`.

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

- Optoin 4:
  - Dynamic Environment Variables for Dockerized：https://dev.to/sanjayttg/dynamic-environment-variables-for-dockerized-react-apps-5bc5

## Contact

If you have any questions or feedback, feel free to contact the project maintainer:

Name: 林志隆

Email: qq2120621@gmail.com
