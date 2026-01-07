import React, { useEffect, useRef } from "react";
import { useCocoSsdModel } from "./useCocoSsdModel";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

const ObjectDetection = ({ accessStatus, canvasRef, webcamRef, sendFlagByAi, isActive }) => {
    const lastCaptureTimeRef = useRef(0);
    const isActiveRef = useRef(isActive);
    const { model, loading } = useCocoSsdModel();

    useEffect(() => {
        isActiveRef.current = isActive;
    }, [isActive]);

    useEffect(() => {
        if (!accessStatus.screen || !accessStatus.camera) return;

        let stream, animFrame;
        const detectedObjects = new Set();
        const targetItems = [
            "cell phone",
            "laptop",
            "keyboard",
            "mouse",
            "calculator",
            "book",
            "notebook",
            "paper",
            "document",
        ];

        const captureEvidence = async (flag) => {
            const now = Date.now();
            if (now - lastCaptureTimeRef.current < 5000) return;
            lastCaptureTimeRef.current = now;
            // Capture logic...
        };

        const init = async () => {
            if (loading || !model) return;

            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (webcamRef.current) {
                    webcamRef.current.srcObject = stream;
                    webcamRef.current.onloadeddata = () => {
                        const video = webcamRef.current;
                        if (video && video.videoWidth > 0 && video.videoHeight > 0) {
                            if (canvasRef.current) {
                                canvasRef.current.width = video.videoWidth;
                                canvasRef.current.height = video.videoHeight;
                                detectFrame();
                            }
                        }
                    };
                }
            } catch (error) {
                console.error("Error initializing object detection:", error);
            }
        };

        const detectFrame = async () => {
            if (!canvasRef.current || !webcamRef.current) return;
            const ctx = canvasRef.current.getContext("2d");

            const detect = async () => {
                if (!isActiveRef.current) {
                    cancelAnimationFrame(animFrame);
                    return;
                }
                if (!webcamRef.current || webcamRef.current.videoWidth === 0 || webcamRef.current.videoHeight === 0) {
                    animFrame = requestAnimationFrame(detect);
                    return;
                }

                try {
                    const predictions = await model.detect(webcamRef.current);
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                    predictions.forEach((pred) => {
                        if (targetItems.includes(pred.class) && pred.score > 0.5) {
                            const [x, y, width, height] = pred.bbox;
                            ctx.beginPath();
                            ctx.rect(x, y, width, height);
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = "red";
                            ctx.stroke();

                            if (!detectedObjects.has(pred.class)) {
                                detectedObjects.add(pred.class);
                                captureEvidence(pred.class);
                                toast.warning(`${pred.class} detected`, {
                                    autoClose: 1000,
                                    onClose: () => {
                                        setTimeout(() => detectedObjects.delete(pred.class), 5000);
                                    },
                                });
                            }
                        }
                    });
                } catch (error) {
                    console.error("Error during detection:", error);
                }

                animFrame = requestAnimationFrame(detect);
            };
            detect();
        };

        init();

        return () => {
            if (animFrame) cancelAnimationFrame(animFrame);
            if (stream) stream.getTracks().forEach((t) => t.stop());
            detectedObjects.clear();
        };
    }, [accessStatus, loading, model, isActive]);

    return (
        <>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <video
                ref={webcamRef}
                autoPlay
                muted
                playsInline
                style={{
                    visibility: "hidden",
                    height: 0,
                    position: 'absolute'
                }}
            />
        </>
    );
};

export default ObjectDetection;
