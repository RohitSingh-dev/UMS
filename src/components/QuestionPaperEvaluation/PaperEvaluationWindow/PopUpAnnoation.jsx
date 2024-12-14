import {
    AnnotationType,
    axios,
    Button,
    Card,
    commonFunctionService,
    CookieHelper,
    Coordinates,
    crossSvg,
    eraserSvg,
    faMagnifyingGlass,
    faMagnifyingGlassMinus,
    faMagnifyingGlassPlus,
    FontAwesomeIcon,
    JWT_COOKIES_NAME,
    LineSegments,
    NavLink,
    pencilSvg,
    ProgressBar,
    ProgressModal,
    questionMarkSvg,
    rectSvg,
    resetProgress,
    tickSvg,
    Toast,
    updateBackendProgress,
    useDispatch,
    useEffect,
    useForm,
    useLocation,
    useNavigate,
    useRef,
    useScreenSize,
    useSelector,
    useState,
    useTimer,
    webSocketService
} from './PopUpAnnoationImports.jsx'
import {
    faBook,
    faChevronLeft,
    faChevronRight,
    faDownload,
    faFont,
    faPencil,
    faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import {
    ANNOTATION_HEIGHT,
    ANNOTATION_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH,
    NOT_ANSWERED_QUESTION_MARKS
} from "../../Util/AppConstant.jsx";
import TogglePanel from "./TogglePanel.jsx";
import annotationService from "../../../services/annotationService.jsx";
import TextBox from "../../../Model/TextBox.jsx";
import {TEXT_AREA_DEFAULT_HEIGHT, TEXT_BOX_DEFAULT_WIDTH, TEXT_BOX_MIN_WIDTH} from "../../../Util/AppConstant.jsx";
import CommentBoxEditPanel from "./CommentBoxEditPanel.jsx";

const PopUpAnnotation = () => {
    // <editor-fold desc="Const variables">
    // usePreventDeveloperTools()
    const dispatch = useDispatch()
    const progress = useSelector(state => state.webSocket.backendProgress)
    const progressStatus = useSelector(state => state.webSocket.backendProgressStatus)
    const canvasRef = useRef(null)
    const imgRef = useRef(null)
    const screenSize = useScreenSize()
    const [selectedIcon, setSelectedIcon] = useState(null)
    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)
    const [imageRatio, setImageRatio] = useState(0)
    const [rectangleDrawing, setRectangleDrawing] = useState(false)
    const [resizingRectangle, setResizingRectangle] = useState(null)
    const [allAnnotation, setAllAnnotation] = useState([])
    const [cursor, setCursor] = useState(null)
    const [zoomScale, setZoomScale] = useState(1)
    const [allImages, setAllImages] = useState([])
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [isImageLoaded, setIsImageLoaded] = useState(false)
    const [fullMarks, setFullMarks] = useState(0)
    const [subject, setSubject] = useState(null)
    const [totalQuestions, setTotalQuestions] = useState(0)
    const [questionsGroups, setQuestionsGroups] = useState(null)
    const [isLineDrawing, setIsLineDrawing] = useState(false)
    const [coordinates, setCoordinates] = useState([])
    const [isPencilSelected, setIsPencilSeleted] = useState(false)
    const [isEraseModeOn, setEraseMode] = useState(false)
    const [visitedPageNumbers, setVisitedPageNumbers] = useState([1])
    const [questionPaper, setQuestionPaper] = useState(null)
    const [answerSheet, setAnswerSheet] = useState(null)
    const [answerSheetId, setAnswerSheetId] = useState(null)
    const [isProgressModalIsOpen, SetProgressModalIsOpen] = useState(false)
    const {duration, startTimer, destroyTimer} = useTimer('HH:MM:SS')
    const [pending, setPending] = useState(0)
    const [totalMarks, setTotalMarks] = useState(0)
    const [disabledInputs, setDisabledInputs] = useState({});
    const masked = new Set([0]);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({x: 0, y: 0});
    const containerRef = useRef(null);
    const location = useLocation();
    const toast = useRef(null);
    let height = screenSize.height
    const token = CookieHelper.getCookie(JWT_COOKIES_NAME);
    const [activePanel, setActivePanel] = useState(null);
    const [isScreenSupported, setIsScreenSupported] = useState(true);
    const [isAllQuestionsAllowed, setIsAllQuestionsAllowed] = useState(false);
    const [cursorInsideCanvas, setCursorInsideCanvas] = useState(false)
    const [isScoringPanelClicked, setIsScoringPanelClicked] = useState(false);
    const navigate = useNavigate();
    const [activeComment, setActiveComment] = useState(null);
    const activeCommentRef = useRef(activeComment);
    const cornerSize = 10; // Size of the draggable c
    const [isCommentCornerSelected, setIsCommentCornerSelected] = useState(false);
    const [draggingTheComment, setDraggingTheComment] = useState(false);
    const [isCommentRightSideSelected, setIsCommentRightSideSelected] = useState(false)
    const [isResizingComment, setIsResizingComment] = useState(false);
    const textBoxBlinkingCursorIntervalRef = useRef(null)

// </editor-fold>

    const {
        register, handleSubmit, setError, formState: {errors}, setValue, getValues
    } = useForm();

    const togglePanel = (panel) => {
        if (activePanel === panel) {
            setActivePanel(null);
        } else {
            setActivePanel(panel);
        }
    };
    const handleButtonClick = (fieldName) => {
        const isCurrentlyDisabled = disabledInputs[fieldName];

        if (isCurrentlyDisabled) {
            setValue(fieldName, ''); // Clear the input field
            setDisabledInputs((prevState) => ({
                ...prevState, [fieldName]: false, // Enable this specific input
            }));
            setPending((prevPending) => prevPending + 1); // Increment pending count
        } else {
            setValue(fieldName, '0');
            setDisabledInputs((prevState) => ({
                ...prevState, [fieldName]: true, // Disable this specific input
            }));
            setPending((prevPending) => prevPending - 1); // Decrement pending count
        }

        onMarksPut();
    };
    const deselectAnnotation = () => {
        if (activeComment !== null) {
            setActiveComment(null)
            setAllAnnotation((prevState) => {
                return prevState.map((annotations) => {
                    return annotations.map((annotation) => {
                        return {
                            ...annotation, textBox: {
                                ...annotation.textBox, isFocused: false,
                            },
                        };

                    });
                });
            });
        }
        setSelectedIcon(null);
        setCursor('grab');
        setIsPencilSeleted(false);
    };

    // <editor-fold desc="useEffect Hooks">

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown, {passive: false});
        setVisitedPageNumbers([0]);
        // Cleanup event listener on component unmount

        if (allImages.length === 0) {
            const params = new URLSearchParams(location.search);
            const encodedData = params.get('data');
            if (encodedData) {
                const parsedData = JSON.parse((encodedData));
                setAnswerSheetId(parsedData.answerScriptId)

                dispatch(updateBackendProgress(0))
                webSocketService.connect();

                axios.get("evaluation/getAllAnswerSheetDetails", {
                    headers: {
                        "Content-Type": "application/json", Authorization: `Bearer ${token}`,
                    }, params: {
                        answerScriptId: parsedData.answerScriptId
                    }
                }).then((res) => {
                    const allData = res.data
                    console.log(allData)
                    const draft_details = allData.draft_details
                    //Set the Question Numbers
                    setTotalQuestions(allData.questionNumbers.totalQuestion);
                    setPending(allData.questionNumbers.totalQuestion);
                    setFullMarks(allData.questionNumbers.fullMarks);
                    setSubject(allData.questionNumbers.subject);
                    setQuestionsGroups(allData.questionNumbers.groups);

                    setQuestionPaper(allData.questionPaper)
                    setAnswerSheet(allData.answerSheet)
                    setIsAllQuestionsAllowed(true)

                    //Set The Images
                    setAllImages(allData.images)
                    const updatedAnnotations = [...allAnnotation]
                    // eslint-disable-next-line no-unused-vars
                    for (const element of allData.images) {
                        updatedAnnotations.push([])
                    }
                    setAllAnnotation(updatedAnnotations)
                    setIsImageLoaded(true)
                    if (draft_details === null) {
                        startTimer()
                    } else {
                        startTimer(draft_details.duration)
                        const parsedAnnotations = JSON.parse(draft_details.annotations);
                        setAllAnnotation(parsedAnnotations);
                        setPending(allData.questionNumbers.totalQuestion - draft_details.obtain_marks.length)
                        let total = 0;
                        draft_details.obtain_marks.forEach((mark) => {
                            const inputName = mark.id
                            if (mark.marks === NOT_ANSWERED_QUESTION_MARKS) {
                                setValue(inputName, 0)
                                setDisabledInputs(prevState => ({
                                    ...prevState, [inputName]: true
                                }));
                            } else {
                                setValue(inputName, mark.marks)
                                total += mark.marks
                            }
                            setTotalMarks(total.toFixed(1))
                        });
                    }
                })
                    .catch((ex) => {
                        console.log(ex)
                    })
            }

        }
        return (() => {
            webSocketService.disconnect()
            window.removeEventListener('keydown', handleKeyDown);
            destroyTimer()
        })
    }, [])

    useEffect(() => {
        // Function to check window size and update state
        const checkScreenSize = () => {
            const isSupported = window.innerWidth >= MIN_WIDTH && window.innerHeight >= MIN_HEIGHT;
            setIsScreenSupported(isSupported);
        };

        // Initial check on mount
        checkScreenSize();

        // Add event listener to resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    useEffect(() => {
        if (isImageLoaded) {
            const image = new Image();
            image.src = allImages[activeImageIndex];

            image.onload = () => {
                if (!imageWidth || !imageHeight) {
                    setImageWidth(image.width);
                    setImageHeight(image.height);
                    setImageRatio(image.width / image.height);
                }
            };
        }
    }, [allImages, activeImageIndex, isImageLoaded]);

    useEffect(() => {
        if (isImageLoaded && !masked.has(activeImageIndex)) {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");

                // Clear canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw image on canvas only once
                if (!imageWidth || !imageHeight) {
                    canvas.width = height * imageRatio;
                    canvas.height = height;
                    const image = new Image();
                    image.src = allImages[activeImageIndex];
                    image.onload = () => {
                        ctx.drawImage(image, 0, 0);
                    };
                } else {
                    const convertedAnnotation = annotationService.convertAnnotations(allAnnotation, canvasRef.current)
                    convertedAnnotation[activeImageIndex].forEach((annotation) => {
                        if (annotation.type === "tick" || annotation.type === "cross" || annotation.type === "questionMark") {
                            const newSvgElement = new Image();
                            newSvgElement.src = annotationService.getTheAnnotationImageByType(annotation.type);
                            ctx.drawImage(newSvgElement, annotation.x + annotation.width / 10, annotation.y + annotation.height / 10, annotation.width, annotation.height);
                        } else if (annotation.type === "rect") {
                            ctx.lineWidth = 2
                            annotationService.drawRectangle(ctx, annotation.x, annotation.y, annotation.width, annotation.height);
                        } else if (annotation.type === 'line' && annotation.segments) {
                            annotation.segments.forEach(segment => {
                                if (segment.coordinates !== undefined && segment.coordinates.length > 1) {
                                    // Begin new path
                                    ctx.strokeStyle = 'red';
                                    ctx.lineWidth = 2
                                    ctx.beginPath();
                                    ctx.moveTo(segment.coordinates[0].x, segment.coordinates[0].y);

                                    // Draw the line segments
                                    //TODO: Change to while loop
                                    for (let i = 1; i < segment.coordinates.length; i++) {
                                        ctx.lineTo(segment.coordinates[i].x, segment.coordinates[i].y);
                                    }
                                    ctx.stroke();
                                    ctx.closePath();
                                }
                            })
                        } else if (annotation.type === 'comment') {
                            drawTextBox(ctx, annotation)
                        }
                    });

                }
            }
        }
    }, [allAnnotation, imageWidth, imageHeight, height, allImages, activeImageIndex, isImageLoaded]);

    useEffect(() => {
        activeCommentRef.current = activeComment;
        if (activeComment !== null) {
            if (textBoxBlinkingCursorIntervalRef.current !== null) {
                clearInterval(textBoxBlinkingCursorIntervalRef.current)
            }
            textBoxBlinkingCursorIntervalRef.current = setInterval(() => {
                setAllAnnotation((prevState) => {
                    return prevState.map((annotations) => {
                        return annotations.map((annotation) => {
                            if (annotation.id === activeComment.id) {
                                // Toggle cursorVisible for the active comment
                                return {
                                    ...annotation, textBox: {
                                        ...annotation.textBox, cursorVisible: !annotation.textBox.cursorVisible,
                                    },
                                };
                            }
                            return annotation; // Keep other annotations unchanged
                        });
                    });
                });
            }, 500)
        } else if (textBoxBlinkingCursorIntervalRef.current !== null) {
            clearInterval(textBoxBlinkingCursorIntervalRef.current)
            textBoxBlinkingCursorIntervalRef.current = null
        }

        //Clear the interval when this component unmount
        return () => {
            if (textBoxBlinkingCursorIntervalRef.current !== null) {
                clearInterval(textBoxBlinkingCursorIntervalRef.current)
                textBoxBlinkingCursorIntervalRef.current = null
            }
        }
    }, [activeComment]);
    //</editor-fold>


    const drawTextBox = (ctx, textbox) => {
        const {textBox} = textbox;
        annotationService.drawTextBox(ctx,textbox)

        if (textBox.isFocused) {
            if (textBox.cursorVisible) {
                const fontSize = textBox.fontSize || 10;

                // Calculate lineHeight based on font size
                const lineHeight = fontSize * 1.2;

                // Set font size, family, and color dynamically
                const fontColor = textBox.fontColor || "black";

                const cursorX = textBox.cursorX;
                const cursorY = textBox.cursorY;

                ctx.beginPath();
                ctx.moveTo(cursorX, cursorY);
                ctx.lineTo(cursorX, cursorY + lineHeight);
                ctx.strokeStyle = fontColor;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            if (activeComment == null || textbox.id !== activeComment.id) {
                setActiveComment(textbox);
            }
        }
    };

    //<editor-fold default-state="collapsed" desc="Click events">
    const handleCanvasClick = (event) => {
        if (selectedIcon) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            let zoom = zoomScale.toFixed(2);
            // Calculate system-independent cursor position
            const cursorX = (event.clientX - rect.left) / zoom;
            const cursorY = (event.clientY - rect.top) / zoom;

            // Define annotation dimensions based on the icon
            const annotationWidth = selectedIcon === "rect" ? 50 : 40; // Width of annotation (in px, assuming default values)
            const annotationHeight = selectedIcon === "rect" ? 50 : 40; // Height of annotation (in px, assuming default values)

            // Ensure the cursor plus annotation dimensions are within bounds
            if (
                cursorX < 0 ||
                cursorY < 0 ||
                cursorX + annotationWidth > canvas.width ||
                cursorY + annotationHeight > canvas.height ||
                cursorX + TEXT_BOX_DEFAULT_WIDTH > canvas.width ||
                cursorY + TEXT_AREA_DEFAULT_HEIGHT > canvas.height
            ) {
                return; // Exit if the annotation would exceed the canvas bounds
            }

            // Calculate the system-independent coordinates
            const x = annotationService.getSystemIndependentX((event.clientX - rect.left) / zoom, canvas);
            const y = annotationService.getSystemIndependentY((event.clientY - rect.top) / zoom, canvas);
            if (selectedIcon === "comment") {

                if (isCommentCornerSelected && activeCommentRef.current !== null) {
                    setDraggingTheComment(false)
                    setIsCommentCornerSelected(false)
                    return
                }
                if ((isResizingComment || isCommentRightSideSelected) && activeCommentRef.current !== null) {
                    setIsResizingComment(false)
                    setIsCommentRightSideSelected(false)
                    return
                }

                let found = false
                const updatedAnnotations = allAnnotation.map((annotations, index) => {
                    if (index === activeImageIndex) {
                        return annotations.map((annotation) => {
                            if (annotation.type === "comment" && x >= annotation.x && x <= annotation.x + annotation.width && y >= annotation.y && y <= annotation.y + annotation.height) {
                                found = true; // Click is inside a comment box
                                return {
                                    ...annotation, textBox: {
                                        ...annotation.textBox, isFocused: true,
                                    },
                                };
                            } else {
                                return {
                                    ...annotation, textBox: {
                                        ...annotation.textBox, isFocused: false,
                                    },
                                };
                            }
                        });
                    }
                    return annotations;
                });

                // Update annotations based on the result
                if (found) {
                    setAllAnnotation(updatedAnnotations); // Focus the clicked comment box
                } else {
                    // Add a new comment box at the clicked position
                    const width = annotationService.getSystemIndependentW(TEXT_BOX_DEFAULT_WIDTH, canvas);
                    const height = annotationService.getSystemIndependentH(TEXT_AREA_DEFAULT_HEIGHT, canvas);
                    const textBox = new TextBox();
                    textBox.isFocused = true;

                    const newAnnotation = new AnnotationType(Date.now(), "comment", x, y, width, height, null, textBox);

                    const annotations = annotationService.convertAnnotation(newAnnotation, canvas)

                    const {
                        cursorX, cursorY,
                    } = annotationService.getCursorXAndY(annotations, canvas, canvas.getContext("2d"), null, true)

                    textBox.cursorX = annotationService.getSystemIndependentX(cursorX, canvas);
                    textBox.cursorY = annotationService.getSystemIndependentY(cursorY, canvas);


                    setAllAnnotation((prevState) => {
                        const newState = [...prevState]; // Create a copy of the state
                        const updatedAnnotations = newState[activeImageIndex].map((annotation) => ({
                            ...annotation, textBox: {
                                ...annotation.textBox, isFocused: false,
                            },
                        }));
                        // Add the new annotation
                        newState[activeImageIndex] = [...updatedAnnotations, newAnnotation];
                        return newState;
                    });
                }

            } else if (selectedIcon === "rect") {
                if (rectangleDrawing) {
                    setResizingRectangle(null);
                    setRectangleDrawing(false);
                } else {

                    let rectanglesAnnotations = new AnnotationType(Date.now(), selectedIcon, x, y);
                    setAllAnnotation(prevState => {
                        const newState = [...prevState]
                        newState[activeImageIndex] = [...newState[activeImageIndex], rectanglesAnnotations];
                        return newState;
                    });
                    setResizingRectangle(rectanglesAnnotations);
                    setRectangleDrawing(true);

                }
            } else if (selectedIcon === "tick" || selectedIcon === "cross" || selectedIcon === "questionMark") {
                const newSvgElement = new Image();

                newSvgElement.src = annotationService.getTheAnnotationImageByType(selectedIcon)

                newSvgElement.onload = () => {
                    const svgWidth = annotationService.getSystemIndependentW(ANNOTATION_WIDTH, canvas)
                    const svgHeight = annotationService.getSystemIndependentH(ANNOTATION_HEIGHT, canvas)
                    let annotations = new AnnotationType(Date.now(), selectedIcon, x, y, svgWidth, svgHeight)
                    setAllAnnotation(prevState => {
                        const newState = [...prevState]
                        newState[activeImageIndex] = [...newState[activeImageIndex], annotations];
                        return newState;
                    });
                };
            }
        }
    }
    const onmousedown = (event) => {
        if (selectedIcon && selectedIcon === 'line') {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            const rect = canvas.getBoundingClientRect();
            let zoom = zoomScale.toFixed(2);

            let x = (event.clientX - rect.left) / zoom
            let y = (event.clientY - rect.top) / zoom

            ctx.strokeStyle = 'red';

            ctx.lineWidth = 2

            setIsLineDrawing(true)
            ctx.beginPath();
            ctx.moveTo(x, y)

            x = annotationService.getSystemIndependentX(x, canvas);
            y = annotationService.getSystemIndependentY(y, canvas);

            setCoordinates([new Coordinates(x, y)])
        } else if (selectedIcon && selectedIcon === 'eraser') {
            setEraseMode(true)
        } else if (isCommentCornerSelected && activeCommentRef.current !== null) {
            setDraggingTheComment(true)
        } else if (isCommentRightSideSelected && activeCommentRef.current !== null) {
            setIsResizingComment(true)
        }
    }
    const cancelDraw = (event) => {
        if (isLineDrawing) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            const rect = canvas.getBoundingClientRect();
            let zoom = zoomScale.toFixed(2);

            const x = annotationService.getSystemIndependentX((event.clientX - rect.left) / zoom, canvas);
            const y = annotationService.getSystemIndependentY((event.clientY - rect.top) / zoom, canvas);

            setIsLineDrawing(false)
            // ctx.lineWidth = 2;
            ctx.closePath();
            setCoordinates((prevState) => [...prevState, new Coordinates(x, y)])

            let segments = [new LineSegments(coordinates)]
            let lineAnnotation = new AnnotationType(Date.now(), 'line', 0, 0, 0, 0, segments)
            setAllAnnotation(prevState => {
                const newState = [...prevState]
                newState[activeImageIndex] = [...newState[activeImageIndex], lineAnnotation];
                return newState;
            });
            setCoordinates([])
        } else if (isEraseModeOn) {
            setEraseMode(false)
        }

        if (isDragging) setIsLineDrawing(false)
        if (isResizingComment) setIsResizingComment(false)
    }
    const handleMouseMove = (event) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d")
        const rect = canvas.getBoundingClientRect();
        let zoom = zoomScale.toFixed(2);

        if (resizingRectangle) {
            ctx.lineWidth = 2
            ctx.strokeStyle = 'blue'
            const mouseX = (event.clientX - rect.left) / zoom;
            const mouseY = (event.clientY - rect.top) / zoom;

            const width = mouseX - resizingRectangle.x;
            const height = mouseY - resizingRectangle.y;

            resizingRectangle.width = annotationService.getSystemIndependentW(width, canvas);
            resizingRectangle.height = annotationService.getSystemIndependentH(height, canvas);

            setAllAnnotation(prevState => {
                const newState = [...prevState];
                const updatedRect = [...newState[activeImageIndex]];
                updatedRect[updatedRect.length - 1] = resizingRectangle;
                newState[activeImageIndex] = updatedRect;
                return newState;
            });
        } else if (isLineDrawing) {
            let x = (event.clientX - rect.left) / zoom
            let y = (event.clientY - rect.top) / zoom

            ctx.lineTo(x, y);
            ctx.stroke();

            x = annotationService.getSystemIndependentX(x, canvas);
            y = annotationService.getSystemIndependentY(y, canvas);

            setCoordinates((prevState) => [...prevState, new Coordinates(x, y)])
        } else if (isEraseModeOn) {
            const x = annotationService.getSystemIndependentX((event.clientX - rect.left) / zoom, canvas);
            const y = annotationService.getSystemIndependentY((event.clientY - rect.top) / zoom, canvas);
            eraseLine(ctx, x, y, 0.0009)

        } else if (selectedIcon && selectedIcon === 'comment' && activeCommentRef.current !== null && (!draggingTheComment && !isResizingComment)) {
            const comment = activeCommentRef.current

            const offsetX = event.nativeEvent.offsetX;
            const offsetY = event.nativeEvent.offsetY;

            const distance = Math.sqrt(Math.pow(offsetX - comment.x, 2) + Math.pow(offsetY - comment.y, 2));

            const isOverCorner = distance <= cornerSize;
            setIsCommentCornerSelected(isOverCorner)

            if (isOverCorner) {
                setCursor("grab");
                setIsCommentRightSideSelected(false)
            } else {
                const isOverSide = annotationService.checkRightSideHover(offsetX, offsetY, comment)
                setIsCommentRightSideSelected(isOverSide)
                if (isOverSide) {
                    setCursor("ew-resize");
                } else {
                    setCursor("default");
                }
            }

        } else if (draggingTheComment) {
            const comment = activeCommentRef.current
            const canvas = canvasRef.current
            const X = event.nativeEvent.offsetX
            const Y = event.nativeEvent.offsetY
            setCursor('grabbing')

            if (X < 5 || Y < 5) {
                setDraggingTheComment(false)
                setIsCommentCornerSelected(false)
                return;
            } else if ((X + comment.width > canvas.width - 5) || (Y + comment.height > canvas.height - 5)) {
                return;
            }
            const offsetX = annotationService.getSystemIndependentX(X, canvas);

            const offsetY = annotationService.getSystemIndependentY(Y, canvas);

            let cursorXOffset = comment.x - comment.textBox.cursorX

            let cursorYOffset = comment.y - comment.textBox.cursorY


            activeCommentRef.current = {
                ...comment, x: X, y: Y, textBox: {
                    ...comment.textBox, cursorX: X + cursorXOffset, cursorY: Y + cursorYOffset,
                },
            };

            setAllAnnotation((prevState) => {
                return prevState.map((annotations) => annotations.map((annotation) => {
                    if (annotation.id === comment.id) {
                        cursorXOffset = annotation.x - annotation.textBox.cursorX
                        cursorYOffset = annotation.y - annotation.textBox.cursorY

                        return {
                            ...annotation, x: offsetX, y: offsetY, textBox: {
                                ...annotation.textBox,
                                cursorX: offsetX + cursorXOffset,
                                cursorY: offsetY + cursorYOffset,
                            },
                        };
                    }
                    return annotation; // Keep other annotations unchanged
                }));
            });
        } else if (isResizingComment) {
            const canvas = canvasRef.current
            let comment = activeCommentRef.current
            const X = event.nativeEvent.offsetX
            const offsetX = annotationService.getSystemIndependentX(X, canvas);

            const newWidth = X - comment.x


            if ((X + 4) >= canvas.width) {
                return
            }

            if (newWidth < TEXT_BOX_MIN_WIDTH) {
                return
            }


            const {
                cursorX,
                cursorY,
                dynamicHeight
            } = annotationService.getCursorXAndY({...comment, width: newWidth}, canvas, ctx, null, true);

            //When decrease the width of the text box height check the text box not reach the bottom of the canvas
            const maxY = comment.y + dynamicHeight
            if (maxY > canvas.height - 5) {
                // if maxY exceed the return do nothing
                return;
            }


            activeCommentRef.current = {
                ...comment, height: dynamicHeight, width: newWidth, textBox: {
                    ...comment.textBox, cursorX: cursorX, cursorY: cursorY,
                },
            };

            setAllAnnotation((prevState) => {
                return prevState.map((annotations) => annotations.map((annotation) => {
                    if (annotation.id === comment.id) {
                        annotation.width = offsetX - annotation.x
                        return {
                            ...annotation,
                            height: annotationService.getSystemIndependentH(dynamicHeight, canvas),
                            textBox: {
                                ...annotation.textBox,
                                cursorX: annotationService.getSystemIndependentX(cursorX, canvas),
                                cursorY: annotationService.getSystemIndependentY(cursorY, canvas),
                            },
                        };
                    }
                    return annotation; // Keep other annotations unchanged
                }));
            });
        }
    };
    const eraseLine = (ctx, x, y, radius) => {
        setAllAnnotation(prevState => {
            const newState = [...prevState];
            let annotations = [...newState[activeImageIndex]];

            // Process each line annotation
            annotations.forEach(annotation => {
                if (annotation.type === 'line' && annotation.segments) {
                    let allSegments = [];

                    annotation.segments.forEach(segment => {
                        let newSegments = [];
                        let currentSegment = [];
                        let intersects = false;

                        // Process each segment's points
                        for (let i = 0; i < segment.coordinates.length - 1; i++) {
                            const point1 = segment.coordinates[i];
                            const point2 = segment.coordinates[i + 1];

                            // Check if the segment's bounding box intersects with the circle's bounding box
                            if (commonFunctionService.boundingBoxIntersect(point1, point2, x, y, radius)) {
                                const intersections = commonFunctionService.circleLineIntersection(point1, point2, new Coordinates(x, y), radius);

                                // If there are intersections, add them to the segments
                                if (intersections.length > 0) {
                                    intersects = true;
                                    if (currentSegment.length > 0) {
                                        newSegments.push(new LineSegments([...currentSegment]));
                                        currentSegment = [];
                                    }

                                    // Add intersection points to the segment
                                    intersections.forEach(intersection => {
                                        if (commonFunctionService.isPointOnSegment(point1, point2, intersection)) {
                                            currentSegment.push(intersection);
                                        }
                                    });
                                } else {
                                    currentSegment.push(point1);
                                }
                            } else {
                                currentSegment.push(point1);
                            }
                        }

                        if (currentSegment.length > 0) {
                            newSegments.push(new LineSegments([...currentSegment]));
                        }

                        if (intersects) {
                            allSegments.push(...newSegments);
                        } else {
                            allSegments.push(segment);
                        }
                    });

                    annotation.segments = allSegments;
                } else if (annotation.type === 'rect') {
                    let X = annotation.x + annotation.width;
                    let Y = annotation.y + annotation.height;

                    // Check if the point is within the expanded rectangle's boundaries
                    if (x >= Math.min(annotation.x, X) && x <= Math.max(annotation.x, X) && y >= Math.min(annotation.y, Y) && y <= Math.max(annotation.y, Y)) {
                        annotations = annotations.filter((anno) => anno !== annotation)
                    }
                } else {
                    let annoX = annotation.x + annotation.width / 10
                    let annoY = annotation.y + annotation.width / 10
                    let distance = Math.sqrt(Math.pow(annoX - x, 2) + Math.pow(annoY - y, 2));
                    if ((distance) < 0.002) {
                        annotations = annotations.filter((anno) => anno !== annotation)
                    }
                }
            });

            newState[activeImageIndex] = annotations;
            return newState;
        });
    };
    const handleRectangleTool = () => {
        if (activeComment !== null) {
            setActiveComment(null)
            setAllAnnotation((prevState) => {
                return prevState.map((annotations) => {
                    return annotations.map((annotation) => {
                        return {
                            ...annotation, textBox: {
                                ...annotation.textBox, isFocused: false,
                            },
                        };

                    });
                });
            });
        }
        if (selectedIcon === "rect") {
            deselectAnnotation();
        } else {
            setSelectedIcon("rect");
            setCursor(null);
            setIsPencilSeleted(false);
        }
    };

    const handleClick = (selections) => {
        if (activeComment !== null) {
            setActiveComment(null)
            setAllAnnotation((prevState) => {
                return prevState.map((annotations) => {
                    return annotations.map((annotation) => {
                        return {
                            ...annotation, textBox: {
                                ...annotation.textBox, isFocused: false,
                            },
                        };

                    });
                });
            });
        }
        if (selectedIcon === selections) {
            deselectAnnotation();
        } else {
            switch (selections) {
                case "tick":
                    setCursor(tickSvg);
                    break;
                case "cross":
                    setCursor(crossSvg);
                    break;
                case "questionMark":
                    setCursor(questionMarkSvg);
                    break;
                case "comment":
                    setCursor(null);
                    break;
            }
            setIsPencilSeleted(false)
            setSelectedIcon(selections)
        }
    }
    const handleKeyDown = (event) => {
        const activeElement = document.activeElement;

        // Check if the active element is an input field, text area, or similar
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            // Allow the default behavior for arrow keys in input fields or text areas
            return;
        }
        if (event.key === ' ') {
            event.preventDefault();
        }

        if (activeCommentRef.current === null) {
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault()
                    paginationClick("previous")
                    break;
                case 'ArrowRight':
                    event.preventDefault()
                    paginationClick("next")
                    break;
                default:
                    break;
            }
        } else {
            handleKeyDownForTextBoxClick(event)
        }

    }
    const handleKeyDownForTextBoxClick = (event) => {
        const active = activeCommentRef.current;
        if (!active) return;


        const isPrintableKey = event.key.length === 1 && // Single-character keys like letters, numbers, and symbols
            !event.ctrlKey && // Ignore Ctrl combinations
            !event.altKey && // Ignore Alt combinations
            !event.metaKey; // Ignore Meta (Cmd/Windows) combinations


        if (isPrintableKey || event.key === "Enter" || event.key === "Backspace") {
            setAllAnnotation((prevState) => {
                const updatedAnnotations = prevState.map((annotations) => annotations.map((annotation) => {
                    if (annotation.id === active.id) {
                        const maxCharacters = annotation.textBox.maxCharacters || Infinity;

                        let newComment = annotation.textBox.text;

                        if (event.key === "Backspace") {
                            newComment = newComment.slice(0, -1); // Remove last character
                        } else if (newComment.length <= maxCharacters) {
                            if (event.key === "Enter") {
                                newComment += "\n"; // Add new line
                            } else {
                                newComment += event.key; // Append the typed key
                            }
                        } else {
                            console.log("Max characters exceeded");
                        }

                        return updateAnnotationText(annotation, newComment);
                    }
                    return annotation; // Keep other annotations unchanged
                }));

                // You can set the updated annotations here directly
                const updatedActive = updatedAnnotations.flat().find((annotation) => annotation.id === active.id);

                // Update activeCommentRef here after state update
                if (updatedActive) {
                    activeCommentRef.current = annotationService.convertAnnotation(updatedActive, canvasRef.current);  // Directly update the ref
                }

                return updatedAnnotations;  // Return the updated annotations
            });
        }
    }
    const updateAnnotationText = (annotation, newText) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const independentAnnotation = annotationService.convertAnnotation(annotation, canvas);
        const {
            cursorX,
            cursorY,
            dynamicHeight
        } = annotationService.getCursorXAndY(independentAnnotation, canvas, ctx, newText, true);

        return {
            ...annotation, height: annotationService.getSystemIndependentH(dynamicHeight, canvas), textBox: {
                ...annotation.textBox,
                text: newText,
                cursorX: annotationService.getSystemIndependentX(cursorX, canvas),
                cursorY: annotationService.getSystemIndependentY(cursorY, canvas),
            },
        };
    };

    //</editor-fold>

    // <editor-fold desc="Zoom Of the canvas">

    const zoomInCanvas = () => {
        if (zoomScale <= 2) {
            setZoomScale(zoomScale + 0.1)
        }
    }

    const zoomOutCanvas = () => {
        if (zoomScale > 1) {
            setZoomScale(zoomScale - 0.1)
        }
    }

    const resetZoomCanvas = () => {
        setZoomScale(1)
    }

    // </editor-fold>

    const paginationClick = (clickEvent) => {
        setActiveImageIndex((prevActiveIndex) => {
            let newIndex;
            switch (clickEvent) {
                case "next":
                    if (allImages.length - 1 > prevActiveIndex) {
                        newIndex = prevActiveIndex + 1;
                        if (!visitedPageNumbers.includes(newIndex)) {
                            setVisitedPageNumbers((prevVisited) => [...prevVisited, newIndex]);
                        }
                        return newIndex;
                    }
                    return prevActiveIndex;
                case "previous":
                    if (prevActiveIndex > 0) {
                        newIndex = prevActiveIndex - 1;
                        return newIndex;
                    }
                    return prevActiveIndex;
                default:
                    return prevActiveIndex;
            }
        });
    }
    const onFormSubmit = async (data) => {
        console.log("Visited pages during submit : ", visitedPageNumbers);
        deselectAnnotation();
        if(!isScoringPanelClicked){
            toast.current.show({
                severity: "error",
                summary: "Submission Error",
                detail: "Please enter marks in scoring panel before submission",
            });
            return
        }
        if(!isAllQuestionsAllowed){
            for (const group of questionsGroups) {
                let count = 0;
                group.questions.forEach(question => {
                    const fieldName = `${question.id}`;
                    if (parseFloat(getValues(fieldName)) !== 0) {
                        count++;
                    }
                });
                if (count > group.maximum) {
                    toast.current.show({
                        severity: "error",
                        summary: "Submission Error",
                        detail: `Group ${group.slNo}: You have marked more than the allowed number of questions (${group.maximum}). Please put 0 in the extra places.`,
                    });
                    return
                }
            }
        }
        for (let i = 0; i < allImages.length; i++) {
            if (!visitedPageNumbers.includes(i)) {
                toast.current.show({
                    severity: "error",
                    summary: "Submission Error",
                    detail: "Not all pages of the answer sheet have been visited.",
                });
                return
            }
        }
        for (let i = 0; i < allAnnotation.length; i++) {
            if (!masked.has(i) && allAnnotation[i].length === 0) {
                toast.current.show({
                    severity: "error",
                    summary: "Submission Error",
                    detail: 'Not all pages have annotations. Please add annotations to all pages.',
                });
                return
            }
        }

        dispatch(resetProgress())
        SetProgressModalIsOpen(true)

        const payload = {};
        const obtainMarks = {};

        let width = height * imageRatio;
        let annotatedImages = await annotationService.getTheImageList(width, height, allImages, allAnnotation)

        Object.keys(data).forEach((key) => {
            if (key) {
                if (disabledInputs[key]) {
                    // If the input is disabled, set the value to -5001
                    obtainMarks[key] = NOT_ANSWERED_QUESTION_MARKS;
                } else {
                    const givenMarks = parseFloat(data[key]);
                    if (!isNaN(givenMarks)) {
                        obtainMarks[key] = givenMarks.toFixed(1);
                    }
                }
            }
        });
        payload['obtainMarks'] = obtainMarks
        payload['images'] = annotatedImages
        payload['answerSheetId'] = answerSheetId
        payload['duration'] = duration

        axios.post("evaluation/submit-marks", payload, {
            headers: {
                "Content-Type": "application/json", Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.status === 200) {
                toast.current.show({
                    severity: "success", summary: "Marks Submitted", detail: "Marks submitted successfully.",
                });

                setTimeout(() => {
                    navigate('/teacher/given-marks', {state: {answerSheetId: answerSheetId}});
                }, 3000);

            }
        }).catch(() => {
            SetProgressModalIsOpen(false)
            toast.current.show({
                severity: "error", summary: "Submission Error", detail: "There was an error submitting the marks.",
            });
        })
    }
    const showError = (message) => {
        toast.current.show({severity: 'error', summary: 'Validation Error', detail: message, life: 3000});
    };
    const toggleDrawing = () => {
        if (activeComment !== null) {
            setActiveComment(null)
            setAllAnnotation((prevState) => {
                return prevState.map((annotations) => {
                    return annotations.map((annotation) => {
                        return {
                            ...annotation, textBox: {
                                ...annotation.textBox, isFocused: false,
                            },
                        };

                    });
                });
            });
        }
        if (selectedIcon === 'line') {
            deselectAnnotation();
        } else {
            setSelectedIcon('line');
            setIsPencilSeleted(true);
            setCursor(pencilSvg);
        }
    };
    const toggleToErase = () => {
        if (activeComment !== null) {
            setActiveComment(null)
            setAllAnnotation((prevState) => {
                return prevState.map((annotations) => {
                    return annotations.map((annotation) => {
                        return {
                            ...annotation, textBox: {
                                ...annotation.textBox, isFocused: false,
                            },
                        };

                    });
                });
            });
        }
        if (selectedIcon === 'eraser') {
            deselectAnnotation();
        } else {
            setSelectedIcon('eraser');
            setIsPencilSeleted(false);
            setCursor(eraserSvg);
        }
    };
    const saveAsDraft = () => {
        //TODO: here send the marks also and time i do it for only test
        const jsonAnnotation = JSON.stringify(allAnnotation)
        const data = getValues();
        const obtainMarks = {};

        Object.keys(data).forEach((key) => {
            if (key) {
                if (disabledInputs[key]) {
                    // If the input is disabled, set the value to -5001
                    obtainMarks[key] = NOT_ANSWERED_QUESTION_MARKS;
                } else {
                    const givenMarks = parseFloat(data[key]);
                    if (!isNaN(givenMarks)) {
                        obtainMarks[key] = givenMarks.toFixed(1);
                    }
                }
            }
        });

        axios.post("evaluation/draft-save", {
            answer_sheet_id: answerSheetId, annotation: jsonAnnotation, duration: duration, obtainMarks: obtainMarks
        }, {
            headers: {
                "Content-Type": "application/json", Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.status === 200) {
                toast.current.show({
                    severity: "success", summary: "Marks Submitted", detail: "Marks submitted successfully.",
                });
                if (window.closingWithButton) {
                    window.closingWithButton();
                }
                window.close();
                // setTimeout(() => {
                //     navigate('/teacher/given-marks', {state: {answerSheetId: answerSheetId}});
                // }, 3000);
            }
        }).catch(() => {
            SetProgressModalIsOpen(false)
            toast.current.show({
                severity: "error", summary: "Submission Error", detail: "There was an error submitting the marks.",
            });
        })

    }
    const handleDragStart = (e) => {
        e.preventDefault();
        if (!selectedIcon && zoomScale > 0) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX + containerRef.current.scrollLeft, y: e.clientY + containerRef.current.scrollTop
            });
            setCursor('grabbing');
        }
    };
    const handleDragMove = (e) => {
        if (isDragging && containerRef.current) {
            const deltaX = dragStart.x - e.clientX;
            const deltaY = dragStart.y - e.clientY;

            // Update scrollLeft and scrollTop to achieve the drag effect
            containerRef.current.scrollLeft = deltaX;
            containerRef.current.scrollTop = deltaY;
        }
    };
    const handleDragEnd = () => {
        if (isDragging) {
            setIsDragging(false);
            setCursor('grab');
        }
    };

    const onMarksPut = () => {
        const formValues = getValues()
        let total = 0;
        let pending = 0
        Object.keys(formValues).forEach((key) => {
            const value = parseFloat(formValues[key])
            if (!isNaN(value)) {
                total += value
            } else {
                pending++
            }
        })
        setTotalMarks(total.toFixed(1))
        setPending(pending)
    }
    const getCursorStyle = () => {
        if (!cursorInsideCanvas) return 'auto'; // Default cursor outside canvas/image
        if (cursor === 'ew-resize') return 'ew-resize'
        if (isDragging || cursor === 'grabbing') return 'grabbing';
        if (!selectedIcon || cursor === 'grab') return 'grab';
        if (selectedIcon === 'comment') return 'text';
        if (cursor) return `url(${cursor}) ${isPencilSelected ? '10 50' : ''}, auto`;
        return 'auto';
    };

    // Conditional rendering based on screen size support
    if (!isScreenSupported) {
        return (<div style={{textAlign: 'center', padding: '20px'}}>
            <h2>This page is not supported on smaller screens.</h2>
        </div>);
    }



    return (
        <div>
            {activeCommentRef.current !== null && selectedIcon === 'comment' &&
                <div style={{
                    left: window.innerWidth / 2,
                }} className="comment-edit-section">
                    <CommentBoxEditPanel activeCommentRef={activeCommentRef} setAllAnnotation={setAllAnnotation}/>
                </div>
            }
            <Card style={{height: 'min-content', padding: "10px 20px"}} className="m-0">
                <div className="d-flex justify-content-between align-items-center">
                    <div style={{width: "40%"}}>
                        <h6 className="m-0"><strong>Subject:</strong>{subject}</h6>
                        <span className="font-14">Evaluation Time: {duration}</span>
                    </div>
                    <div className="annotation-action-btn-3" style={{width: "20%"}}>
                        <Button className="annotation-page-btn" onClick={() => paginationClick('previous')} to="#"
                                disabled={activeImageIndex === 0}>
                            <FontAwesomeIcon icon={faChevronLeft} className="annotation-arrow-btn"/>
                        </Button>
                        <p className="pagination-text m-0">{activeImageIndex + 1}/{allImages.length} </p>
                        <Button className="annotation-page-btn" onClick={() => paginationClick('next')} to="#"
                                disabled={activeImageIndex === (allImages.length - 1)}>
                            <FontAwesomeIcon icon={faChevronRight} className="annotation-arrow-btn"/>
                        </Button>
                    </div>
                    <div className="annotation-header" style={{width: "40%", textAlign: "end"}}>
                        <Toast ref={toast}/>
                        <button className="btn btn-danger">Return</button>
                        <button className="btn btn-success mx-3" onClick={() => saveAsDraft()}>Save as Draft</button>
                        <button className="btn btn-success" onClick={handleSubmit(onFormSubmit)}>Submit</button>
                    </div>
                </div>
            </Card>
            <div className="d-flex">
                <div className="annotation-col-h m-2" style={{width: "50px"}}>
                    <Card className="annotation-card p-0">
                        <div className="d-flex justify-content-center px-2">
                            <ul className="m-0">
                                <li className={`annotationBtn ${selectedIcon === 'tick' ? "annotationBtnActive" : ""}`}>
                                    <NavLink
                                        onClick={(e) => masked.has(activeImageIndex) ? e.preventDefault() : handleClick('tick')}
                                        to="#" style={{cursor: masked.has(activeImageIndex) ? 'default' : 'pointer'}}>
                                        <img src={tickSvg} alt="Tick"
                                             className={masked.has(activeImageIndex) ? 'annotation-disabled' : ''}
                                             height="25px" width="25px"/>
                                    </NavLink>
                                </li>
                                <li className={`annotationBtn ${selectedIcon === 'cross' ? "annotationBtnActive" : ""}`}>
                                    <NavLink
                                        onClick={(e) => masked.has(activeImageIndex) ? e.preventDefault() : handleClick('cross')}
                                        to="#" style={{cursor: masked.has(activeImageIndex) ? 'default' : 'pointer'}}>
                                        <img src={crossSvg} alt="Cross"
                                             className={masked.has(activeImageIndex) ? 'annotation-disabled' : ''}
                                             height="25px" width="25px"/>
                                    </NavLink>
                                </li>
                                <li className={`annotationBtn ${selectedIcon === 'questionMark' ? "annotationBtnActive" : ""}`}>
                                    <NavLink
                                        onClick={(e) => masked.has(activeImageIndex) ? e.preventDefault() : handleClick('questionMark')}
                                        to="#" style={{cursor: masked.has(activeImageIndex) ? 'default' : 'pointer'}}>
                                        <img src={questionMarkSvg} alt="QuestionMark"
                                             className={masked.has(activeImageIndex) ? 'annotation-disabled' : ''}
                                             height="25px" width="25px"/>
                                    </NavLink>
                                </li>
                                <li className={`annotationBtn ${selectedIcon === 'line' ? "annotationBtnActive" : ""}`}>
                                    <NavLink
                                        onClick={(e) => masked.has(activeImageIndex) ? e.preventDefault() : toggleDrawing()}
                                        to="#" style={{cursor: masked.has(activeImageIndex) ? 'default' : 'pointer'}}>
                                        <img src={pencilSvg} alt="Tick"
                                             className={masked.has(activeImageIndex) ? 'annotation-disabled' : ''}
                                             height="25px" width="25px"/>
                                    </NavLink>
                                </li>
                                <li className={`annotationBtn ${selectedIcon === 'eraser' ? "annotationBtnActive" : ""}`}>
                                    <NavLink
                                        onClick={(e) => masked.has(activeImageIndex) ? e.preventDefault() : toggleToErase()}
                                        to="#" style={{cursor: masked.has(activeImageIndex) ? 'default' : 'pointer'}}>
                                        <img src={eraserSvg} alt="eraser"
                                             className={masked.has(activeImageIndex) ? 'annotation-disabled' : ''}
                                             height="25px" width="25px"/>
                                    </NavLink>
                                </li>
                                <li className={`annotationBtn ${selectedIcon === 'rect' ? "annotationBtnActive" : ""}`}>
                                    <NavLink to="#"
                                             onClick={(e) => masked.has(activeImageIndex) ? e.preventDefault() : handleRectangleTool()}
                                             style={{cursor: masked.has(activeImageIndex) ? 'default' : 'pointer'}}>
                                        <img src={rectSvg} alt="Rectangle"
                                             className={masked.has(activeImageIndex) ? 'annotation-disabled' : ''}
                                             height="25px" width="25px"/>
                                    </NavLink>
                                </li>
                                <li className={`annotationBtn ${selectedIcon === 'comment' ? "annotationBtnActive" : ""}`}>
                                    <NavLink to="#"
                                             onClick={(e) => masked.has(activeImageIndex) ? e.preventDefault() : handleClick('comment')}>
                                        <FontAwesomeIcon icon={faFont} height="25px" width="25px"
                                                         style={{color: "#df66ce", cursor: masked.has(activeImageIndex) ? 'default' : 'pointer'}}
                                                         className={masked.has(activeImageIndex) ? 'annotation-disabled' : ''}/>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                        <div className="annotation-action-btn py-3 mt-1">
                            <Button variant="link" className="action-btn mb-1" onClick={zoomInCanvas}
                                    disabled={masked.has(activeImageIndex)}>
                                <FontAwesomeIcon icon={faMagnifyingGlassPlus}/>
                            </Button>
                            <Button variant="link" className="action-btn mb-1" onClick={zoomOutCanvas}
                                    disabled={masked.has(activeImageIndex)}>
                                <FontAwesomeIcon icon={faMagnifyingGlassMinus}/>
                            </Button>
                            <Button variant="link" className="action-btn mb-1" onClick={resetZoomCanvas}
                                    disabled={masked.has(activeImageIndex)}>
                                <FontAwesomeIcon icon={faMagnifyingGlass}/>
                            </Button>
                        </div>
                    </Card>
                </div>
                <div className={`annotationBg annotation-col-h my-2 position-relative pe-0 overflow-hidden
                  ${masked.has(activeImageIndex) ? 'd-flex align-items-center' : ''}
                   ${activePanel ? 'shrink-annotation-column' : 'expand-annotation-column'}`}>
                    {isImageLoaded === true && (
                        <div style={{width: "100%"}}>
                            {masked.has(activeImageIndex) ? (
                                <div style={{
                                    padding: "10px",
                                }}>
                                    <div className="confidential-message"
                                         style={{
                                             width: (height - 150) * imageRatio,
                                             height: (height - 150),
                                             backgroundColor: "#fff",
                                             textAlign: "center",
                                         }}>
                                        <div className="mt-2" style={{borderBottom: "1px solid"}}>
                                            <h4>MASKED PAGE</h4>
                                        </div>
                                        <div style={{marginTop: "220px"}}>
                                            <span className="px-1 color-red font-weight-600">
                                                THIS PAGE CANNOT BE DISPLAYED DUE TO CONFIDENTIAL INFORMATION</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    ref={containerRef}
                                    style={{
                                        position: "relative",
                                        display: "block",
                                        width: "100%",
                                        height: "88vh",
                                        overflow: "auto",
                                        cursor: getCursorStyle(),
                                        padding: "50px 100px 50px 50px",
                                    }}
                                    onMouseDown={selectedIcon ? onmousedown : handleDragStart}
                                    onMouseMove={selectedIcon ? handleMouseMove : handleDragMove}
                                    onMouseUp={selectedIcon ? cancelDraw : handleDragEnd}
                                    onMouseLeave={selectedIcon ? cancelDraw : handleDragEnd}
                                >
                                    <div style={{
                                        // padding: `${10 * zoomScale}px`,
                                        minHeight: (2 * height) * zoomScale + (20 * zoomScale), // Account for padding
                                        minWidth: ((2 * height) * imageRatio * zoomScale) + (20 * zoomScale),
                                    }}>
                                        <img
                                            ref={imgRef}
                                            src={allImages[activeImageIndex]}
                                            width={(2 * height) * imageRatio}
                                            alt="Background"
                                            height={(2 * height)}
                                            style={{
                                                userSelect: "none",
                                                position: "absolute",
                                                left: "50%",
                                                marginLeft: "-42%",
                                                transform: `scale(${zoomScale})`,
                                                transformOrigin: "top left",
                                                cursor: "inherit",
                                            }}
                                            onMouseEnter={() => setCursorInsideCanvas(true)} // Track entering the image
                                            onMouseLeave={() => setCursorInsideCanvas(false)} // Track leaving the image
                                            onContextMenu={(e) => e.preventDefault()} // Disable right-click context menu
                                            onDragStart={(e) => e.preventDefault()} // Disable drag-and-drop
                                        />
                                        <canvas
                                            ref={canvasRef}
                                            style={{
                                                userSelect: "none",
                                                transform: `scale(${zoomScale})`,
                                                transformOrigin: "top left",
                                                position: "absolute",
                                                left: "50%",
                                                marginLeft: "-42%",
                                                cursor: getCursorStyle(),
                                                pointerEvents: 'auto',
                                            }}
                                            height={(2 * height)}
                                            width={(2 * height) * imageRatio}
                                            onClick={handleCanvasClick}
                                            onMouseMove={handleMouseMove}
                                            onMouseDown={onmousedown}
                                            onMouseUp={cancelDraw}
                                            onBlur={cancelDraw}
                                            onMouseOut={cancelDraw}
                                            onMouseEnter={() => setCursorInsideCanvas(true)} // Track entering the canvas
                                            onMouseLeave={() => setCursorInsideCanvas(false)} // Track leaving the canvas
                                            onContextMenu={(e) => e.preventDefault()} // Disable right-click context menu
                                            onDragStart={(e) => e.preventDefault()} // Disable drag-and-drop
                                        ></canvas>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {isImageLoaded === false &&
                        <div className="loader-area">
                            <ProgressBar style={{width: '300px'}} value={progress}></ProgressBar>
                        </div>
                    }
                </div>
                <div className="annotation-col-h m-2 position-fixed" style={{width: "50px", right: "0"}}>
                    <Card className="annotation-card p-0 d-flex justify-content-between">
                        <div className="d-flex flex-column justify-content-center align-items-center py-2">
                            <Button className={`toggle-panel-btn mb-2 ${activePanel === 'scoring' ? 'active-btn' : ''}`}
                                    title="Marks Entry"
                                    isActive={activePanel === 'scoring'}
                                    onClick={(e) => {
                                        togglePanel('scoring');
                                        setIsScoringPanelClicked(true);
                                        e.currentTarget.blur();
                                    }}>
                                <FontAwesomeIcon icon={faPencil} className="color-black"/>
                            </Button>
                            <Button className={`toggle-panel-btn mb-2 ${activePanel === 'answerKey' ? 'active-btn' : ''}`}
                                    title="Answer Key"
                                    isActive={activePanel === 'answerKey'}
                                    onClick={(e) => {
                                        togglePanel('answerKey');
                                        e.currentTarget.blur();
                                    }}>
                                <FontAwesomeIcon icon={faBook} className="color-black"/>
                            </Button>
                            <Button className={`toggle-panel-btn mb-2 ${activePanel === 'download' ? 'active-btn' : ''}`}
                                    title="Downloads"
                                    isActive={activePanel === 'download'}
                                    onClick={(e) => {
                                        togglePanel('download');
                                        e.currentTarget.blur();
                                    }}>
                                <FontAwesomeIcon icon={faDownload} className="color-black"/>
                            </Button>
                        </div>
                        <div className="d-flex flex-column justify-content-center align-items-center py-2">
                            <Button className={`toggle-panel-btn mb-2 ${activePanel === 'instruction' ? 'active-btn' : ''}`}
                                    title="Help"
                                    isActive={activePanel === 'instruction'}
                                    onClick={(e) => {
                                        togglePanel('instruction');
                                        e.currentTarget.blur();
                                    }}>
                                <FontAwesomeIcon icon={faQuestionCircle} className="color-black"/>
                            </Button>
                        </div>
                    </Card>
                    {activePanel && (
                        <TogglePanel activePanel={activePanel}
                                     totalQuestions={totalQuestions}
                                     pending={pending}
                                     totalMarks={totalMarks}
                                     fullMarks={fullMarks}
                                     questionsGroups={questionsGroups}
                                     register={register}
                                     errors={errors}
                                     handleButtonClick={handleButtonClick}
                                     disabledInputs={disabledInputs}
                                     onMarksPut={onMarksPut}
                                     showError={showError}
                                     setError={setError}
                                     questionPaper={questionPaper}
                                     togglePanel={togglePanel}
                        />
                    )}
                </div>
                <ProgressModal
                    isOpen={isProgressModalIsOpen}
                    onRequestClose={() => {
                    }}
                    progress={progress}
                    progressStatus={progressStatus}
                />
            </div>
        </div>
    )

};
export default PopUpAnnotation;
