import { useState, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

export const useCocoSsdModel = () => {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadModel = async () => {
            try {
                // Load the model
                const loadedModel = await cocoSsd.load();
                setModel(loadedModel);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load COCO-SSD model", error);
                setLoading(false);
            }
        };
        loadModel();
    }, []);

    return { model, loading };
};
