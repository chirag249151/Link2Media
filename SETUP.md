# 🚀 Quick Start Guide - Video Converter

## Step-by-Step Setup

### 1. Prerequisites Installation

#### Windows
```powershell
# Install Python (if not already installed)
# Download from https://www.python.org/downloads/

# Install yt-dlp via pip
pip install yt-dlp

# Verify installation
yt-dlp --version

# Optional: Install FFmpeg for audio conversion
choco install ffmpeg -y
```

#### macOS
```bash
# Install using Homebrew
brew install yt-dlp
brew install ffmpeg  # optional

# Verify installation
yt-dlp --version
```

#### Linux (Ubuntu/Debian)
```bash
# Install system packages
sudo apt update
sudo apt install python3 python3-pip ffmpeg

# Install yt-dlp
pip3 install yt-dlp

# Verify installation
yt-dlp --version
```

### 2. Project Setup

#### Navigate to Project Directory
```bash
cd "C:\Users\h9944\OneDrive\Desktop\Node js\video-converter"
```

#### Install Node.js Dependencies
```bash
npm install
```

This installs:
- **express** - Web framework
- **cors** - Enable cross-origin requests
- **axios** - HTTP client
- **express-rate-limit** - API rate limiting

### 3. Start the Server

```bash
npm start
```

Expected output:
```
✅ Video Converter Server running on http://localhost:3000
🌐 Open your browser and navigate to http://localhost:3000
```

### 4. Open in Browser

Navigate to: **http://localhost:3000**

## 🎯 How to Use

### Basic Flow

1. **Paste URL** - Enter a video URL from any supported platform
   - YouTube: `https://www.youtube.com/watch?v=...`
   - Vimeo: `https://vimeo.com/...`
   - Instagram: `https://www.instagram.com/p/...`
   - TikTok: `https://www.tiktok.com/@.../video/...`
   - And 100+ more platforms

2. **Get Video Info** - Click "🔍 Get Video Info"
   - Shows video title, uploader, duration, thumbnail
   - Lists available quality options

3. **Select Quality** - Choose desired video quality
   - 4K (2160p) - Ultra HD (if available)
   - 2K (1440p) - High Definition (if available)
   - 1080p - Full HD
   - 720p - HD
   - 480p - Standard Definition
   - 360p - Mobile

4. **Download** - Click "⬇️ Download Video"
   - Browser downloads video file
   - Check your Downloads folder

## 🛠️ Configuration

### Environment Variables

Create or edit `.env` file:

```env
PORT=3000
NODE_ENV=development
DOWNLOAD_DIR=./downloads
MAX_FILE_SIZE=5000
REQUEST_TIMEOUT=300000
```

### Change Port

If port 3000 is in use, change it:

**Windows:**
```powershell
$env:PORT=3001; npm start
```

**macOS/Linux:**
```bash
PORT=3001 npm start
```

## 🧪 Testing the API

### Test Video Information Endpoint

Using curl or Postman:

```bash
curl -X POST http://localhost:3000/api/video/info \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://www.youtube.com/watch?v=jNQXAC9IVRw\"}"
```

Expected response:
```json
{
  "success": true,
  "title": "Me at the zoo",
  "duration": 18,
  "thumbnail": "https://...",
  "uploader": "jawed",
  "uploadDate": "20050423",
  "formats": [
    {
      "label": "720p 30fps (mp4)",
      "value": "22",
      "quality": "720p"
    },
    ...
  ]
}
```

### Test Download Endpoint

```bash
curl -X POST http://localhost:3000/api/video/download \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://www.youtube.com/watch?v=jNQXAC9IVRw\", \"format\": \"best\"}"
```

## 📊 Troubleshooting

### Issue: "yt-dlp command not found"

**Solution:**
1. Install yt-dlp: `pip install yt-dlp`
2. Add to PATH (Windows):
   - Control Panel → Environment Variables
   - Add Python Scripts folder to PATH

### Issue: Port 3000 already in use

**Solution:**
```bash
# Use different port
PORT=3001 npm start

# Or find and kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000
```

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
npm install
npm install -g npm  # Update npm
```

### Issue: Video download fails

**Solutions:**
- Update yt-dlp: `pip install -U yt-dlp`
- Check URL is valid
- Verify internet connection
- Some videos have regional restrictions

## 🌐 Test URLs by Platform

Try these URLs to test the application:

### YouTube
```
https://www.youtube.com/watch?v=jNQXAC9IVRw
```

### Vimeo
```
https://vimeo.com/90509568
```

### Instagram
```
https://www.instagram.com/p/B-nUL-4AN9m/
```

### TikTok
```
https://www.tiktok.com/@tiktok/video/1234567890123456789
```

## 📱 Mobile Testing

1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac/Linux: `ifconfig` or `hostname -I`

2. On mobile device, open:
   - `http://YOUR_IP_ADDRESS:3000`

Example: `http://192.168.1.100:3000`

## 🚀 Advanced Features

### Download Specific Quality

The app automatically selects best quality, but you can:
1. Get video info
2. Click specific quality option
3. Download that quality

### Rate Limiting

API limits requests to prevent abuse:
- 30 requests per 15 minutes per IP

To increase/decrease, edit [server.js](/server.js):

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 30,                     // 30 requests per window
});
```

## 🔄 Development Mode

For development with auto-reload:

```bash
npm install -g nodemon
nodemon server.js
```

## 📦 Production Deployment

### Using PM2

```bash
npm install -g pm2

# Start server
pm2 start server.js --name "video-converter"

# View logs
pm2 logs video-converter

# Restart on reboot
pm2 startup
pm2 save
```

### Using Docker

```bash
docker build -t video-converter .
docker run -p 3000:3000 video-converter
```

## 🎬 Performance Tips

1. **Close unused browser tabs** - Reduces system load
2. **Use wired connection** - Faster than WiFi
3. **Select appropriate quality** - 4K files are large
4. **Check disk space** - Ensure enough space for downloads
5. **Close other applications** - More resources for downloads

## 📚 Useful Commands

```bash
# View Node version
node --version

# View npm version
npm --version

# View installed packages
npm list

# Update packages
npm update

# Clear npm cache
npm cache clean --force

# View logs
npm start  # Logs appear in terminal

# Stop server
Ctrl + C
```

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] yt-dlp installed (`yt-dlp --version`)
- [ ] Dependencies installed (`npm install`)
- [ ] Server started (`npm start`)
- [ ] Browser opens to http://localhost:3000
- [ ] Video info fetches successfully
- [ ] Video downloads successfully

## 🆘 Getting Help

1. **Check Logs** - Review console output for errors
2. **Check README.md** - Full documentation
3. **Search Issues** - GitHub issues may have solutions
4. **Update Tools** - Ensure yt-dlp is updated:
   ```bash
   pip install -U yt-dlp
   ```

## 📞 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "yt-dlp not found" | `pip install yt-dlp` |
| Port already in use | Use different port: `PORT=3001 npm start` |
| Module not found | Run `npm install` |
| Video won't download | Update yt-dlp: `pip install -U yt-dlp` |
| Slow downloads | Close other apps, use wired connection |
| Video not found | Check URL validity, may be region-restricted |

---

**You're all set! Enjoy downloading videos! 🎉**
