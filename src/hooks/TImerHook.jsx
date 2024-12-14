import {useEffect, useRef, useState} from 'react';

// Helper function to convert time string to milliseconds
const timeToMilliseconds = (timeString, format) => {
    // If timeString is already a number (milliseconds), return it directly
    if (typeof timeString === 'number') {
        return timeString;
    }

    // If timeString is undefined or null, use default initial time
    if (!timeString) {
        timeString = getInitialTime(format);
    }

    // Ensure timeString is a string
    timeString = String(timeString);
    const timeParts = timeString.split(':').map(Number);

    if (format === 'HH:MM:SS') {
        const [hours, minutes, seconds] = timeParts;
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    } else if (format === 'MM:SS') {
        const [minutes, seconds] = timeParts;
        return (minutes * 60 + seconds) * 1000;
    } else if (format === 'HH:MM') {
        const [hours, minutes] = timeParts;
        return (hours * 3600 + minutes * 60) * 1000;
    }
    return 0;
};

// Helper to get the default initial time based on format
const getInitialTime = (format) => {
    switch (format) {
        case 'HH:MM:SS':
            return "00:00:00";
        case 'HH:MM:SS.m':
            return "00:00:00.0";
        default:
            return "00:00";
    }
};

const useTimer = (format = 'HH:MM:SS', initialTime) => {
    // Default initialTime based on format if not provided
    if (!initialTime) {
        initialTime = getInitialTime(format);
    }

    // Convert initial time string to milliseconds
    const [elapsedTime, setElapsedTime] = useState(timeToMilliseconds(initialTime, format));
    const timerRef = useRef(null); // Timer interval reference
    const lastTimeRef = useRef(elapsedTime); // Last saved time when page goes out of view

    // Start the timer
    const startTimer = (startTime = elapsedTime) => {
        setElapsedTime(timeToMilliseconds(startTime, format)); // Set elapsed time in milliseconds
        if (timerRef.current) return; // Prevent multiple timers
        timerRef.current = setInterval(() => {
            setElapsedTime(prevElapsedTime => prevElapsedTime + 100); // Update every 100 milliseconds
        }, 100);
    };

    // Stop the timer
    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Handle visibility changes to pause/resume timer
    const handleVisibilityChange = () => {
        if (document.hidden) {
            lastTimeRef.current = elapsedTime;
            stopTimer();
            console.log(lastTimeRef.current, elapsedTime)
        } else {
            startTimer(lastTimeRef.current);
        }
    };

    // Setup visibility change listener on mount
    useEffect(() => {
        return () => {
            stopTimer();
        };
    }, []);

    // Convert milliseconds to specified time format
    const formatDuration = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const ms = milliseconds % 1000;

        switch (format) {
            case 'HH:MM:SS':
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            case 'HH:MM':
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            case 'MM:SS':
                return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            case 'HH:MM:SS.m':
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(Math.floor(ms / 10)).padStart(2, '0')}`;
            default:
                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    };

    return {
        duration: formatDuration(elapsedTime),
        startTimer,
        stopTimer,
        destroyTimer: stopTimer // Alias for clarity
    };
};

export default useTimer;
