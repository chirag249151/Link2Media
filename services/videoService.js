import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import { execSync } from 'child_process';
import fs from 'fs';
import { createReadStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execFileAsync = promisify(execFile);

// Find yt-dlp executable
function findYtDlpPath() {
  try {
    if (os.platform() === 'win32') {
      const result = execSync('where yt-dlp.exe', { encoding: 'utf-8' }).trim();
      if (result) return result.split('\n')[0];
    } else {
      const result = execSync('which yt-dlp', { encoding: 'utf-8' }).trim();
      if (result) return result;
    }
  } catch (e) {
    // yt-dlp not in PATH, try common installation locations
  }

  // Try common installation paths for Windows
  if (os.platform() === 'win32') {
    const commonPaths = [
      `${os.homedir()}\\AppData\\Local\\Python\\pythoncore-3.14-64\\Scripts\\yt-dlp.exe`,
      `${os.homedir()}\\AppData\\Local\\Python\\Python314\\Scripts\\yt-dlp.exe`,
      `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Python\\Python314\\Scripts\\yt-dlp.exe`,
    ];
    
    for (const p of commonPaths) {
      try {
        execSync(`"${p}" --version`, { stdio: 'ignore' });
        return p;
      } catch (e) {
        // Continue to next path
      }
    }
  }

  // Default fallback
  return os.platform() === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
}

function findFFmpegPath() {
  try {
    const command = os.platform() === 'win32' ? 'where ffmpeg.exe' : 'which ffmpeg';
    const result = execSync(command, { encoding: 'utf-8' }).trim();
    if (result) return path.dirname(result.split(/\r?\n/)[0]);
  } catch (error) {
    // FFmpeg is not in PATH; check the standard per-user WinGet location on Windows.
  }

  if (os.platform() === 'win32') {
    const packagesPath = path.join(
      os.homedir(),
      'AppData',
      'Local',
      'Microsoft',
      'WinGet',
      'Packages'
    );

    try {
      const packageName = fs.readdirSync(packagesPath)
        .find(name => name.startsWith('Gyan.FFmpeg_'));
      if (packageName) {
        const packagePath = path.join(packagesPath, packageName);
        for (const buildName of fs.readdirSync(packagePath)) {
          const binPath = path.join(packagePath, buildName, 'bin');
          if (fs.existsSync(path.join(binPath, 'ffmpeg.exe'))) return binPath;
        }
      }
    } catch (error) {
      // FFmpeg is optional; yt-dlp will report if a selected format needs it.
    }
  }

  return null;
}

const YT_DLP_PATH = findYtDlpPath();
const FFMPEG_PATH = findFFmpegPath();
const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

function getYtDlpErrorMessage(error, action) {
  if (error.killed || error.code === 'ETIMEDOUT') {
    return `Timed out while ${action}. The video site may be slow; please try again.`;
  }

  const details = error.stderr?.trim();
  if (/sign in to confirm you're not a bot|confirm you're not a bot/i.test(details || error.message || '')) {
    return 'YouTube is blocking automated requests from this hosted server. The link may work when you run the app locally, but some videos may still require YouTube sign-in. Do not upload personal browser cookies to this public website.';
  }

  return details || error.message || `Failed while ${action}.`;
}

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

export class VideoService {
  /**
   * Get video information including title, duration, and available quality options
   */
  static async getVideoInfo(url) {
    try {
      const { stdout } = await execFileAsync(YT_DLP_PATH, [
        '--force-ipv4',
        '-j',
        '--no-warnings',
        url
      ], {
        maxBuffer: 10 * 1024 * 1024,
        timeout: 90000,
        windowsHide: true,
        encoding: 'utf8'
      });

      const data = JSON.parse(stdout);
      
      // Extract best quality combinations (video + audio)
      const formats = this.getBestFormats(data.formats || []);
      
      return {
        success: true,
        title: data.title || 'Unknown',
        duration: data.duration || 0,
        thumbnail: data.thumbnail || null,
        formats: formats,
        uploader: data.uploader || 'Unknown',
        uploadDate: data.upload_date || 'Unknown'
      };
    } catch (error) {
      console.error('Video info error:', error.stderr?.trim() || error.message);
      return {
        success: false,
        error: getYtDlpErrorMessage(error, 'fetching video information')
      };
    }
  }

  /**
   * Get best format combinations (video + audio merged)
   * Returns quality presets that yt-dlp will automatically merge
   */
  static getBestFormats(formats) {
    const videoHeights = new Set();
    
    // Collect available video heights
    formats.forEach(format => {
      if (format.vcodec && format.vcodec !== 'none' && format.height) {
        videoHeights.add(format.height);
      }
    });

    // Sort heights in descending order
    const sortedHeights = Array.from(videoHeights).sort((a, b) => b - a);

    // Create quality options with yt-dlp format selection
    const qualityOptions = [];
    const qualityLabels = {
      2160: '4K (2160p)',
      1440: '2K (1440p)',
      1080: '1080p (Full HD)',
      720: '720p (HD)',
      480: '480p (SD)',
      360: '360p (Mobile)',
      240: '240p'
    };

    sortedHeights.forEach(height => {
      const label = qualityLabels[height] || `${height}p`;
      
      // Use yt-dlp's format selection: bestvideo[height<=X]+bestaudio
      // This ensures we get video + audio merged at the specified quality
      qualityOptions.push({
        label: label + ' (Best Quality)',
        value: `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`,
        quality: height,
        note: 'Includes best audio'
      });
    });

    // Add highest available quality option
    if (sortedHeights.length > 0) {
      qualityOptions.unshift({
        label: `Best Available (${qualityLabels[sortedHeights[0]] || sortedHeights[0] + 'p'})`,
        value: 'bestvideo+bestaudio/best',
        quality: sortedHeights[0],
        note: 'Highest available quality'
      });
    }

    return qualityOptions;
  }

  /**
   * Download video with specified quality and stream to client
   */
  static async downloadVideo(url, format = 'bestvideo+bestaudio/best', mode = 'video') {
    const tempDir = path.join(DOWNLOADS_DIR, Date.now().toString());
    
    try {
      if (!['video', 'audio'].includes(mode)) {
        throw new Error('Output mode must be video or audio');
      }

      // Create temp directory for this download
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Output template
      const outputTemplate = path.join(tempDir, '%(title)s.%(ext)s');
      
      // Build command with format and output template
      const args = [
        '--force-ipv4',
        '-f',
        mode === 'audio' ? 'bestaudio' : format,
        '-o',
        outputTemplate,
        '--no-warnings',
        url
      ];

      if (FFMPEG_PATH) {
        args.unshift('--ffmpeg-location', FFMPEG_PATH);
      }

      if (mode === 'video') {
        args.splice(5, 0, '--merge-output-format', 'mp4');
      }

      console.log(`Downloading ${mode}${mode === 'video' ? ` with format: ${format}` : ''}`);

      const { stdout, stderr } = await execFileAsync(YT_DLP_PATH, args, {
        maxBuffer: 50 * 1024 * 1024,
        timeout: 600000, // 10 minutes timeout
        cwd: tempDir,
        windowsHide: true,
        encoding: 'utf8'
      });

      // Find the downloaded file
      const files = fs.readdirSync(tempDir);
      const supportedExtensions = mode === 'audio'
        ? ['.m4a', '.mp3', '.opus', '.aac', '.wav', '.flac', '.ogg', '.webm']
        : ['.mp4', '.mkv', '.webm', '.mov'];
      const completedFiles = files.filter(file => !/\.f\d+\./i.test(file) && !file.endsWith('.part'));
      const videoFile = completedFiles.find(file =>
        supportedExtensions.some(extension => file.toLowerCase().endsWith(extension))
      );

      if (!videoFile) {
        if (mode === 'video' && files.some(file => /\.f\d+\./i.test(file))) {
          throw new Error('FFmpeg is required to combine the selected video and audio streams. Install FFmpeg, add it to PATH, and try again.');
        }
        throw new Error(`${mode === 'audio' ? 'Audio' : 'Video'} file not found after download`);
      }

      const filePath = path.join(tempDir, videoFile);
      const fileSize = fs.statSync(filePath).size;
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

      console.log(`✅ ${mode === 'audio' ? 'Audio' : 'Video'} downloaded successfully: ${videoFile} (${fileSizeMB}MB)`);

      return {
        success: true,
        message: `${mode === 'audio' ? 'Audio' : 'Video'} downloaded successfully`,
        filename: videoFile,
        filePath: filePath,
        fileSize: fileSize,
        fileSizeMB: fileSizeMB,
        tempDir: tempDir
      };
    } catch (error) {
      console.error('Download error:', error.stderr?.trim() || error.message);
      
      // Cleanup temp directory on error
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (e) {
        // Ignore cleanup errors
      }

      return {
        success: false,
        error: getYtDlpErrorMessage(error, 'downloading the video')
      };
    }
  }

  /**
   * Get file for streaming/download
   */
  static getDownloadFile(filePath) {
    try {
      const resolvedPath = path.resolve(filePath);
      const relativePath = path.relative(DOWNLOADS_DIR, resolvedPath);

      if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        return {
          success: false,
          error: 'File is outside the downloads directory'
        };
      }

      if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
        return {
          success: false,
          error: 'File not found'
        };
      }

      const fileSize = fs.statSync(resolvedPath).size;
      const filename = path.basename(resolvedPath);

      return {
        success: true,
        filePath: resolvedPath,
        filename: filename,
        fileSize: fileSize,
        stream: createReadStream(resolvedPath)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cleanup old downloads (older than 1 hour)
   */
  static cleanupOldDownloads() {
    try {
      const dirs = fs.readdirSync(DOWNLOADS_DIR);
      const now = Date.now();
      const ONE_HOUR = 60 * 60 * 1000;

      dirs.forEach(dir => {
        const dirPath = path.join(DOWNLOADS_DIR, dir);
        const stats = fs.statSync(dirPath);
        
        if (now - stats.mtimeMs > ONE_HOUR) {
          fs.rmSync(dirPath, { recursive: true, force: true });
          console.log(`Cleaned up old download: ${dir}`);
        }
      });
    } catch (error) {
      console.error('Cleanup error:', error.message);
    }
  }

  /**
   * Validate video URL
   */
  static async validateUrl(url) {
    try {
      const { stdout } = await execAsync(`${YT_DLP_PATH} --no-warnings -e "${url}"`, {
        maxBuffer: 1024 * 1024,
        timeout: 15000,
        shell: true
      });

      return {
        valid: !!stdout,
        error: null
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid URL or video not accessible'
      };
    }
  }
}

// Cleanup old downloads every hour
setInterval(() => {
  VideoService.cleanupOldDownloads();
}, 60 * 60 * 1000);

// Initial cleanup
VideoService.cleanupOldDownloads();
