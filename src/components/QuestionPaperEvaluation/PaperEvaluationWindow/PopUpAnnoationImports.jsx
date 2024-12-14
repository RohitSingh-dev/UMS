import axios from "axios";
import {Toast} from "primereact/toast";
import {useForm} from "react-hook-form";
import {
    faMagnifyingGlass,
    faMagnifyingGlassMinus,
    faMagnifyingGlassPlus,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import {InputText} from "primereact/inputtext";
import useTimer from "../../../hooks/TImerHook.jsx";
import {useEffect, useRef, useState} from "react";
import {ProgressBar} from 'primereact/progressbar';
import {useDispatch, useSelector} from "react-redux";
import ProgressModal from "../../Util/progressModal.jsx";
import Coordinates from "../../../Model/Coordinates.jsx";
import useScreenSize from "../../../hooks/widowsSize.jsx";
import LineSegments from "../../../Model/LineSegment.jsx";
import {JWT_COOKIES_NAME} from "../../Util/AppConstant.jsx";
import CookieHelper from "../../../services/UseCookies.jsx";
import AnnotationType from "../../../Model/AnnotationType.jsx";
import tickSvg from "../../../assets/AnnotationIcons/tick.svg";
import {Button, Card, Row, Tab, Tabs} from "react-bootstrap";
import crossSvg from "../../../assets/AnnotationIcons/cross.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import eraserSvg from "../../../assets/AnnotationIcons/eraser.svg";
import rectSvg from "../../../assets/AnnotationIcons/rectangle.svg";
import questionMarkSvg from "../../../assets/AnnotationIcons/questionMark.svg";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import pencilSvg from "../../../assets/AnnotationIcons/newPencil.svg";
import webSocketService from "../../../services/WebSocketService.jsx";
import AnnotationService from "../../../services/annotationService.jsx";
import commonFunctionService from "../../../services/commonFunctionService.jsx";
import usePreventDeveloperTools from "../../../hooks/usePreventDeveloperTools.jsx";
import {resetProgress, updateBackendProgress} from "../../../Redux/webSocketSlice.jsx";

export {axios, Toast, useForm, faMagnifyingGlass, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faSearch, InputText, useTimer, useEffect, useRef, useState, ProgressBar, useSelector, useDispatch, ProgressModal, Coordinates, useScreenSize, LineSegments, JWT_COOKIES_NAME, CookieHelper, AnnotationType, tickSvg, Button, Card, Row, Tab, Tabs, crossSvg, FontAwesomeIcon, eraserSvg, rectSvg, questionMarkSvg, NavLink, useLocation, useNavigate, pencilSvg, webSocketService, AnnotationService, commonFunctionService, updateBackendProgress, resetProgress, usePreventDeveloperTools
}