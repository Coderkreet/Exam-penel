import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import FaceDetectionService from "../../services/FaceDetectionService ";
import notificationMp3 from "../../images/notification.mp3";

const playNotificationSound = () => {
  const audio = new Audio(notificationMp3); // ✅ use the variable, not the string
  audio.volume = 0.5; // optional
  audio.play().catch(() => {
    console.warn("Audio play prevented by browser until user interacts");
  });
};
function FaceVerificationComponent({ 
  webcamRef, 
  accessStatus, 

  sendFlagByAi,
  onStatusChange,
  isActive
}) {
  const faceCanvasRef = useRef(null);
  
  const [serviceState, setServiceState] = useState({
    faceServiceReady: false,
    modelsLoaded: false,
    videoReady: false,
    referenceReady: false,
    hasStoredReference: false,
    initializationError: null
  });
  
  const [faceStats, setFaceStats] = useState({
    detected: false,
    identityMatch: false,
    confidence: 0,
    lastUpdate: 0
  });
  
  const performanceRefs = useRef({
    lastFaceCheck: 0,
    lastToast: 0,
    lastCapture: 0,
    frameSkipCounter: 0,
    consecutiveUnauthorized: 0,
    monitoringActive: false,
    initializationAttempts: 0,
    animationFrameId: null // ✅ Added for cleanup
  });
  
  const PERFORMANCE_CONFIG = useMemo(() => ({
    FACE_CHECK_INTERVAL: 800,
    TOAST_COOLDOWN: 5000,
    CAPTURE_COOLDOWN: 5000,
    FRAME_SKIP_COUNT: 2,
    UNAUTHORIZED_THRESHOLD: 2,
    MAX_INIT_ATTEMPTS: 3,
    LOOP_DELAY: 100
  }), []);

  const showToast = useCallback((message, type = 'warning') => {
    const now = Date.now();
    if (now - performanceRefs.current.lastToast < PERFORMANCE_CONFIG.TOAST_COOLDOWN) {
      return;
    }
    
    performanceRefs.current.lastToast = now;
    
    try {
      
      const toastConfig = {
        position: "top-right",
        autoClose: type === 'error' ? 1000 : 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        toastId: `face-${type}-${now}`,
      };
        //  playNotificationSound();
      switch (type) {
        case 'error':
          toast.error(` ${message}`, toastConfig);
          break;
        case 'warning':
          toast.warning(` ${message}`, toastConfig);
          break;
        case 'success':
          toast.success(` ${message}`, { ...toastConfig, autoClose: 1000 });
          break;
        default:
          toast.warning(` ${message}`, toastConfig);
      }
    } catch (error) {
      console.error('Toast notification error:', error);
    }
  }, [ PERFORMANCE_CONFIG.TOAST_COOLDOWN]);

  const isVideoReady = useCallback((video) => {
    return video && 
           video.videoWidth > 0 && 
           video.videoHeight > 0 && 
           video.readyState >= 2 &&
           !video.ended;
  }, []);

  const captureEvidence = useCallback(async (flag) => {
    const now = Date.now();
    if (now - performanceRefs.current.lastCapture < PERFORMANCE_CONFIG.CAPTURE_COOLDOWN) {
      return;
    }
    performanceRefs.current.lastCapture = now;

    try {
      const video = webcamRef?.current;
      if (!video || !isVideoReady(video)) {
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = 240;
      canvas.height = 180;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const userImage = canvas.toDataURL('image/jpeg', 0.6);

      try {
        await sendFlagByAi(userImage, 'face-verification-alert', flag);
      } catch (error) {
        console.error('Failed to send face evidence:', error);
      }
      
    } catch (error) {
      console.error('Error capturing face evidence:', error);
    }
  }, [webcamRef, sendFlagByAi, isVideoReady, PERFORMANCE_CONFIG.CAPTURE_COOLDOWN]);

  const loadStoredReference = useCallback(async () => {
    try {
      const descriptorsStored = sessionStorage.getItem('face_reference_descriptors');
      const metadataStored = sessionStorage.getItem('face_reference_metadata');
      const capturedFlag = sessionStorage.getItem('face_reference_captured');
      
      if (!descriptorsStored || capturedFlag !== 'true') {
        return false;
      }
      
      const descriptorData = JSON.parse(descriptorsStored);
      const metadata = metadataStored ? JSON.parse(metadataStored) : {};
      
      if (descriptorData && Array.isArray(descriptorData) && descriptorData.length > 0) {
        const descriptors = descriptorData.map(desc => new Float32Array(desc));
        const optimalThreshold = metadata.optimalThreshold || 0.55;
        
        FaceDetectionService.referenceDescriptors = descriptors;
        FaceDetectionService.referenceDescriptor = descriptors[0];
        FaceDetectionService.referenceImageCaptured = true;
        
        const { LabeledFaceDescriptors, FaceMatcher } = await import('@vladmandic/face-api');
        const labeledDescriptors = new LabeledFaceDescriptors('authorized_user', descriptors);
        FaceDetectionService.faceMatcher = new FaceMatcher([labeledDescriptors], optimalThreshold);
        
        return true;
      }
    } catch (error) {
      console.error("Face reference loading failed:", error);
      setServiceState(prev => ({ 
        ...prev, 
        initializationError: `Reference loading failed: ${error.message}` 
      }));
    }
    return false;
  }, []);

  // ✅ FIXED: Use ref for faceStats to avoid stale closures
  const faceStatsRef = useRef(faceStats);
  useEffect(() => {
    faceStatsRef.current = faceStats;
  }, [faceStats]);

  const processFaceVerification = useCallback(async () => {
    try {
      performanceRefs.current.frameSkipCounter++;
      if (performanceRefs.current.frameSkipCounter % PERFORMANCE_CONFIG.FRAME_SKIP_COUNT !== 0) {
        return;
      }

      if (!FaceDetectionService.hasFaceReference()) {
        return;
      }

      if (!webcamRef?.current || !isVideoReady(webcamRef.current)) {
        return;
      }
      
      const faceResult = await FaceDetectionService.detectFace();
      if (!faceResult) {
        return;
      }
      
      const currentTime = Date.now();
      
      const newStats = {
        detected: faceResult.faceDetected || false,
        identityMatch: faceResult.identityMatch === true,
        confidence: faceResult.confidence || 0,
        lastUpdate: currentTime
      };
      
      // ✅ FIXED: Use ref for comparison
      const prevStats = faceStatsRef.current;
      const statsChanged = Math.abs(newStats.confidence - prevStats.confidence) > 0.1 ||
                          newStats.detected !== prevStats.detected ||
                          newStats.identityMatch !== prevStats.identityMatch;
      
      if (statsChanged) {
        setFaceStats(newStats);
      }
      
      if (newStats.detected && !newStats.identityMatch) {
        performanceRefs.current.consecutiveUnauthorized++;
        
        if (performanceRefs.current.consecutiveUnauthorized >= PERFORMANCE_CONFIG.UNAUTHORIZED_THRESHOLD) {
          showToast("Unauthorized person detected!");
          captureEvidence("Unauthorized person detected");
          performanceRefs.current.consecutiveUnauthorized = 0;
        }
      } else if (newStats.identityMatch) {
        performanceRefs.current.consecutiveUnauthorized = 0;
      }
      
      if (onStatusChange && statsChanged) {
        onStatusChange({
          type: 'face',
          status: newStats.identityMatch ? 'authorized' : 'unauthorized',
          confidence: newStats.confidence,
          detected: newStats.detected,
          message: newStats.identityMatch ? 
            `✅ Authorized - ${Math.round(newStats.confidence * 100)}%` :
            newStats.detected ? `Unauthorized person` : `No face detected`
        });
      }

    } catch (error) {
      console.error("Face verification error:", error);
      setServiceState(prev => ({ 
        ...prev, 
        initializationError: `Verification error: ${error.message}` 
      }));
      
      if (onStatusChange) {
        onStatusChange({
          type: 'face',
          status: 'error',
          message: 'Face verification error'
        });
      }
    }
  }, [webcamRef, isVideoReady, showToast, captureEvidence, onStatusChange, PERFORMANCE_CONFIG]);

  useEffect(() => {
    const checkStoredFaceReference = () => {
      try {
        const descriptorsStored = sessionStorage.getItem('face_reference_descriptors');
        const capturedFlag = sessionStorage.getItem('face_reference_captured');
        
        if (capturedFlag === 'true' && descriptorsStored) {
          const descriptorData = JSON.parse(descriptorsStored);
          if (Array.isArray(descriptorData) && descriptorData.length > 0) {
            setServiceState(prev => ({ ...prev, hasStoredReference: true }));
            return true;
          }
        }
        
        return false;
      } catch (error) {
        console.error('Error checking stored reference:', error);
        return false;
      }
    };
    
    checkStoredFaceReference();
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadFaceModels = async () => {
      if (performanceRefs.current.initializationAttempts >= PERFORMANCE_CONFIG.MAX_INIT_ATTEMPTS) {
        console.error("Max initialization attempts reached");
        setServiceState(prev => ({ 
          ...prev, 
          initializationError: "Failed to initialize after multiple attempts" 
        }));
        return;
      }
      
      performanceRefs.current.initializationAttempts++;
      
      try {
        setServiceState(prev => ({ ...prev, initializationError: null }));

        if (!FaceDetectionService.isModelLoaded) {
          await FaceDetectionService.loadModels();
        }

        if (!isMounted) return;
        
        setServiceState(prev => ({ ...prev, modelsLoaded: true }));
        
        if (serviceState.hasStoredReference) {
          const referenceLoaded = await loadStoredReference();
          if (referenceLoaded && isMounted) {
            setServiceState(prev => ({ ...prev, referenceReady: true }));
          }
        }
        
      } catch (error) {
        console.error("Error loading face models:", error);
        setServiceState(prev => ({ 
          ...prev, 
          initializationError: `Model loading failed: ${error.message}` 
        }));
        
        if (performanceRefs.current.initializationAttempts < PERFORMANCE_CONFIG.MAX_INIT_ATTEMPTS) {
          setTimeout(() => {
            if (isMounted) {
              loadFaceModels();
            }
          }, 2000);
        }
      }
    };

    loadFaceModels();
    
    return () => {
      isMounted = false;
    };
  }, [serviceState.hasStoredReference, loadStoredReference, PERFORMANCE_CONFIG.MAX_INIT_ATTEMPTS]);

  useEffect(() => {
    const initializeVideoService = () => {
      const video = webcamRef?.current;
      if (!video || !serviceState.modelsLoaded) {
        return;
      }

      if (!isVideoReady(video)) {
        setTimeout(initializeVideoService, 1000);
        return;
      }

      try {
        FaceDetectionService.setVideoElement(video);
        
        if (faceCanvasRef.current) {
          const { videoWidth, videoHeight } = video;
          if (videoWidth > 0 && videoHeight > 0) {
            faceCanvasRef.current.width = videoWidth;
            faceCanvasRef.current.height = videoHeight;
            FaceDetectionService.setCanvas(faceCanvasRef.current);
          }
        }
        
        setServiceState(prev => ({ ...prev, videoReady: true }));
        
        if (serviceState.referenceReady || FaceDetectionService.hasFaceReference()) {
          setServiceState(prev => ({ ...prev, faceServiceReady: true }));
        }
        
      } catch (error) {
        console.error("Error initializing video service:", error);
        setServiceState(prev => ({ 
          ...prev, 
          initializationError: `Video service init failed: ${error.message}` 
        }));
      }
    };

    initializeVideoService();
  }, [webcamRef, serviceState.modelsLoaded, serviceState.referenceReady, isVideoReady]);

  // ✅ FIXED: Main monitoring loop with proper cleanup
  useEffect(() => {
    const canStartMonitoring = isActive && 
                              serviceState.faceServiceReady && 
                              serviceState.videoReady && 
                              serviceState.modelsLoaded &&
                              (serviceState.referenceReady || FaceDetectionService.hasFaceReference()) &&
                              webcamRef?.current &&
                              isVideoReady(webcamRef.current);

    if (!canStartMonitoring) {
      return;
    }

    performanceRefs.current.monitoringActive = true;
    
    const monitorFace = async () => {
      if (!performanceRefs.current.monitoringActive) return;
      if (!isActive) return;
      const currentTime = Date.now();
      
      try {
        if (currentTime - performanceRefs.current.lastFaceCheck >= PERFORMANCE_CONFIG.FACE_CHECK_INTERVAL) {
          await processFaceVerification();
          performanceRefs.current.lastFaceCheck = currentTime;
        }
      } catch (error) {
        console.error("Face monitoring loop error:", error);
      }
      
      setTimeout(() => {
        if (performanceRefs.current.monitoringActive) {
          performanceRefs.current.animationFrameId = requestAnimationFrame(monitorFace);
        }
      }, PERFORMANCE_CONFIG.LOOP_DELAY);
    };

    performanceRefs.current.animationFrameId = requestAnimationFrame(monitorFace);

    return () => {
      performanceRefs.current.monitoringActive = false;
      // ✅ FIXED: Cancel animation frame
      if (performanceRefs.current.animationFrameId) {
        cancelAnimationFrame(performanceRefs.current.animationFrameId);
        performanceRefs.current.animationFrameId = null;
      }
    };
  }, [isActive, serviceState, webcamRef, isVideoReady, processFaceVerification, PERFORMANCE_CONFIG]);

  // ✅ FIXED: Cleanup on unmount
  useEffect(() => {
    return () => {
      performanceRefs.current.monitoringActive = false;
      
      if (performanceRefs.current.animationFrameId) {
        cancelAnimationFrame(performanceRefs.current.animationFrameId);
      }
      
      if (window.gc) {
        window.gc();
      }
    };
  }, []);

  return (
    <div style={{ display: 'none' }}>
      <canvas ref={faceCanvasRef} style={{ display: "none" }} />
      
      {process.env.NODE_ENV === 'development' && serviceState.initializationError && (
        <div style={{
          position: "fixed",
          top: "100px",
          right: "20px",
          background: "rgba(255,0,0,0.9)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "12px",
          zIndex: 9999,
          maxWidth: "300px"
        }}>
          👤 Face Error: {serviceState.initializationError}
        </div>
      )}
    </div>
  );
}

export default React.memo(FaceVerificationComponent, (prevProps, nextProps) => {
  return prevProps.isActive === nextProps.isActive &&
         prevProps.accessStatus === nextProps.accessStatus;
});
