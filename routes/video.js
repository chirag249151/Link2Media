import express from 'express';
import { getVideoInfo, downloadVideo, getFile } from '../controllers/videoController.js';

const router = express.Router();

// Get video information and available qualities
router.post('/info', getVideoInfo);

// Download video (initiates download)
router.post('/download', downloadVideo);

// Get file stream (actual file download)
router.post('/file', getFile);

export default router;
