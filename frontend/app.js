document.addEventListener("DOMContentLoaded", () => {
    // --- STATE VARIABLES ---
    let selectedFile = null;
    let selectedFileSource = null; // 'upload' or 'record'
    let mediaRecorder = null;
    let audioChunks = [];
    let recordTimerInterval = null;
    let recordStartTime = null;
    let isRecording = false;
    let isInitializingRecord = false; // Prevents race conditions during getUserMedia async call

    // --- DOM ELEMENTS ---
    // Connection Settings
    const settingsToggle = document.getElementById("settings-toggle");
    const settingsCard = document.querySelector(".settings-card");
    const apiUrlInput = document.getElementById("api-url-input");
    const apiTestBtn = document.getElementById("api-test-btn");
    const statusDot = document.getElementById("status-dot");
    const statusText = document.getElementById("status-text");
    const demoModeCheckbox = document.getElementById("demo-mode-checkbox");

    // Input Tabs
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    // Upload Pane
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");

    // Recording Pane
    const recordBtn = document.getElementById("record-btn");
    const recordTimer = document.getElementById("record-timer");
    const recordingWave = document.getElementById("recording-wave");
    const recorderStatus = document.getElementById("recorder-status");

    // Audio Preview
    const audioPreviewSection = document.getElementById("audio-preview-section");
    const previewFilename = document.getElementById("preview-filename");
    const previewFilesize = document.getElementById("preview-filesize");
    const audioPlayer = document.getElementById("audio-player");
    const btnRemoveAudio = document.getElementById("btn-remove-audio");
    const analyzeBtn = document.getElementById("analyze-btn");

    // Results States
    const resultsCard = document.getElementById("results-card");
    const stateIdle = document.getElementById("state-idle");
    const stateLoading = document.getElementById("state-loading");
    const stateSuccess = document.getElementById("state-success");
    const stateError = document.getElementById("state-error");

    // Success Report elements
    const stressBadge = document.getElementById("stress-badge");
    const gaugePct = document.getElementById("gauge-pct");
    const gaugeFill = document.getElementById("gauge-fill");
    const gaugeSection = document.querySelector(".radial-gauge");
    const stressedBarPct = document.getElementById("stressed-bar-pct");
    const stressedBarFill = document.getElementById("stressed-bar-fill");
    const unstressedBarPct = document.getElementById("unstressed-bar-pct");
    const unstressedBarFill = document.getElementById("unstressed-bar-fill");
    const metaDuration = document.getElementById("meta-duration");
    const metaSr = document.getElementById("meta-sr");
    const metaFilename = document.getElementById("meta-filename");
    const recTitle = document.getElementById("rec-title");
    const recDesc = document.getElementById("rec-desc");
    const resetAnalysisBtn = document.getElementById("reset-analysis-btn");

    // Error elements
    const errorMessage = document.getElementById("error-message");
    const errorRetryBtn = document.getElementById("error-retry-btn");

    // --- INITIALIZE ---
    // Load saved API URL if exists
    const savedApiUrl = localStorage.getItem("mindwave_api_url");
    if (savedApiUrl) {
        apiUrlInput.value = savedApiUrl;
    }
    
    // Check API Status immediately
    checkApiStatus();

    // Toggle settings collapse
    settingsToggle.addEventListener("click", () => {
        settingsCard.classList.toggle("collapsed");
    });

    // Test API URL connection
    apiTestBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent toggling settings card
        localStorage.setItem("mindwave_api_url", apiUrlInput.value.trim());
        checkApiStatus();
    });

    // --- API HEALTH CHECK ---
    async function checkApiStatus() {
        const url = apiUrlInput.value.trim();
        statusDot.className = "status-dot loading";
        statusText.textContent = "Testing API connection...";

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

            const response = await fetch(url, { 
                method: "GET", 
                signal: controller.signal,
                mode: "cors"
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                statusDot.className = "status-dot online";
                statusText.textContent = "API Status: Online";
                logger("API connected successfully.");
            } else {
                throw new Error("HTTP error " + response.status);
            }
        } catch (err) {
            statusDot.className = "status-dot offline";
            statusText.textContent = "API Status: Offline";
            logger("API connection failed: " + err.message);
        }
    }

    // --- TABS SWITCHING ---
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active classes
            tabButtons.forEach(b => b.classList.remove("active"));
            tabPanes.forEach(pane => pane.classList.remove("active"));

            // Add active classes
            btn.classList.add("active");
            const tabId = "tab-" + btn.dataset.tab;
            document.getElementById(tabId).classList.add("active");

            // Stop recording if active and switching tabs
            if (btn.dataset.tab !== "record" && isRecording) {
                stopRecording();
            }
        });
    });

    // --- FILE UPLOAD LOGIC ---
    // Handle drop zone clicks
    dropZone.addEventListener("click", () => fileInput.click());

    // Dragover effects
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        
        if (e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0], 'upload');
        }
    });

    // File input selection
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0], 'upload');
        }
    });

    // Process selected file
    function handleFileSelection(file, source) {
        // Validation (Max 15MB)
        const maxSizeBytes = 15 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            alert("File is too large! Maximum allowed audio size is 15MB.");
            return;
        }

        selectedFile = file;
        selectedFileSource = source;

        // Render audio metadata on preview card
        previewFilename.textContent = file.name;
        previewFilesize.textContent = formatBytes(file.size);

        // Bind source file to preview audio element
        const fileUrl = URL.createObjectURL(file);
        audioPlayer.src = fileUrl;
        audioPlayer.load();

        // Reveal audio preview section
        audioPreviewSection.style.display = "block";
        
        // Dynamic scroll to review audio
        audioPreviewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Remove file button handler
    btnRemoveAudio.addEventListener("click", () => {
        removeSelectedAudio();
    });

    function removeSelectedAudio() {
        selectedFile = null;
        selectedFileSource = null;
        audioPlayer.src = "";
        audioPreviewSection.style.display = "none";
        fileInput.value = "";
        
        // Reset results display to idle
        showResultState('idle');
    }

    // Helper: format bytes size
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // --- LIVE MICROPHONE RECORDING LOGIC ---
    recordBtn.addEventListener("click", () => {
        if (isInitializingRecord) return; // Prevent multiple clicks during permission setup

        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    async function startRecording() {
        isInitializingRecord = true;
        audioChunks = [];
        recordBtn.disabled = true; // Temporary disable button
        recorderStatus.textContent = "Initializing microphone...";

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // setup state after user grants microphone permission
            isRecording = true;
            recordBtn.disabled = false;
            recordBtn.classList.add("recording");
            recordingWave.classList.add("active");
            recorderStatus.textContent = "Recording... Click microphone to stop";

            // Set up MediaRecorder (use webm or ogg depending on browser support)
            let options = { mimeType: 'audio/webm' };
            if (!MediaRecorder.isTypeSupported('audio/webm')) {
                options = { mimeType: 'audio/ogg' };
                if (!MediaRecorder.isTypeSupported('audio/ogg')) {
                    options = {}; // Fallback to browser default
                }
            }

            mediaRecorder = new MediaRecorder(stream, options);
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const mimeType = mediaRecorder.mimeType || 'audio/webm';
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                
                // Construct a file object
                let extension = 'webm';
                if (mimeType.includes('ogg')) extension = 'ogg';
                else if (mimeType.includes('wav')) extension = 'wav';
                
                const recordedFile = new File(
                    [audioBlob], 
                    `voice-recording-${Date.now()}.${extension}`, 
                    { type: mimeType }
                );

                handleFileSelection(recordedFile, 'record');
                
                // Stop all tracks on the stream to release the mic icon
                stream.getTracks().forEach(track => track.stop());
            };

            // Start recording and update timer
            mediaRecorder.start();
            recordStartTime = Date.now();
            updateRecordTimer();
            recordTimerInterval = setInterval(updateRecordTimer, 1000);

        } catch (err) {
            console.error("Microphone capture failed:", err);
            isRecording = false;
            recordBtn.disabled = false;
            recordBtn.classList.remove("recording");
            recordingWave.classList.remove("active");
            recorderStatus.textContent = "Microphone access denied.";
            alert("Could not access microphone. Please verify recording permissions.");
        } finally {
            isInitializingRecord = false;
        }
    }

    function stopRecording() {
        if (!isRecording) return;

        isRecording = false;
        recordBtn.classList.remove("recording");
        recordingWave.classList.remove("active");
        recorderStatus.textContent = "Recording stopped. Preview file below.";

        clearInterval(recordTimerInterval);
        recordTimer.textContent = "00:00";

        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
    }

    function updateRecordTimer() {
        const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const secs = String(elapsed % 60).padStart(2, "0");
        recordTimer.textContent = `${mins}:${secs}`;
    }

    // --- STATE TRANSLATOR (RESULT PANEL) ---
    function showResultState(state) {
        stateIdle.style.display = "none";
        stateLoading.style.display = "none";
        stateSuccess.style.display = "none";
        stateError.style.display = "none";

        if (state === 'idle') stateIdle.style.display = "flex";
        else if (state === 'loading') stateLoading.style.display = "flex";
        else if (state === 'success') stateSuccess.style.display = "flex";
        else if (state === 'error') stateError.style.display = "flex";
    }

    // --- ACTION ANALYZE ---
    analyzeBtn.addEventListener("click", () => {
        if (!selectedFile) return;
        performDiagnostic(selectedFile);
    });

    async function performDiagnostic(file) {
        showResultState('loading');
        
        // Button loading indicators
        analyzeBtn.disabled = true;
        analyzeBtn.querySelector(".btn-text").style.display = "none";
        analyzeBtn.querySelector(".spinner").style.display = "inline-block";

        // --- OFFLINE DEMO MODE SIMULATION ---
        if (demoModeCheckbox && demoModeCheckbox.checked) {
            setTimeout(() => {
                const isMockStressed = Math.random() > 0.5;
                const mockConfidence = 0.72 + Math.random() * 0.23; // 72% to 95%
                const mockResult = {
                    success: true,
                    filename: file.name,
                    prediction: isMockStressed ? "STRESSED" : "UNSTRESSED",
                    confidence: mockConfidence,
                    probabilities: {
                        "STRESSED": isMockStressed ? mockConfidence : (1 - mockConfidence),
                        "UNSTRESSED": isMockStressed ? (1 - mockConfidence) : mockConfidence
                    },
                    audio_metadata: {
                        duration_seconds: 3.5 + Math.round(Math.random() * 5),
                        sampling_rate: 16000,
                        samples_count: 56000
                    }
                };
                
                // Restore button state
                analyzeBtn.disabled = false;
                analyzeBtn.querySelector(".btn-text").style.display = "inline-block";
                analyzeBtn.querySelector(".spinner").style.display = "none";
                
                renderDiagnosticResult(mockResult);
            }, 2000); // Simulated delay
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const apiUrl = apiUrlInput.value.trim() + "/predict";
        
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData,
                mode: "cors"
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || `Server error: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                renderDiagnosticResult(result);
            } else {
                throw new Error("API returned success = false");
            }
        } catch (err) {
            console.error("Analysis API failed:", err);
            let msg = err.message || "Failed to establish a connection with the backend server.";
            if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
                msg = "API Connection Failed. Please make sure the FastAPI backend is running locally at " + apiUrlInput.value.trim() + " (run 'python backend/main.py') or check your deployment. Alternatively, enable 'Offline Demo Mode' in the settings panel above to test the visual report dashboard.";
            }
            errorMessage.textContent = msg;
            showResultState('error');
        } finally {
            // Restore button state
            analyzeBtn.disabled = false;
            analyzeBtn.querySelector(".btn-text").style.display = "inline-block";
            analyzeBtn.querySelector(".spinner").style.display = "none";
        }
    }

    // --- RENDER DIAGNOSTIC SUCCESS REPORT ---
    function renderDiagnosticResult(data) {
        showResultState('success');
        
        const isStressed = data.prediction === "STRESSED";
        
        // Reset classes
        stateSuccess.className = "result-state state-success " + (isStressed ? "stressed" : "unstressed");
        gaugeSection.className = "radial-gauge " + (isStressed ? "stressed" : "unstressed");
        stressBadge.className = "result-badge " + (isStressed ? "stressed" : "unstressed");
        stressBadge.textContent = data.prediction;

        // Render Percentage Gauge
        const confidencePct = Math.round(data.confidence * 100);
        gaugePct.textContent = `${confidencePct}%`;
        
        // SVG circle perimeter is 2 * PI * r = 2 * 3.14159 * 50 = 314
        const strokeDashOffset = 314 - (314 * (confidencePct / 100));
        gaugeFill.style.strokeDashoffset = strokeDashOffset;

        // Render Breakdown Bars
        const stressedProb = Math.round(data.probabilities.STRESSED * 100);
        const unstressedProb = Math.round(data.probabilities.UNSTRESSED * 100);

        stressedBarPct.textContent = `${stressedProb}%`;
        stressedBarFill.style.width = `${stressedProb}%`;

        unstressedBarPct.textContent = `${unstressedProb}%`;
        unstressedBarFill.style.width = `${unstressedProb}%`;

        // Render Audio Metadata
        metaDuration.textContent = `${data.audio_metadata.duration_seconds}s`;
        metaSr.textContent = `${data.audio_metadata.sampling_rate / 1000} kHz`;
        metaFilename.textContent = data.filename;

        // Display Recommendations
        if (isStressed) {
            recTitle.textContent = "Elevated Stress Detected";
            recDesc.textContent = "Your vocal rhythm and sub-harmonic variations show indices of vocal tension. Consider practicing box breathing: inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds. Repeat 3 times to assist in reducing physical stress levels.";
        } else {
            recTitle.textContent = "Vocal Balance Verified";
            recDesc.textContent = "Your speech patterns demonstrate low tension and a regular vocal harmonic balance. Continue to maintain a calm and steady respiratory rhythm to support this relaxed state.";
        }

        // Scroll to results card on small displays
        resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- RETRY & RESET HANDLERS ---
    resetAnalysisBtn.addEventListener("click", () => {
        removeSelectedAudio();
    });

    errorRetryBtn.addEventListener("click", () => {
        if (selectedFile) {
            performDiagnostic(selectedFile);
        } else {
            showResultState('idle');
        }
    });

    // Helper: System Logger
    function logger(message) {
        console.log(`[MindWave] ${message}`);
    }
});
