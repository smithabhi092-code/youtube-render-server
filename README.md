# YouTube Render Server for n8n

This is a starter Remotion render API for deploying on Render.com and calling from n8n.

## Deploy

1. Create a GitHub repository named `youtube-render-server`.
2. Upload all files from this project.
3. On Render, choose **New Web Service**.
4. Connect the GitHub repository.
5. Build command:
   `npm install`
6. Start command:
   `npm start`
7. After deployment, Render gives you a URL such as:
   `https://your-service.onrender.com`

## Test

Open:
`https://your-service.onrender.com/health`

You should get:
`{"ok":true}`

## n8n request

POST to:
`https://your-service.onrender.com/render`

JSON body example:

{
  "compositionId": "Main",
  "inputProps": {
    "title": "My automated video",
    "subtitle": "Created by n8n"
  }
}

Important:
This starter returns the rendered MP4 directly in the HTTP response. For a production YouTube automation workflow, the next step is to add persistent/object storage (for example S3/R2) so n8n can receive a stable public MP4 URL. Do not put API keys in this repository.
