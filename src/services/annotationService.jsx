import {
    crossSvg,
    questionMarkSvg,
    tickSvg
} from "../components/QuestionPaperEvaluation/PaperEvaluationWindow/PopUpAnnoationImports.jsx";
import {TEXT_BOX_DEFAULT_WIDTH, TEXT_BOX_HEIGHT_OFFSET} from "../Util/AppConstant.jsx";

class AnnotationService {
    getTheImageList = async (width, height, allImages, allAnnotation) => {
        const annotatedImagesPromises = allImages.map((imageSrc, index) => {
            return new Promise((resolve, reject) => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const image = new Image();
                image.src = imageSrc;

                image.onload = () => {
                    const imageWidth = image.width;
                    const imageHeight = image.height;

                    canvas.width = imageWidth;
                    canvas.height = imageHeight;

                    ctx.drawImage(image, 0, 0);

                    const convertedAnnotation = annotationService.convertAnnotations(allAnnotation, canvas)
                    console.log(convertedAnnotation)

                    convertedAnnotation[index].forEach((annotation) => {
                        if (annotation.type === "tick" || annotation.type === "cross" || annotation.type === "questionMark") {
                            const scaledX = annotation.x;
                            const scaledY = annotation.y;
                            const scaledHeight = annotation.height;
                            const scaledWidth = annotation.width;

                            const newSvgElement = new Image();
                            newSvgElement.src = annotationService.getTheAnnotationImageByType(annotation.type)


                            ctx.drawImage(newSvgElement, scaledX, scaledY, scaledWidth, scaledHeight);
                        } else if (annotation.type === "rect") {
                            const scaledX = annotation.x;
                            const scaledY = annotation.y;
                            const scaledHeight = annotation.height;
                            const scaledWidth = annotation.width;
                            ctx.lineWidth = 2;
                            annotationService.drawRectangle(ctx, scaledX, scaledY, scaledWidth, scaledHeight);
                        } else if (annotation.type === 'line' && annotation.segments) {
                            let scaledX
                            let scaledY
                            annotation.segments.forEach(segment => {
                                if (segment.coordinates !== undefined && segment.coordinates.length > 1) {
                                    scaledX = segment.coordinates[0].x;
                                    scaledY = segment.coordinates[0].y;
                                    // Begin new path
                                    ctx.strokeStyle = 'red';
                                    ctx.lineWidth = 5
                                    ctx.beginPath();
                                    ctx.moveTo(scaledX, scaledY);

                                    // Draw the line segments
                                    for (let i = 1; i < segment.coordinates.length; i++) {
                                        scaledX = segment.coordinates[i].x;
                                        scaledY = segment.coordinates[i].y;
                                        ctx.lineTo(scaledX, scaledY);
                                    }
                                    ctx.stroke();
                                    ctx.closePath();
                                }
                            })
                        } else if (annotation.type === 'comment') {
                            this.drawTextBox(ctx, annotation)
                        }
                    });

                    // Convert canvas to data URL
                    const dataURL = canvas.toDataURL();
                    resolve(dataURL);
                };

                image.onerror = (error) => {
                    reject(error);
                };
            });
        });

        return Promise.all(annotatedImagesPromises);
    }

    getTheAnnotationImageByType = (type) => {
        console.log()
        switch (type) {
            case "tick":
                return tickSvg
            case "cross":
                return crossSvg
            case "questionMark":
                return questionMarkSvg
        }
    }

    drawRectangle = (ctx, x, y, width, height, color = 'blue') => {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.strokeStyle = color;
        ctx.stroke();
    };


    getSystemDependentX = (x, canvas) => {
        const canvasWidth = canvas.width;
        const systemWidth = screen.width

        return (x / 100) * canvasWidth * systemWidth;
    }

    getSystemDependentY = (y, canvas) => {
        const canvasHeight = canvas.height;
        const systemHeight = screen.height

        return (y / 100) * canvasHeight * systemHeight;
    }

    getSystemDependentH = (h, canvas) => {
        const canvasHeight = canvas.height;
        const systemHeight = screen.height

        return (h / 100) * canvasHeight * systemHeight;
    }

    getSystemDependentW = (w, canvas) => {
        const canvasWidth = canvas.width;
        const systemWidth = screen.width

        return (w / 100) * canvasWidth * systemWidth;
    }


    convertPosition = (annotation, canvas) => {
        return {
            ...annotation,
            x: this.getSystemDependentX(annotation.x, canvas),
            y: this.getSystemDependentY(annotation.y, canvas),
            width: this.getSystemDependentW(annotation.width, canvas),
            height: this.getSystemDependentH(annotation.height, canvas),
        };

    };

    convertTextBox = (textBox, canvas) => {
        return {
            ...textBox,
            cursorX: this.getSystemDependentX(textBox.cursorX, canvas),
            cursorY: this.getSystemDependentY(textBox.cursorY, canvas),
        };

    };

    convertCommentPosition = (annotation, canvas) => {
        return {
            ...annotation,
            x: this.getSystemDependentX(annotation.x, canvas),
            y: this.getSystemDependentY(annotation.y, canvas),
            width: this.getSystemDependentW(annotation.width, canvas),
            height: this.getSystemDependentH(annotation.height, canvas),
            textBox: this.convertTextBox(annotation.textBox, canvas)
        };

    };


