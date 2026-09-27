# 🎬 Video Converter - Installation & Usage Guide

## ⚡ Quick Start (2 minutes)

### Windows Users
```powershell
# Open PowerShell and run:
cd "C:\Users\h9944\OneDrive\Desktop\Node js\video-converter"
npm start
```

Then open your browser: **http://localhost:3000**

---

## 📋 Full Installation Guide

### Step 1: Prerequisites Check

#### Windows
```powershell
# Check Node.js installed
node --version  # Should show v14+

# Check Python installed
python --version  # Should show Python 3.6+

# Check yt-dlp installed
pip show yt-dlp
```

#### macOS
```bash
# Check Node.js
node --version

# Check Python
python3 --version

# Check yt-dlp
which yt-dlp
```

#### Linux
```bash
node --version
python3 --version
which yt-dlp
```

### Step 2: Install Missing Dependencies

#### If yt-dlp not installed

**Windows:**
```powershell
pip install yt-dlp
# Verify:
yt-dlp --version
```

**macOS:**
```bash
brew install yt-dlp
# Or:
pip3 install yt-dlp
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install yt-dlp

# Or via pip
pip3 install yt-dlp
```

### Step 3: Install Node Dependencies

```bash
cd video-converter
npm install
```

This installs:
- express (4.18.2) - Web framework
- cors (2.8.5) - Cross-origin support
- express-rate-limit (7.1.5) - Rate limiting
- axios (1.6.0) - HTTP client
- dotenv (16.3.1) - Environment config

### Step 4: Start the Server

```bash
npm start
```

Expected output:
```
✅ Video Converter Server running on http://localhost:3000
🌐 Open your browser and navigate to http://localhost:3000
```

### Step 5: Access the Application

Open browser and go to: **http://localhost:3000**

---

## 🎯 How to Use

### Basic Download (3 steps)

1. **Paste Video URL**
   - Copy YouTube/Vimeo/Instagram/TikTok link
   - Paste into the input field
   - Supported: 100+ platforms

2. **Click "Get Video Info"**
   - Wait for metadata to load (2-5 seconds)
   - See video title, thumbnail, duration
   - See available quality options

3. **Select Quality & Download**
   - Click quality button (e.g., "Best Available")
   - Click "Download Video" button
   - File downloads to your Downloads folder
   - Progress bar shows download status

### Quality Selection Guide

| Option | Best For | File Size | Speed |
|--------|----------|-----------|-------|
| Best Available | Maximum quality | Largest | Slowest |
| 1080p | Full HD viewing | Large | Moderate |
| 720p | HD viewing | Medium | Fast |
| 480p | Good quality | Small | Very Fast |
| 360p | Mobile viewing | Tiny | Instant |

### Example: Download YouTube Video

1. Go to YouTube video
2. Copy URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Paste into converter
4. Click "Get Video Info"
5. Select "Best Available"
6. Click "Download Video"
7. Video saved as `[title].mp4` in Downloads

---

## 🌐 Test Videos (Safe to Download)

Use these to test the application:

### YouTube
- **Title:** Me at the zoo
- **URL:** https://www.youtube.com/watch?v=jNQXAC9IVRw
- **Size:** ~2 MB
- **Duration:** 19 seconds

### Vimeo
- **URL:** https://vimeo.com/90509568
- **Quality:** Available options shown

### Other Platforms
- Instagram Reels
- TikTok videos
- Facebook videos
- Twitter videos
- And 90+ more...

---

## 🔧 Configuration

### Change Port

**Option 1: Command Line**
```bash
PORT=3001 npm start
```

**Option 2: Create .env file**
```env
PORT=3001
```

Then run:
```bash
npm start
```

### Disable Rate Limiting

Edit `server.js`:
```javascript
// Comment out these lines:
// app.use('/api/', limiter);
```

### Increase Request Timeout

Edit `.env`:
```env
REQUEST_TIMEOUT=600000  # 10 minutes
```

---

## 🐛 Troubleshooting

### Problem: "yt-dlp: command not found"

**Solution 1: Install yt-dlp**
```bash
pip install yt-dlp
```

**Solution 2: Add to PATH**

Windows:
1. Open Environment Variables
2. Edit PATH
3. Add Python Scripts folder
4. Restart terminal

**Solution 3: Use full path**

Windows:
```powershell
# Find where yt-dlp is installed
where yt-dlp.exe

# It's usually at:
# C:\Users\[username]\AppData\Local\Python\Python3xx\Scripts\yt-dlp.exe
```

### Problem: "Port 3000 already in use"

**Solution:**
```powershell
# Kill process on port 3000
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force

# Use different port
PORT=3001 npm start
```

### Problem: "Module not found"

**Solution:**
```bash
npm install
```

### Problem: "Video download fails"

**Checklist:**
- [ ] URL is correct and accessible
- [ ] yt-dlp is up to date: `pip install -U yt-dlp`
- [ ] Internet connection working
- [ ] Video is not region-restricted
- [ ] Video is not age-gated
- [ ] Sufficient disk space available

**Solution:**
```bash
# Update yt-dlp
pip install -U yt-dlp

# Test with command line
yt-dlp "https://www.youtube.com/watch?v=jNQXAC9IVRw"

# Check if it works, if yes, issue is with app
```

### Problem: "Large file downloads timeout"

**Increase timeout in server.js:**
```javascript
// In downloadVideo service:
timeout: 600000  // 10 minutes (increase if needed)
```

