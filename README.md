# 🎬 Video Converter - Download Any Video with Best Quality

A full-featured web application to download videos from any popular platform (YouTube, Vimeo, Instagram, TikTok, Dailymotion, and many more) with the best available quality.

## ✨ Features

- 🌍 **Multi-Platform Support**: Download from 100+ video platforms
- 🎯 **Quality Selection**: Choose from 360p to 4K resolution
- ⚡ **Fast Downloads**: Optimized for quick video processing
- 🔒 **Privacy Focused**: No accounts or database; temporary downloads are cleaned up
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎵 **Audio-only Downloads**: Download the best available audio stream in its source format
- 🚀 **Reliable**: Built with modern technologies

## 📋 Supported Platforms

- YouTube
- Vimeo
- Instagram
- TikTok
- Dailymotion
- Twitter/X
- Facebook
- Reddit
- Pinterest
- Snapchat
- And 90+ more platforms...

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **yt-dlp** - Video downloading engine
- **FFmpeg** - Video processing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript** - No dependencies
- **Responsive Design** - Mobile-first approach

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **yt-dlp** - Video downloader
   - **Windows**: `choco install yt-dlp` (using Chocolatey)
   - **Mac**: `brew install yt-dlp`
   - **Linux**: `sudo apt install yt-dlp`
3. **FFmpeg** (required to combine separate video and audio streams; audio-only downloads do not require it)
   - **Windows**: `choco install ffmpeg`
   - **Mac**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg`

## 🚀 Quick Start

### 1. Clone or Download the Project
```bash
cd video-converter
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify yt-dlp is installed
```bash
yt-dlp --version
```

If not installed, follow the instructions above for your OS.

### 4. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 5. Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage

1. **Choose output** - Select Video or Audio only.
2. **Paste a link** - Enter a URL from a supported platform and fetch its information.
3. **Choose quality** - For video, select one of the available resolutions. Audio downloads use the best available audio stream.
4. **Download** - Start the download; your browser will save the resulting file.

Audio is saved in the source audio format provided by the platform (for example, M4A or WebM). The app does not transcode audio to MP3.

## ☁️ Deploy to Render

This project includes a Docker configuration that installs Node.js, yt-dlp, and FFmpeg. To deploy it:

1. Push the project, including `Dockerfile` and `render.yaml`, to your GitHub repository.
2. Sign in to [Render](https://render.com/) and choose **New + → Blueprint**.
3. Connect your GitHub account and select this repository.
4. Review the `link-to-media` web service and choose **Apply**.
5. Wait for the Docker build and deployment to finish, then open the `.onrender.com` URL shown in the service dashboard.

Render checks `/health` to confirm that the server is ready. No environment secrets are required.

**Important:** The included free plan uses an ephemeral filesystem. Downloaded files are temporary, are removed when the instance restarts, and the app already cleans up old files after an hour. Free web services may sleep while idle and take time to wake. Video downloads also use significant CPU, disk, and bandwidth; use the service only for content you are authorized to download and check Render's current usage limits before sharing the public URL. Persistent storage and higher resource limits require an appropriate paid plan.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Server Port
PORT=3000

# Node Environment
NODE_ENV=development

# Download Directory
DOWNLOAD_DIR=./downloads

# Max file size (in MB)
MAX_FILE_SIZE=5000

# Request timeout (in milliseconds)
REQUEST_TIMEOUT=300000
```

## 📁 Project Structure

```
video-converter/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML
│   ├── styles.css         # Styling
│   └── script.js          # JavaScript
├── routes/                # API routes
│   └── video.js          # Video endpoints
├── controllers/          # Business logic
│   └── videoController.js
├── services/            # Service layer
│   └── videoService.js
├── middleware/          # Custom middleware
│   └── errorHandler.js
├── server.js           # Main server file
├── package.json        # Dependencies
└── README.md          # This file
```

## 🔌 API Endpoints

### GET Video Information
**Endpoint:** `POST /api/video/info`

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "success": true,
  "title": "Video Title",
  "duration": 212,
  "thumbnail": "https://...",
  "uploader": "Channel Name",
  "uploadDate": "20230101",
  "formats": [
    {
      "label": "1080p 30fps (mp4)",
      "value": "22",
      "quality": "1080p"
    },
    ...
  ]
}
```

### Download Video
**Endpoint:** `POST /api/video/download`

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "best",
  "mode": "video"
}
```

Set `"mode": "audio"` to download the best audio-only stream; the `format` field is only used in video mode.

**Response:**
```json
{
  "success": true,
  "message": "Video download started",
  "filename": "video_title.mp4"
}
```

## 🎯 Quality Selection

The application automatically groups available formats by quality:
- 4K (2160p) - Ultra HD
- 2K (1440p) - High Definition
- 1080p - Full HD
- 720p - HD
- 480p - SD
- 360p - Mobile

## ⚠️ Rate Limiting

The API includes rate limiting to prevent abuse:
- **Limit**: 30 requests per 15 minutes per IP
- **Window**: 15 minutes

## 🐛 Troubleshooting

### yt-dlp not found
```bash
# Install yt-dlp
pip install yt-dlp
# Or using system package manager (see Prerequisites)
```

### Video download fails
1. Check if the URL is valid
2. Verify yt-dlp is up to date: `yt-dlp -U`
3. Check internet connection
4. Some videos may have regional restrictions

### Port already in use
Change the PORT in .env file or run:
```bash
PORT=3001 npm start
```

### Large file downloads timeout
Increase the REQUEST_TIMEOUT in .env file (in milliseconds)

## 📊 Performance Tips

1. **Use Chrome/Firefox** for best performance
2. **Close other downloads** to maximize bandwidth
3. **Select appropriate quality** - 4K requires more bandwidth
4. **Use wired connection** for faster downloads
5. **Check disk space** before large downloads

## 🔒 Security & Privacy

- No videos are stored on the server
- No personal data is collected
- URLs are not logged
- Each download is temporary
- Uses HTTPS recommended for production

## 📝 Legal Notice

This tool is intended for **personal, non-commercial use only**. Users are responsible for:
- Respecting copyright and intellectual property rights
- Complying with platform terms of service
- Following local laws and regulations
- Not distributing copyrighted content

The creators are not liable for misuse of this tool.

## 🚀 Deployment

### Deploy to Heroku
```bash
# Create Heroku app
heroku create your-app-name

# Add buildpacks
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git
heroku buildpacks:add https://github.com/puppeteer/heroku-buildpack.git

# Deploy
git push heroku main
```

### Deploy to Vercel (Frontend only)
The frontend can be deployed to Vercel, but the backend needs a server that supports long-running processes.

### Deploy using Docker
```dockerfile
FROM node:18-alpine

# Install yt-dlp and ffmpeg
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg

RUN pip install yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

## 💡 Tips & Tricks

1. **Batch Downloads** - Open multiple tabs for concurrent downloads
2. **Quality Comparison** - Check video quality before downloading
3. **Mobile Optimization** - Use mobile-friendly videos (480p or 720p)
4. **Audio Only** - Some platforms allow audio extraction

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Video downloader
- [Express.js](https://expressjs.com/) - Web framework
- [FFmpeg](https://ffmpeg.org/) - Video processing

## 📞 Support

For issues and questions:
1. Check the Troubleshooting section
2. Review existing GitHub issues
3. Create a new GitHub issue with details

## 🎓 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)
- [Web Development Best Practices](https://developer.mozilla.org/en-US/)

---

**Made with ❤️ for video enthusiasts**

Last Updated: September 2026
