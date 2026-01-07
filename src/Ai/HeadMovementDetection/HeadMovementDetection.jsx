import React, { useRef, useEffect, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

export default function HeadMovementDetection({
    accessStatus,
    sendFlagByAi,
    isActive
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const toastIdRef = useRef(null);
    const isToastActiveRef = useRef(false);
    const [msg, setMsg] = useState("Loading…");
    const lastLandmarkRef = useRef(null);
    const noFaceStartRef = useRef(null);     // When no-face first starts
    const lastFlagTimeRef = useRef(null);    // Last time a no-face flag was fired

    const YAW_TH = 0.03;
    const PITCH_TH = 0.05;

    const activeDirectionRef = useRef("");
    const multiFaceDetectedRef = useRef(false);
    const lastCaptureTimeRef = useRef(0);
    const isActiveRef = useRef(isActive);

    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    useEffect(() => {
        if (!accessStatus.screen || !accessStatus.camera) return;
        if (!isActive) return;

        const ctx = canvasRef.current.getContext("2d");

        const faceMesh = new FaceMesh({
            locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
        });

        faceMesh.setOptions({
            maxNumFaces: 2,
            refineLandmarks: true,
            minDetectionConfidence: 0.3,
            minTrackingConfidence: 0.5,
        });

        const captureEvidence = async (flag) => {
            const now = Date.now();
            if (now - lastCaptureTimeRef.current < 5000) return;
            lastCaptureTimeRef.current = now;

            try {
                // Logic for capturing images if needed
            } catch (error) {
                console.error("Error capturing evidence:", error);
            }
        };

        faceMesh.onResults((res) => {
            if (!isActiveRef.current) return;
            if (isToastActiveRef.current) return;

            ctx.clearRect(0, 0, 640, 480);
            let info = "✅ Center";
            let detectedDirection = "center";

            if (res.multiFaceLandmarks?.length > 1) {
                if (!multiFaceDetectedRef.current) {
                    showToast("Multiple faces detected");
                    multiFaceDetectedRef.current = true;
                    captureEvidence("Multiple faces detected");
                }
            } else {
                multiFaceDetectedRef.current = false;

                if (res.multiFaceLandmarks?.length === 1) {
                    lastLandmarkRef.current = res.multiFaceLandmarks[0];
                    const lm = res.multiFaceLandmarks[0];
                    const dx = lm[1].x - (lm[33].x + lm[263].x) / 2;
                    const foreheadY = lm[10].y;
                    const chinY = lm[152].y;
                    const midY = (foreheadY + chinY) / 2;
                    const dy = lm[1].y - midY;

                    if (dy < -PITCH_TH) {
                        info = "Look into the screen";
                        detectedDirection = "up";
                    }
                    else if (dy > PITCH_TH) {
                        detectedDirection = "center";
                        info = "Center";
                    }
                    else if (dx > YAW_TH) {
                        info = "Look into the screen";
                        detectedDirection = "left";
                    }
                    else if (dx < -YAW_TH) {
                        info = "Look into the screen";
                        detectedDirection = "right";
                    }

                } else {
                    // No face logic...
                }

                if (
                    detectedDirection !== "center" &&
                    activeDirectionRef.current !== detectedDirection
                ) {
                    showToast(info);
                    activeDirectionRef.current = detectedDirection;
                    captureEvidence(info);
                }

                if (
                    detectedDirection === "center" &&
                    activeDirectionRef.current !== ""
                ) {
                    activeDirectionRef.current = "";
                }
            }

            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, 220, 30);
            ctx.fillStyle = "#fff";
            ctx.font = "16px sans-serif";
            ctx.fillText(info, 10, 20);
            setMsg(info);
        });

        const cam = new Camera(videoRef.current, {
            onFrame: async () => faceMesh.send({ image: videoRef.current }),
            width: 640,
            height: 480,
        });

        cam.start().then(() => setMsg("Tracking…"));

        return () => cam.stop();
    }, [accessStatus, isActive]);

    const showToast = (message) => {
        if (toastIdRef.current !== null) {
            toast.dismiss(toastIdRef.current);
        }
        isToastActiveRef.current = true;
        toastIdRef.current = toast.warning(message, {
            position: "top-right",
            autoClose: 1000,
            onClose: () => {
                setTimeout(() => {
                    toastIdRef.current = null;
                    isToastActiveRef.current = false;
                }, 500);
            },
        });
    };

    return (
        <>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                    visibility: "hidden",
                    height: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            />
        </>
    );
}
