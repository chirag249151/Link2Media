import { VideoService } from '../services/videoService.js';
import path from 'path';

export async function getVideoInfo(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Video URL is required'
      });
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    const videoInfo = await VideoService.getVideoInfo(url);
    res.json(videoInfo);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
}

export async function downloadVideo(req, res) {
  try {
    const { url, format, mode = 'video' } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'Video URL is required'
      });
    }

    if (!['video', 'audio'].includes(mode)) {
      return res.status(400).json({
        success: false,
        error: 'Output mode must be video or audio'
      });
    }

    if (mode === 'video' && !format) {
      return res.status(400).json({
        success: false,
        error: 'Video format is required'
      });
    }

    // Send initial status
    res.setHeader('Content-Type', 'application/json');
    
    console.log(`📥 Starting download for: ${url}`);
    console.log(`📊 Output selected: ${mode}${mode === 'video' ? ` (${format})` : ''}`);

    const result = await VideoService.downloadVideo(url, format, mode);

    if (!result.success) {
      return res.json({
        success: false,
        error: result.error
      });
    }

    // Send success response with file info
    res.json({
      success: true,
      message: `${mode === 'audio' ? 'Audio' : 'Video'} ready for download`,
      filename: result.filename,
      filePath: result.filePath,
      fileSize: result.fileSize,
      fileSizeMB: result.fileSizeMB
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Download failed: ' + error.message
    });
  }
}

export async function getFile(req, res) {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'File path is required'
      });
    }

    const fileInfo = VideoService.getDownloadFile(filePath);

    if (!fileInfo.success) {
      return res.status(404).json({
        success: false,
        error: fileInfo.error
      });
    }

    // Set a standards-compliant attachment header, including for Unicode filenames.
    res.attachment(fileInfo.filename);
    res.setHeader('Content-Length', fileInfo.fileSize);

    // Stream the file to the client
    fileInfo.stream.pipe(res);

    fileInfo.stream.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(500).json({
        success: false,
        error: 'Error streaming file'
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error: ' + error.message
    });
  }
}
