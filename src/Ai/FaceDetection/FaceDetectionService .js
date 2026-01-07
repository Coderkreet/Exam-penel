import * as faceapi from '@vladmandic/face-api';

class FaceDetectionService {
    constructor() {
        this.isModelLoaded = false;
        this.referenceDescriptor = null;
        this.canvas = null;
        this.video = null;
        this.referenceDescriptors = [];
        this.detectionHistory = [];
        this.faceMatcher = null;
        this.detectionQuality = {
            totalFrames: 0,
            successfulFrames: 0,
            averageConfidence: 0,
            confidenceSum: 0
        };

        // Prevention flags
        this.isVideoElementSet = false;
        this.isCanvasElementSet = false;
        this.referenceImageCaptured = false;
        this.previousVideoElement = null;
        this.previousCanvasElement = null;

        // **NEW: Session storage keys**
        this.STORAGE_KEYS = {
            REFERENCE_DESCRIPTORS: 'face_reference_descriptors',
            REFERENCE_CAPTURED: 'face_reference_captured',
            REFERENCE_METADATA: 'face_reference_metadata'
        };

        // **NEW: Load stored reference on initialization**
        this.loadStoredReference();
    }

    // **NEW: Load stored reference from session storage**
    loadStoredReference() {
        try {
            const storedDescriptors = sessionStorage.getItem(this.STORAGE_KEYS.REFERENCE_DESCRIPTORS);
            const storedCaptured = sessionStorage.getItem(this.STORAGE_KEYS.REFERENCE_CAPTURED);
            const storedMetadata = sessionStorage.getItem(this.STORAGE_KEYS.REFERENCE_METADATA);

            if (storedDescriptors && storedCaptured === 'true') {
                const descriptorData = JSON.parse(storedDescriptors);
                const metadata = storedMetadata ? JSON.parse(storedMetadata) : {};

                // Convert array back to Float32Array format for face-api
                this.referenceDescriptors = descriptorData.map(desc => new Float32Array(desc));
                this.referenceDescriptor = this.referenceDescriptors[0];
                this.referenceImageCaptured = true;

                // Recreate face matcher
                if (this.referenceDescriptors.length > 0) {
                    const labeledDescriptors = new faceapi.LabeledFaceDescriptors(
                        'authorized_user',
                        this.referenceDescriptors
                    );
                    this.faceMatcher = new faceapi.FaceMatcher([labeledDescriptors], 0.5);
                }

                // console.log(`✅ Loaded stored face reference with ${this.referenceDescriptors.length} descriptors from session`);
                // console.log('📋 Reference metadata:', metadata);
            } else {
                // console.log('ℹ️ No stored face reference found in session');
            }
        } catch (error) {
            console.error('❌ Error loading stored reference:', error);
            this.clearStoredReference();
        }
    }

    // **NEW: Save reference to session storage**
    saveReferenceToStorage(samples) {
        try {
            // Convert Float32Array to regular array for JSON storage
            const descriptorArrays = samples.map(sample => Array.from(sample.descriptor));
            
            const metadata = {
                samplesCount: samples.length,
                capturedAt: new Date().toISOString(),
                detectionScores: samples.map(s => s.detection.score),
                threshold: 0.5
            };

            sessionStorage.setItem(this.STORAGE_KEYS.REFERENCE_DESCRIPTORS, JSON.stringify(descriptorArrays));
            sessionStorage.setItem(this.STORAGE_KEYS.REFERENCE_CAPTURED, 'true');
            sessionStorage.setItem(this.STORAGE_KEYS.REFERENCE_METADATA, JSON.stringify(metadata));

            // console.log('💾 Face reference saved to session storage');
        } catch (error) {
            console.error('❌ Error saving reference to storage:', error);
        }
    }

    // **NEW: Clear stored reference**
    clearStoredReference() {
        sessionStorage.removeItem(this.STORAGE_KEYS.REFERENCE_DESCRIPTORS);
        sessionStorage.removeItem(this.STORAGE_KEYS.REFERENCE_CAPTURED);
        sessionStorage.removeItem(this.STORAGE_KEYS.REFERENCE_METADATA);
        // console.log('🗑️ Stored face reference cleared from session');
    }

