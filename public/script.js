// API Base URL
const API_BASE = '/api';
let selectedFormat = null;
let currentVideoUrl = null;
let outputMode = 'video';

function setOutputMode(mode) {
    if (!['video', 'audio'].includes(mode)) return;

    outputMode = mode;

    document.querySelectorAll('[data-output-mode]').forEach(button => {
        const isSelected = button.dataset.outputMode === mode;
        button.classList.toggle('active', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
    });

    const isAudio = mode === 'audio';
    document.getElementById('qualitySection').style.display = isAudio ? 'none' : '';
    document.getElementById('audioNote').style.display = isAudio ? 'flex' : 'none';
    document.getElementById('downloadBtn').innerHTML = isAudio
        ? '<span class="btn-icon" aria-hidden="true">↓</span> Download audio'
        : '<span class="btn-icon" aria-hidden="true">↓</span> Download video';

    if (document.getElementById('infoSection').style.display !== 'none' && !isAudio) {
        document.getElementById('qualityError').style.display = 'none';
    }
}

// Get Video Info
async function getVideoInfo() {
    const url = document.getElementById('videoUrl').value.trim();
    const urlError = document.getElementById('urlError');
    const infoSection = document.getElementById('infoSection');
    const loadingSection = document.getElementById('loadingSection');

    // Clear previous errors
    urlError.style.display = 'none';
    infoSection.style.display = 'none';

    // Validate URL
    if (!url) {
        showError('urlError', 'Please enter a video URL');
        return;
    }

    if (!isValidUrl(url)) {
        showError('urlError', 'Please enter a valid URL');
        return;
    }

    currentVideoUrl = url;

    // Show loading
    loadingSection.style.display = 'block';
    document.getElementById('loadingText').textContent = 'Fetching video information...';

    try {
        const response = await fetch(`${API_BASE}/video/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        loadingSection.style.display = 'none';

        if (!response.ok || !data.success) {
            showError('urlError', data.error || 'Failed to fetch video information');
            return;
        }

        // Display video info
        displayVideoInfo(data);
        infoSection.style.display = 'block';
        selectedFormat = null; // Reset selected format
        setOutputMode(outputMode);
    } catch (error) {
        loadingSection.style.display = 'none';
        showError('urlError', 'Network error: ' + error.message);
    }
}

// Display Video Information
function displayVideoInfo(data) {
    document.getElementById('thumbnail').src = data.thumbnail || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22200%22 height=%22150%22/%3E%3C/svg%3E';
    document.getElementById('videoTitle').textContent = data.title;
    document.getElementById('uploader').textContent = data.uploader;
    document.getElementById('duration').textContent = formatDuration(data.duration);
    document.getElementById('uploadDate').textContent = formatDate(data.uploadDate);

    // Display formats
    const formatsList = document.getElementById('formatsList');
    formatsList.innerHTML = '';

    if (data.formats && data.formats.length > 0) {
        data.formats.forEach((format, index) => {
            const formatBtn = document.createElement('button');
            formatBtn.className = 'format-option';
            
            let label = format.label;
            if (format.note) {
                label += `<br><small>${format.note}</small>`;
            }
            formatBtn.innerHTML = label;
            
            formatBtn.onclick = (e) => {
                e.preventDefault();
                selectFormat(format.value, formatBtn);
            };
            
            // Select first format by default
            if (index === 0) {
                formatBtn.classList.add('selected');
                selectedFormat = format.value;
            }

            formatsList.appendChild(formatBtn);
        });
    } else {
        document.getElementById('qualityError').textContent = 'No video formats found';
        document.getElementById('qualityError').style.display = 'block';
    }
}

// Select Format
function selectFormat(formatId, element) {
    // Remove previous selection
    document.querySelectorAll('.format-option').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selection to clicked element
    element.classList.add('selected');
    selectedFormat = formatId;
    document.getElementById('qualityError').style.display = 'none';
}

// Download Video
async function downloadMedia() {
    if (!currentVideoUrl) {
        showError('qualityError', 'Please enter a video URL first');
        return;
    }

    if (outputMode === 'video' && !selectedFormat) {
        showError('qualityError', 'Please select a video quality');
        return;
    }

    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing download...';

    const progressSection = document.getElementById('progressSection');
    progressSection.style.display = 'block';
    document.getElementById('progressTitle').textContent = outputMode === 'audio'
        ? 'Preparing your audio...'
        : 'Preparing your video...';

    try {
        // Start download on backend
        console.log(`Initiating ${outputMode} download...`);
        
        const response = await fetch(`${API_BASE}/video/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: currentVideoUrl,
                format: selectedFormat,
                mode: outputMode
            })
        });

        // Simulate progress while downloading
        simulateProgress();

        const data = await response.json();

        if (!response.ok || !data.success) {
            progressSection.style.display = 'none';
            showDownloadError(data.error || 'Download failed');
            downloadBtn.disabled = false;
            setOutputMode(outputMode);
            return;
        }

        console.log(` ${outputMode} downloaded successfully!`);
        console.log('📁 File:', data.filename);
        console.log('💾 Size:', data.fileSizeMB + ' MB');

        // Download the file from server
        downloadFileFromServer(data.filePath, data.filename);

        setTimeout(() => {
            progressSection.style.display = 'none';
            showSuccess(`${outputMode === 'audio' ? 'Audio' : 'Video'} download started. (${data.fileSizeMB} MB)`);
            downloadBtn.disabled = false;
            setOutputMode(outputMode);
        }, 2000);

    } catch (error) {
        progressSection.style.display = 'none';
        showDownloadError('Download failed: ' + error.message);
        downloadBtn.disabled = false;
        setOutputMode(outputMode);
    }
}

// Download file from server
async function downloadFileFromServer(filePath, filename) {
    try {
        // Create a temporary form to post and download
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `${API_BASE}/video/file`;
        form.style.display = 'none';

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'filePath';
        input.value = filePath;

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
}

// Simulate Progress
function simulateProgress() {
    const progressFill = document.getElementById('progressFill');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 90) progress = 90;
        progressFill.style.width = progress + '%';
        progressFill.textContent = Math.round(progress) + '%';

        if (progress >= 90) {
            clearInterval(interval);
        }
    }, 800);

    // Complete after 15 seconds (simulated)
    setTimeout(() => {
        progressFill.style.width = '100%';
        progressFill.textContent = '100%';
    }, 15000);
}

// Show Error Message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

// Show Success Message
function showSuccess(message) {
    const successSection = document.getElementById('successSection');
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successSection.style.display = 'block';
}

// Show Download Error
function showDownloadError(error) {
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = error || 'An error occurred during the download.';
    errorSection.style.display = 'block';
}

// Reset Form
function resetForm() {
    document.getElementById('videoUrl').value = '';
    document.getElementById('urlError').style.display = 'none';
    document.getElementById('infoSection').style.display = 'none';
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('successSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'none';
    selectedFormat = null;
    currentVideoUrl = null;
    setOutputMode('video');
}

// Format Duration
function formatDuration(seconds) {
    if (!seconds) return 'Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Format Date
function formatDate(dateString) {
    if (!dateString || dateString === 'Unknown') return 'Unknown';
    try {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateString;
    }
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Allow Enter key to get video info
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('videoUrl');
    urlInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            getVideoInfo();
        }
    });
});
