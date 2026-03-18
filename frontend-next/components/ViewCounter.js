'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';

export default function ViewCounter({ slug, apiBaseUrl }) {
    const viewCountedFor = useRef(null);

    useEffect(() => {
        const incrementView = async () => {
            if (viewCountedFor.current === slug) return;
            
            // Mark as counted immediately to prevent double-calls in Strict Mode
            viewCountedFor.current = slug;
            try {
                await axios.post(`${apiBaseUrl}/api/blog/posts/${slug}/view`);
            } catch (error) {
                console.error('Failed to increment view count:', error);
                // On error, we could potentially reset to allow retry, 
                // but usually better to avoid spamming the server.
            }
        };

        incrementView();
    }, [slug, apiBaseUrl]);

    return null;
}