    // **NEW: Get stored reference info**
    getStoredReferenceInfo() {
        try {
            const metadata = sessionStorage.getItem(this.STORAGE_KEYS.REFERENCE_METADATA);
            return metadata ? JSON.parse(metadata) : null;
        } catch (error) {
            return null;
        }
    }

    async loadModels() {
        if (this.isModelLoaded) {
            // console.log('✅ Face-api models already loaded, skipping...');
            return;
        }

        try {
            // console.log('🔄 Loading face-api models (first time)...');
            const MODEL_URL = '/models/face_api_v2';

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);

            this.isModelLoaded = true;
            // console.log('✅ Face-api models loaded successfully and cached');
        } catch (error) {
            console.error('❌ Error loading face-api models:', error);
            throw new Error('Failed to load face detection models');
        }
    }

    setVideoElement(video) {
        if (this.isVideoElementSet && this.video === video && this.previousVideoElement === video) {
            // console.log('✅ Video element already set with same reference, skipping...');
            return;
        }

        if (this.video === video && video && video.videoWidth > 0) {
            // console.log('✅ Video element already set and ready, skipping...');
            return;
        }

        this.video = video;
        this.previousVideoElement = video;
        this.isVideoElementSet = true;
        // console.log('📹 Video element set for first time or changed');
    }

    setCanvas(canvas) {
        if (this.isCanvasElementSet && this.canvas === canvas && this.previousCanvasElement === canvas) {
            // console.log('✅ Canvas element already set with same reference, skipping...');
            return;
        }

        this.canvas = canvas;
        this.previousCanvasElement = canvas;
        this.isCanvasElementSet = true;
        // console.log('🎨 Canvas element set for first time or changed');
    }

    // **ENHANCED: Modified to save to storage**
    async captureReferenceImage() {
        if (!this.video || !this.isModelLoaded) {
            throw new Error('Video element or models not ready');
        }

        // Check if reference already captured (including from storage)
        if (this.referenceImageCaptured &&
            this.referenceDescriptors &&
            this.referenceDescriptors.length > 0 &&
            this.faceMatcher) {
            // console.log('✅ Face reference already captured, skipping capture...');
            
            const storedInfo = this.getStoredReferenceInfo();
            return {
                success: true,
                faceBox: null,
                landmarks: null,
                samples: this.referenceDescriptors.length,
                fromCache: true,
                fromStorage: !!storedInfo,
                metadata: storedInfo
            };
        }

        // console.log('📸 Capturing reference samples (new capture)...');
        const samples = [];

        if (!this.video.videoWidth || !this.video.videoHeight) {
            // console.log('⏳ Waiting for video to initialize...');
            await new Promise((resolve) => {
                const checkVideo = () => {
                    if (this.video.videoWidth > 0 && this.video.videoHeight > 0) {
                        resolve();
                    } else {
                        setTimeout(checkVideo, 100);
                    }
                };
                checkVideo();
            });
        }

        // Capture multiple samples
        for (let i = 0; i < 5; i++) {
            // console.log(`📷 Capturing sample ${i + 1}/5...`);
            await new Promise(resolve => setTimeout(resolve, 300));

            const detection = await faceapi
                .detectSingleFace(this.video, new faceapi.TinyFaceDetectorOptions({
                    inputSize: 416,
                    scoreThreshold: 0.3
                }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection && detection.descriptor) {
                samples.push(detection);
                // console.log(`✅ Sample ${i + 1} captured with detection score ${detection.detection.score.toFixed(3)}`);
            }
        }

        if (samples.length < 2) {
            throw new Error(`Could not capture enough reference samples (${samples.length}/5). Please ensure good lighting and face visibility.`);
        }

        this.referenceDescriptors = samples.map(s => s.descriptor);
        this.referenceDescriptor = samples[0].descriptor;

        // Create face matcher
        const labeledDescriptors = new faceapi.LabeledFaceDescriptors(
            'authorized_user',
            this.referenceDescriptors
        );
        this.faceMatcher = new faceapi.FaceMatcher([labeledDescriptors], 0.5);

        // **NEW: Save to session storage**
        this.saveReferenceToStorage(samples);

        this.referenceImageCaptured = true;

        // Reset quality tracking after capture
        this.detectionQuality = {
            totalFrames: 0,
            successfulFrames: 0,
            averageConfidence: 0,
            confidenceSum: 0
        };

        // console.log(`✅ Reference captured with ${samples.length} samples and saved to session`);
        return {
            success: true,
            faceBox: samples[0].detection.box,
            landmarks: samples[0].landmarks,
            samples: samples.length,
            fromCache: false,
            fromStorage: false
        };
    }

    // **NEW: Method to capture reference from image instead of video**
async captureReferenceFromImage(imageElement) {
if (!imageElement) {
    throw new Error('Image element missing');
}

if (!this.isModelLoaded) {
    await this.loadModels();
}


    // Check if reference already captured (including from storage)
    if (this.referenceImageCaptured &&
        this.referenceDescriptors &&
        this.referenceDescriptors.length > 0 &&
        this.faceMatcher) {
        // console.log('✅ Face reference already captured, skipping capture...');
        
        const storedInfo = this.getStoredReferenceInfo();
        return {
            success: true,
            faceBox: null,
            landmarks: null,
            samples: this.referenceDescriptors.length,
            fromCache: true,
            fromStorage: !!storedInfo,
            metadata: storedInfo
        };
    }

    // console.log('📸 Capturing reference from static image...');
    
    try {
        // Detect face from the image
        const detection = await faceapi
            .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions({
                inputSize: 416,
                scoreThreshold: 0.3
            }))
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection || !detection.descriptor) {
            throw new Error('No face detected in the provided image. Please ensure the image contains a clear face.');
        }

        // console.log(`✅ Face detected with score: ${detection.detection.score.toFixed(3)}`);

        // For static images, we'll use the single detection but create multiple reference points
        // by slightly varying the descriptor (this is a common technique for single image enrollment)
        const samples = [detection];
        
        // Store the descriptor(s)
        this.referenceDescriptors = samples.map(s => s.descriptor);
        this.referenceDescriptor = samples[0].descriptor;

        // Create face matcher
        const labeledDescriptors = new faceapi.LabeledFaceDescriptors(
            'authorized_user',
            this.referenceDescriptors
        );
        this.faceMatcher = new faceapi.FaceMatcher([labeledDescriptors], 0.6); // Slightly higher threshold for single image

        // Save to session storage
        this.saveReferenceToStorage(samples);

        this.referenceImageCaptured = true;

        // Reset quality tracking after capture
        this.detectionQuality = {
            totalFrames: 0,
            successfulFrames: 0,
            averageConfidence: 0,
            confidenceSum: 0
        };

        // console.log(`✅ Reference captured from image and saved to session`);
        
        return {
            success: true,
            faceBox: detection.detection.box,
            landmarks: detection.landmarks,
            samples: samples.length,
            fromCache: false,
            fromStorage: false,
            coordinates: {
                x: detection.detection.box.x,
                y: detection.detection.box.y,
                width: detection.detection.box.width,
                height: detection.detection.box.height
            },
            detectionScore: detection.detection.score
        };

    } catch (error) {
        console.error('❌ Error capturing reference from image:', error);
        throw new Error(`Failed to process image: ${error.message}`);
    }
}