// Helper function to convert coordinates within line segments
    convertSegments = (segments, canvas) =>
        segments.map((segment) => {
            if (segment.coordinates && segment.coordinates.length > 1) {
                return {
                    ...segment,
                    coordinates: segment.coordinates.map((coordinate) => ({
                        ...coordinate,
                        x: this.getSystemDependentX(coordinate.x, canvas),
                        y: this.getSystemDependentY(coordinate.y, canvas)
                    })),
                };
            }
            return segment;
        });

// Main function to convert annotations
    convertAnnotations = (allAnnotations, canvas) =>
        allAnnotations.map((annotations) => {
            if (annotations.length === 0) {
                return [];  // Handle empty annotation lists
            }

            return annotations.map((annotation) => {
                // Process each annotation based on its type
                if (["tick", "cross", "questionMark", "rect"].includes(annotation.type)) {
                    return this.convertPosition(annotation, canvas);
                } else if (annotation.type === "comment") {
                    return this.convertCommentPosition(annotation, canvas)
                } else if (annotation.type === "line" && annotation.segments) {
                    const updatedSegments = this.convertSegments(annotation.segments, canvas);
                    return {...annotation, segments: updatedSegments};
                }
                return annotation;
            });
        });

    convertAnnotation = (annotation, canvas) => {
        // Check the type of annotation and process accordingly
        if (["tick", "cross", "questionMark", "rect"].includes(annotation.type)) {
            return this.convertPosition(annotation, canvas);
        } else if (annotation.type === "comment") {
            return this.convertCommentPosition(annotation, canvas);
        } else if (annotation.type === "line" && annotation.segments) {
            const updatedSegments = this.convertSegments(annotation.segments, canvas);
            return {...annotation, segments: updatedSegments};
        }
        // Return the annotation unchanged if no specific processing is needed
        return annotation;
    };


    getSystemIndependentX = (x, canvas) => {
        const canvasWidth = canvas.width;
        const systemWidth = screen.width

        return (x / (canvasWidth * systemWidth)) * 100;
    }

    getSystemIndependentY = (y, canvas) => {
        const canvasHeight = canvas.height;
        const systemHeight = screen.height

        return (y / (canvasHeight * systemHeight)) * 100;
    }

    getSystemIndependentH = (height, canvas) => {
        const canvasHeight = canvas.height;
        const systemHeight = screen.height

        return (height / (canvasHeight * systemHeight)) * 100;
    }

    getSystemIndependentW = (width, canvas) => {
        const canvasWidth = canvas.width;
        const systemWidth = screen.width

        return (width / (canvasWidth * systemWidth)) * 100;
    }


    getLine = (textbox, ctx, text = null) => {
        const {textBox} = textbox;
        const padding = textBox.padding || 0; // Default padding if not defined
        const currentWidth = textbox.width || TEXT_BOX_DEFAULT_WIDTH;

        const fontSize = textBox.fontSize || 10; // Default fontSize if not defined

        // Calculate lineHeight based on font size
        const lineHeight = fontSize * 1.2; // Default lineHeight if not defined


        // Get the text, default to the one in textBox if not provided
        const fullText = text === null ? textBox.text : text;

        // Split the text into lines based on \n
        const paragraphs = fullText.split("\n");
        const lines = [];
        const maxWidth = currentWidth - padding * 2;

        paragraphs.forEach((paragraph) => {
            const words = paragraph.split(" ");
            let currentLine = "";

            for (let word of words) {
                const testLine = currentLine ? `${currentLine}${word} ` : `${word} `;
                const testWidth = ctx.measureText(testLine).width;

                if (testWidth > maxWidth && currentLine !== "") {
                    // Push the current line and reset for the next
                    lines.push(currentLine.trim());
                    currentLine = "";
                }

                if (ctx.measureText(word).width > maxWidth) {
                    // Handle long words with no spaces or words that still exceed maxWidth
                    let wordPart = "";
                    for (let char of word) {
                        const charTestLine = wordPart + char;
                        const charTestWidth = ctx.measureText(charTestLine).width;

                        if (charTestWidth > maxWidth) {
                            if (wordPart) {
                                lines.push(wordPart);
                            }
                            wordPart = char; // Start a new line with the current character
                        } else {
                            wordPart += char;
                        }
                    }
                    if (wordPart.trim()) {
                        currentLine += wordPart + " ";
                    }
                } else {
                    currentLine += `${word} `;
                }
            }

            // Add the last line of the paragraph
            if (currentLine) {
                lines.push(currentLine);
            }
        });
        const numberOfLines = lines.length;
        const dynamicHeight = (numberOfLines * lineHeight) + TEXT_BOX_HEIGHT_OFFSET;


        return {lines, dynamicHeight};
    };


    getCursorXAndY = (textbox, canvas, ctx, text = null, isSystemDependent = false) => {
        const {x, y, textBox} = textbox;
        const {lines, dynamicHeight} = this.getLine(textbox, ctx, text);
        const cursorLine = lines[lines.length - 1] || "";

        const padding = textBox.padding;
        const fontSize = textBox.fontSize || 10;
        const lineHeight = fontSize * 1.2;

        const lineIndex = Math.min(lines.length - 1, textBox.maxLines - 1);

        let cursorX = ctx.measureText(cursorLine).width +
            (isSystemDependent ? x : annotationService.getSystemDependentX(x, canvas)) +
            padding;

        let cursorY = (isSystemDependent ? y : annotationService.getSystemDependentY(y, canvas)) +
            padding +
            (lineIndex * lineHeight);

        if (lines.length === 0) {
            cursorX = x + 5;
            cursorY = y + 5.95;
        }

        return {cursorX, cursorY, dynamicHeight};
    };


    checkRightSideHover = (offsetX, offsetY, comment) => {
        // Right side line coordinates (x + w, y) to (x + w, y + h)
        const rightX = comment.x + comment.width;  // x + width (the x-coordinate of the right side line)
        const y1 = comment.y;  // y (top of the rectangle)
        const y2 = comment.y + comment.height;  // y + height (bottom of the rectangle)

        const buffer = 5; // 5px buffer around the line

        return (offsetX >= rightX - buffer && offsetX <= rightX + buffer && offsetY >= y1 && offsetY <= y2)
    }


    drawTextBox = (ctx, textbox) => {
        const {x, y, width, height, textBox} = textbox;

        ctx.fillStyle = textBox.fill || "rgba(255, 255, 255, 1)";
        ctx.fillRect(x, y, width, height);
        ctx.strokeStyle = textBox.strokeColor;
        ctx.lineWidth = textBox.strokeWidth;
        if (textBox.strokeWidth > 0) {
            ctx.strokeRect(x, y, width, height);
        }
        const fontSize = textBox.fontSize || 10; // Default fontSize if not defined

        // Calculate lineHeight based on font size
        const lineHeight = fontSize * 1.2;

        // Set font size, family, and color dynamically
        const fontFamily = textBox.font || "Arial"; // Default font family to Arial if not provided
        const fontColor = textBox.fontColor || "black"; // Default font color to black if not provided

        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = "left";
        ctx.textBaseline = "top"

        const {lines} = annotationService.getLine(textbox, ctx);

        // Ensure we only draw up to maxLines
        for (let i = 0; i < Math.min(lines.length, textBox.maxLines); i++) {
            ctx.fillText(lines[i], x + textBox.padding, y + textBox.padding + i * lineHeight);
        }
    };


}

const annotationService = new AnnotationService()

export default annotationService;