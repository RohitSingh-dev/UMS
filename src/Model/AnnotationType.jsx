class AnnotationType {
    constructor(id = Date.now(),type, x, y, width = 0, height = 0,  segments = null, textBox=null) {
        this.id = id;  // Unique identifier for the annotation
        this.x = x;
        this.y = y;
        this.type = type;
        // Optional: Initialize other properties if needed
        this.width = width;
        this.height = height;
        this.segments = segments;
        this.textBox = textBox
    }
}

export default AnnotationType;