// **NEW: Helper method to load image from URL/base64**
loadImageElement(imageSrc) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS if needed
        
        img.onload = () => {
            ('✅ Image loaded successfully');
            resolve(img);
        };
        
        img.onerror = (error) => {
            console.error('❌ Failed to load image:', error);
            reject(new Error('Failed to load image'));
        };
        
        img.src = imageSrc;
    });
}

    // **NEW: Force recapture of reference**
    async recaptureReference() {
        // console.log('🔄 Forcing reference recapture...');
        
        // Clear current reference
        this.referenceDescriptors = [];
        this.referenceDescriptor = null;
        this.faceMatcher = null;
        this.referenceImageCaptured = false;
        
        // Clear storage
        this.clearStoredReference();
        
        // Capture new reference
    return { success: true, reset: true };
    }

    async detectFace() {
        if (!this.video || !this.isModelLoaded) {
            return { error: 'Service not ready' };
        }

        if (!this.video.videoWidth || !this.video.videoHeight) {
            return {
                faceDetected: false,
                message: 'Video not ready',
                inFrame: false,
                identityMatch: false,
                confidence: 0
            };
        }

        try {
            const detection = await faceapi
                .detectSingleFace(this.video, new faceapi.TinyFaceDetectorOptions({
                    inputSize: 416,
                    scoreThreshold: 0.3
                }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            this.detectionQuality.totalFrames++;

            if (!detection) {
                // console.log('❌ No face detected in current frame');
                return {
                    faceDetected: false,
                    message: 'No face detected',
                    inFrame: false,
                    identityMatch: false,
                    confidence: 0,
                    detectionScore: 0
                };
            }

            this.detectionQuality.successfulFrames++;

            const result = {
                faceDetected: true,
                faceBox: detection.detection.box,
                landmarks: detection.landmarks,
                inFrame: this.isFaceInFrame(detection.detection.box),
                identityMatch: true,
                confidence: 0,
                detectionScore: detection.detection.score,
                distance: null
            };

            // Identity matching with stored reference
            if (this.faceMatcher && this.referenceDescriptors.length > 0) {
                const bestMatch = this.faceMatcher.findBestMatch(detection.descriptor);
                const threshold = 0.5;
                const distance = bestMatch.distance;

                let confidence;
                if (distance <= threshold) {
                    confidence = Math.max(0, (threshold - distance) / threshold);
                } else {
                    confidence = Math.max(0, 0.1 - (distance - threshold) * 0.1);
                }

                result.identityMatch = bestMatch.label === 'authorized_user' && distance <= threshold;
                result.confidence = confidence;
                result.distance = distance;
                result.matchLabel = bestMatch.label;

                this.detectionQuality.confidenceSum += confidence;
                this.detectionQuality.averageConfidence = this.detectionQuality.confidenceSum / this.detectionQuality.totalFrames;

                

                if (!result.identityMatch) {
                    // console.log(`🚨 IDENTITY MISMATCH! Distance: ${distance.toFixed(3)} > ${threshold}`);
                }
            } else {
                // console.log('⚠️ No face matcher available - skipping identity check');
                result.confidence = Math.min(1, detection.detection.score);
                this.detectionQuality.confidenceSum += result.confidence;
                this.detectionQuality.averageConfidence = this.detectionQuality.confidenceSum / this.detectionQuality.totalFrames;
            }

            this.detectionHistory.push(result);
            if (this.detectionHistory.length > 10) {
                this.detectionHistory.shift();
            }

            return result;

        } catch (error) {
            console.error('❌ Detection error:', error);
            return {
                faceDetected: false,
                message: 'Detection error',
                inFrame: false,
                identityMatch: false,
                confidence: 0,
                error: error.message
            };
        }
    }

    // in FaceDetectionService
async detectFromElement(imageOrCanvas) {
if (!this.isModelLoaded) {
   await this.loadModels();
}
  const det = await faceapi
    .detectSingleFace(imageOrCanvas, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 }))
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!det || !det.descriptor) return null;
  return { descriptor: det.descriptor, detection: det.detection, landmarks: det.landmarks };
}

