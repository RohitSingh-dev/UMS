import { useEffect } from 'react';

const usePreventDeveloperTools = () => {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (event) => {
            event.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);

        // Disable specific keyboard shortcuts
        const handleKeyDown = (event) => {
            // F12 key
            if (event.keyCode === 123) {
                event.preventDefault();
            }

            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
            if ((event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74 || event.keyCode === 67)) ||
                (event.ctrlKey && event.keyCode === 85)) {
                event.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // Detect if the developer tools are open
        let devtools = {
            isOpen: false,
            orientation: null
        };
        let threshold = 160;
        let emitEvent = (isOpen, orientation) => {
            window.dispatchEvent(new CustomEvent('devtoolschange', {
                detail: {
                    isOpen,
                    orientation
                }
            }));
        };

        let checkDevTools = (timeout) => {
            window.devtools = devtools;
            emitEvent(false, null);
            setInterval(() => {
                let widthThreshold = window.outerWidth - window.innerWidth > threshold;
                let heightThreshold = window.outerHeight - window.innerHeight > threshold;
                let orientation = widthThreshold ? 'vertical' : 'horizontal';
                if (!(heightThreshold && widthThreshold) &&
                    ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
                    if (!devtools.isOpen || devtools.orientation !== orientation) {
                        emitEvent(true, orientation);
                    }
                    devtools.isOpen = true;
                    devtools.orientation = orientation;
                } else {
                    if (devtools.isOpen) {
                        emitEvent(false, null);
                    }
                    devtools.isOpen = false;
                    devtools.orientation = null;
                }
            }, timeout);
        };

        // Start monitoring with a 500ms interval
        checkDevTools(500);

        // Add event listener to respond to devtools state changes
        const detectDevTools = (isOpen) => {
            if (isOpen) {
                alert("Developer tools are open!");
                // Optionally, redirect to another page
                window.location.replace("http://www.example.com");
            }
        };
        window.addEventListener('devtoolschange', (event) => {
            detectDevTools(event.detail.isOpen);
        });

        // Cleanup event listeners on component unmount
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
};

export default usePreventDeveloperTools;
