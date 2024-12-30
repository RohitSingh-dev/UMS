// useLoading.js
import { useContext } from "react";
import LoadingContext from "../Util/LoadingContext.jsx";

// Custom hook to access the loading context
export const useLoading = () => useContext(LoadingContext);
