import { useState, useRef } from "react";

const useDrag = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleDragStart = (e) => {
        if (containerRef.current) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX + containerRef.current.scrollLeft,
                y: e.clientY + containerRef.current.scrollTop,
            });
        }
    };

    const handleDragMove = (e) => {
        if (isDragging && containerRef.current) {
            const deltaX = dragStart.x - e.clientX;
            const deltaY = dragStart.y - e.clientY;

            containerRef.current.scrollLeft = deltaX;
            containerRef.current.scrollTop = deltaY;
        }
    };

    const handleDragEnd = () => setIsDragging(false);

    const getDraggingCursor = () => {
        if (isDragging) return 'grabbing';
        return 'grab';
    }

    return {
        containerRef,
        handleDragStart,
        handleDragMove,
        handleDragEnd,
        getDraggingCursor
    };
};

export default useDrag;