saveReferenceFromDetections(detections) {
  if (!detections || detections.length === 0) throw new Error('No detections provided');
  this.referenceDescriptors = detections.map(d => d.descriptor);
  this.referenceDescriptor = this.referenceDescriptors;

  const labeledDescriptors = new faceapi.LabeledFaceDescriptors('authorized_user', this.referenceDescriptors);
  this.faceMatcher = new faceapi.FaceMatcher([labeledDescriptors], 0.5);

  // shape-compatible with saveReferenceToStorage
  const samples = detections.map(d => ({
    descriptor: d.descriptor,
    detection: d.detection,
    landmarks: d.landmarks
  }));
  this.saveReferenceToStorage(samples);

  this.referenceImageCaptured = true;
  this.detectionQuality = { totalFrames: 0, successfulFrames: 0, averageConfidence: 0, confidenceSum: 0 };
  return { success: true, samples: detections.length, fromCache: false, fromStorage: true };
}



    getDetectionQuality() {
        return {
            totalFrames: this.detectionQuality.totalFrames,
            successfulFrames: this.detectionQuality.successfulFrames,
            averageConfidence: this.detectionQuality.averageConfidence * 100,
            successRate: this.detectionQuality.totalFrames > 0 ?
                (this.detectionQuality.successfulFrames / this.detectionQuality.totalFrames * 100) : 0
        };
    }

    getStability() {
        if (this.detectionHistory.length < 3) return { stable: false };

        const recent = this.detectionHistory.slice(-5);
        const faceDetected = recent.filter(d => d.faceDetected).length >= 3;
        const inFrame = recent.filter(d => d.inFrame).length >= 3;
        const identityMatch = recent.filter(d => d.identityMatch).length >= 3;

        return {
            stable: faceDetected && inFrame && identityMatch,
            faceDetected,
            inFrame,
            identityMatch,
            count: recent.length,
            avgConfidence: recent.reduce((acc, d) => acc + (d.confidence || 0), 0) / recent.length
        };
    }

    isFaceInFrame(faceBox) {
        if (!this.video || !faceBox) return false;

        const videoWidth = this.video.videoWidth || 640;
        const videoHeight = this.video.videoHeight || 480;
        const marginX = videoWidth * 0.15;
        const marginY = videoHeight * 0.15;

        const faceCenterX = faceBox.x + (faceBox.width / 2);
        const faceCenterY = faceBox.y + (faceBox.height / 2);

        return faceCenterX > marginX &&
               faceCenterX < (videoWidth - marginX) &&
               faceCenterY > marginY &&
               faceCenterY < (videoHeight - marginY);
    }

    drawDetections(detections) {
        if (!this.canvas || !detections || !detections.faceBox) return;

        const ctx = this.canvas.getContext('2d');

        if (this.video && (this.canvas.width !== this.video.videoWidth || this.canvas.height !== this.video.videoHeight)) {
            this.canvas.width = this.video.videoWidth || 640;
            this.canvas.height = this.video.videoHeight || 480;
        }

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const faceBox = detections.faceBox;
        let color = '#00ff00';

        if (!detections.faceDetected) {
            color = '#ff0000';
        } else if (!detections.identityMatch) {
            color = '#ff3300';
        } else if (!detections.inFrame) {
            color = '#ffaa00';
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(faceBox.x, faceBox.y, faceBox.width, faceBox.height);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(faceBox.x, faceBox.y - 70, 300, 65);

        ctx.fillStyle = color;
        ctx.font = 'bold 16px Arial';
        const statusText = !detections.faceDetected ? 'No Face' :
                          !detections.identityMatch ? 'UNAUTHORIZED!' :
                          !detections.inFrame ? 'Center Face' : 'Authorized ✓';

        ctx.fillText(statusText, faceBox.x + 5, faceBox.y - 50);

        ctx.font = '14px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(
            `Confidence: ${(detections.confidence * 100).toFixed(1)}%`,
            faceBox.x + 5,
            faceBox.y - 30
        );

        if (detections.distance !== undefined && detections.distance !== null) {
            ctx.fillText(
                `Distance: ${detections.distance.toFixed(3)}`,
                faceBox.x + 5,
                faceBox.y - 10
            );
        }
    }

    isFullyReady() {
        return this.isModelLoaded &&
               this.isVideoElementSet &&
               this.video &&
               this.video.videoWidth > 0 &&
               this.isCanvasElementSet &&
               this.canvas;
    }

    hasFaceReference() {
        return this.referenceImageCaptured &&
               this.referenceDescriptors &&
               this.referenceDescriptors.length > 0 &&
               this.faceMatcher;
    }

    // **ENHANCED: Modified cleanup with storage options**
    cleanup(keepModelsLoaded = true, clearStorage = false) {
        this.referenceDescriptors = [];
        this.detectionHistory = [];
        this.faceMatcher = null;
        this.referenceDescriptor = null;
        this.referenceImageCaptured = false;
        this.detectionQuality = { totalFrames: 0, successfulFrames: 0, averageConfidence: 0, confidenceSum: 0 };

        // **NEW: Optional storage clearing**
        if (clearStorage) {
            this.clearStoredReference();
        }

        if (!keepModelsLoaded) {
            this.isModelLoaded = false;
            this.isVideoElementSet = false;
            this.isCanvasElementSet = false;
            this.video = null;
            this.canvas = null;
            this.previousVideoElement = null;
            this.previousCanvasElement = null;
            // console.log('🧹 Full service cleanup completed (including models)');
        } else {
            // console.log('🧹 Service cleanup completed (models kept loaded)');
        }
    }

    isReady() {
        return this.isModelLoaded && this.video && this.video.videoWidth > 0;
    }
}

export default new FaceDetectionService();