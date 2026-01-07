import React, { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

function SoundDetectionComponent({
  webcamRef,
  sendFlagByAi,
  isActive,
  threshold = 0.15,
  debounceTime = 5000
}) {
  const [isSoundDetected, setIsSoundDetected] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastGlobalToastTimeRef = useRef(0);
  const lastFlagTimeRef = useRef({});
  const isActiveRef = useRef(isActive);

  const ALERT_LABEL = 'Unwanted Sound Detected';

  const captureCurrentFrame = useCallback(() => {
    if (!webcamRef?.current) return null;
    const video = webcamRef.current;
    if (!video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [webcamRef]);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const cleanupAudio = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    analyserRef.current = null;
    setIsSoundDetected(false);
  }, []);

  useEffect(() => {
    if (!isActive) {
      cleanupAudio();
      return;
    }

    let dataArray = null;

    const startAudioDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100,
            channelCount: 1
          }
        });
        streamRef.current = stream;

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        checkVolume();
      } catch (err) {
        console.error('Microphone access error:', err);
        cleanupAudio();
      }
    };

    const checkVolume = () => {
      if (!analyserRef.current || !isActiveRef.current || !dataArray) {
        rafIdRef.current = null;
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalizedVolume = average / 255;

      const detected = normalizedVolume > threshold;
      setIsSoundDetected(detected);

      if (detected) {
        const now = Date.now();
        const soundKey = 'unwanted';
        if (!lastFlagTimeRef.current[soundKey] || now - lastFlagTimeRef.current[soundKey] > debounceTime) {
          lastFlagTimeRef.current[soundKey] = now;
          toast.warning(ALERT_LABEL, { position: 'top-right', autoClose: 4000 });
        }
      }

      if (isActiveRef.current) {
        rafIdRef.current = requestAnimationFrame(checkVolume);
      }
    };

    startAudioDetection();
    return () => cleanupAudio();
  }, [isActive, threshold, debounceTime, cleanupAudio]);

  return null;
}

export default SoundDetectionComponent;
