import {useEffect, useRef, useState} from 'react';
import './DraggableOverlay.css';

const DraggableOverlay = () => {
    const [position, setPosition] = useState({ x: 921, y: 5 });
    const overlayRef = useRef(null);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const onMouseDown = (e) => {
        dragging.current = true;
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
        if (!dragging.current) return;
        setPosition({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y,
        });
    };

    const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <button
            ref={overlayRef}
            className="overlay"
            aria-label="Draggable Overlay"
            tabIndex="0"
            style={{ left: position.x, top: position.y }}
            onMouseDown={onMouseDown}
        >
            <div className="overlay-content">
                <span className="danger-dot"></span> {/* Add the red blinking dot */}
                <p>Payment is on test mode!</p>
            </div>
        </button>
    );
};

export default DraggableOverlay;
