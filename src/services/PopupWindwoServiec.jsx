import {MIN_HEIGHT, MIN_WIDTH} from "../components/Util/AppConstant.jsx";

const openPopupWindow = (url, title, data, onCleanup) => {
    const width = Math.max(MIN_WIDTH, window.screen.width);
    const height = Math.max(MIN_HEIGHT, window.screen.height);
    const left = 0;
    const top = 0;
    const encodedData = encodeURIComponent(JSON.stringify(data))
    const fullUrl = `${url}?data=${encodedData}`
    const windowFeatures = [
        `width=${width}`,
        `height=${height}`,
        `top=${top}`,
        `left=${left}`,
        'toolbar=no',
        'location=no',
        'directories=no',
        'status=no',
        'menubar=no',
        'scrollbars=yes',
        'resizable=no',
        'channelmode=no',
        'fullscreen=no',
        'dependent=yes',
        'dialog=yes'
    ].join(',');

    const newWindow = window.open(fullUrl, title, windowFeatures);

    if (newWindow === null) {
        alert('Popup was blocked! Please allow popups for this site.');
        return null;
    }

    if (newWindow) {
        newWindow.moveTo(left, top);
        newWindow.resizeTo(width, height);

        let isClosingWithButton = false;
        newWindow.onload = () => {
            // Override the close button behavior
            newWindow.addEventListener('beforeunload', (e) => {
                if (isClosingWithButton) {
                    return; // Don't show confirmation if closing with button
                }
                onCleanup();
                const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
                e.returnValue = confirmationMessage;     // Required for Chrome
                return confirmationMessage;              // Required for Firefox
            });

            // Prevent opening as a new tab by checking window dimensions
            if (newWindow.outerWidth > width + 100) {  // Adding tolerance
                alert('Please allow the page to open as a popup window, not a new tab.');
                newWindow.close();
                return null;
            }

            // Expose the flag to the window
            newWindow.closingWithButton = () => {
                isClosingWithButton = true; // Set flag when closing with button
                if (onCleanup) {
                    onCleanup(); // Call cleanup when closing with custom button
                }
            };
        };
    }
    return newWindow;
};


export default openPopupWindow