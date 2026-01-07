
import React, { useRef, useEffect, useState } from 'react';
import HeadMovementDetection from '../../../Ai/HeadMovementDetection/HeadMovementDetection';
import ObjectDetection from '../../../Ai/ObjectDetection/ObjectDetection';
import SoundDetectionComponent from '../../../Ai/SoundDetection/SoundDetectionComponent';

export const ProctoringPanel = ({ messages }) => {
    const videoRef = useRef(null);
    const aiCanvasRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);

    // AI props - assuming exam is active if we are here
    const accessStatus = { screen: true, camera: true };
    const isActive = true;

    const handleAiFlag = (userImage, screenImage, flag) => {
        // Commented out as per request
        // console.log("AI Flag Detected:", flag);
    };

    useEffect(() => {
        let stream = null;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraActive(true);
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                setCameraActive(false);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="h-full flex flex-col space-y-3">
            {/* Hidden AI Components */}
            <HeadMovementDetection
                accessStatus={accessStatus}
                isActive={isActive}
                sendFlagByAi={handleAiFlag}
            />
            <ObjectDetection
                accessStatus={accessStatus}
                isActive={isActive}
                webcamRef={videoRef}
                canvasRef={aiCanvasRef}
                sendFlagByAi={handleAiFlag}
            />
            <SoundDetectionComponent
                isActive={isActive}
                webcamRef={videoRef}
                sendFlagByAi={handleAiFlag}
            />

            {/* Hidden canvas for AI processing */}
            <canvas ref={aiCanvasRef} className="hidden" />

            {/* Camera Box */}
            <div className="bg-black rounded-lg overflow-hidden shadow relative aspect-video border border-gray-300">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />

                {/* Overlay Status */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-white text-[10px] font-medium">
                        {cameraActive ? 'Live' : 'Off'}
                    </span>
                </div>

                {/* Recording Indicator */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/80 px-1.5 py-0.5 rounded text-white text-[9px] font-bold uppercase tracking-wider">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                    REC
                </div>
            </div>

            {/* Messages / Info Box */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                    <h3 className="font-bold text-gray-700 text-xs">Proctor Messages</h3>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2">
                    {messages && messages.length > 0 ? (
                        messages.map((msg, idx) => (
                            <div key={idx} className="bg-blue-50 p-2 rounded border border-blue-100 text-xs text-blue-800">
                                <span className="block text-[10px] font-bold text-blue-600 mb-0.5">{msg.time}</span>
                                {msg.text}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 text-xs mt-2">
                            No messages.
                        </div>
                    )}
                </div>

                <div className="p-2 border-t border-gray-200 bg-gray-50">
                    <input
                        type="text"
                        placeholder="Type..."
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded text-xs focus:outline-none focus:border-primary"
                        disabled
                    />
                </div>
            </div>

            {/* System Status Indicators at very bottom */}
            <div className="bg-white rounded-lg shadow-sm p-2 flex justify-around text-[10px] font-medium text-gray-600">
                <div className="flex flex-col items-center gap-0.5">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    <span>Audio</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <span>Video</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                    <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
                    <span>Net</span>
                </div>
            </div>
        </div>
    );
};