### Problem: "Browser doesn't download file"

**Checklist:**
- [ ] Browser download permissions enabled
- [ ] Disk space available
- [ ] Downloads folder accessible
- [ ] No antivirus blocking download
- [ ] Browser not blocking pop-ups

---

## 📱 Mobile Access

### Connect from Mobile Device

1. Find your computer's IP address

**Windows:**
```powershell
ipconfig
# Look for "IPv4 Address" like 192.168.1.100
```

**Mac/Linux:**
```bash
hostname -I
# or
ifconfig | grep "inet "
```

2. On mobile device, open browser and visit:
```
http://YOUR_IP_ADDRESS:3000
```

Example: `http://192.168.1.100:3000`

### Requirements
- Same WiFi network
- No firewall blocking port 3000
- Mobile browser (Chrome, Safari, Firefox)

---

## 📊 System Monitoring

### Check Server Health

**While running, you'll see logs like:**
```
📥 Starting download for: https://www.youtube.com/watch?v=...
📊 Format selected: bestvideo+bestaudio/best
✅ Video downloaded successfully: video.mp4 (1.95MB)
```

### Server Statistics

Monitor in console:
- Download count
- File sizes
- Success/failure rates
- Performance metrics

---

## 🚀 Deployment Options

### Deploy to Heroku

```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Add buildpacks
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/jonathanong/heroku-buildpack-ffmpeg-latest.git

# 5. Deploy
git push heroku main

# 6. View logs
heroku logs --tail
```

### Deploy with Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip ffmpeg
RUN pip install yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t video-converter .
docker run -p 3000:3000 video-converter
```

### Deploy to AWS

1. Launch EC2 instance (Ubuntu)
2. SSH into instance
3. Install Node.js and dependencies
4. Clone/upload project
5. Run `npm install && npm start`
6. Configure security group for port 3000

---

## 💾 Backup & Recovery

### Backup Downloaded Videos

```bash
# Create backup folder
mkdir video-backup

# Copy downloads
cp -r downloads/* video-backup/
```

### Restore Downloads

```bash
# Copy from backup
cp -r video-backup/* downloads/
```

### Clean Old Downloads

Manual cleanup:
```bash
# Remove downloads older than 1 hour
# (normally automatic)
rm -rf downloads/[timestamp]
```

---

## 📝 Common Usage Scenarios

### Scenario 1: Download YouTube Playlist

Currently: Download one video at a time  
Future: Batch download feature coming

**Current workaround:**
1. Copy first video URL → Download
2. Repeat for each video

### Scenario 2: Download Multiple Videos

1. Open multiple browser tabs
2. Each tab can handle separate download
3. Downloads happen concurrently

### Scenario 3: Download High Quality Video

1. Get video info
2. Select "Best Available"
3. Wait longer for larger file
4. Ensure disk space available

### Scenario 4: Download for Mobile

1. Select 480p or 360p quality
2. Faster download
3. Smaller file size
4. Perfect for phones

---

## ⚙️ Advanced Usage

### Update yt-dlp

```bash
pip install -U yt-dlp
# or
pip install --upgrade yt-dlp
```

### Check yt-dlp Version

```bash
yt-dlp --version
```

### List All Available Formats

```bash
yt-dlp -F "https://www.youtube.com/watch?v=..."
```

### Test Download (No Quality Selection)

```bash
yt-dlp "https://www.youtube.com/watch?v=..." -o "%(title)s.%(ext)s"
```

---

## 🔐 Security Best Practices

1. **Keep software updated**
   - Update Node.js
   - Update npm
   - Update yt-dlp

2. **Use HTTPS in production**
   - Add SSL certificate
   - Use Let's Encrypt

3. **Firewall configuration**
   - Restrict port 3000 to trusted IPs
   - Use VPN if public

4. **Respect copyright**
   - Only download videos you have permission to
   - Don't redistribute downloads

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Full project documentation |
| SETUP.md | Detailed setup guide |
| IMPROVEMENTS.md | v2.0 improvements (technical) |
| PROJECT_SUMMARY.md | Project overview |
| GETTING_STARTED.md | Quick start guide (this file) |

---

## 🆘 Getting Help

### Check Log Output

Look at console output when server is running:
- Error messages
- Download progress
- File locations

### Verify Installation

```bash
# Test each component
node --version       # Should work
npm --version        # Should work
yt-dlp --version     # Should show version
python --version     # Should work
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| EADDRINUSE | Port in use | Use different port |
| yt-dlp not found | Not installed | Install yt-dlp |
| EACCES | Permission denied | Check file permissions |
| ETIMEDOUT | Connection timeout | Check internet |
| ENOSPC | No disk space | Free up disk space |

---

## 📞 Final Checklist

Before using in production:
- [ ] All dependencies installed
- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can fetch video info (5+ videos tested)
- [ ] Can download video successfully
- [ ] File appears in Downloads folder
- [ ] Quality options display correctly
- [ ] Error handling works (invalid URLs)
- [ ] Rate limiting works (multiple requests)
- [ ] Old downloads cleaned up

---

## 🎉 You're Ready!

Everything is set up and ready to use. Start downloading videos now:

```bash
npm start
# Then visit: http://localhost:3000
```

**Enjoy! 🚀**

---

*For more information, see:*
- *README.md - Full documentation*
- *IMPROVEMENTS.md - Technical improvements*
- *PROJECT_SUMMARY.md - Project overview*

