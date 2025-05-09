import React, { useEffect } from "react";
import { toast } from "react-toastify";

const PreventCheating = () => {
  useEffect(() => {
    // 1. Force Fullscreen
    const goFullScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    };

    // 2. Disable Right Click, Drag, and Text Selection
    const disableRightClick = (e) => e.preventDefault();
    const disableDrag = (e) => e.preventDefault();
    const disableTextSelection = (e) => e.preventDefault();

    // 3. Disable Shortcuts like F12, Ctrl+U, Ctrl+Shift+I, F11 (Fullscreen)
    const disableShortcuts = (e) => {
      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key === "F12" || // Disable F12 (Dev Tools)
        e.key === "F11" || // Disable F11 (Fullscreen)
        (e.key === "u" && e.ctrlKey) || // Ctrl+U (View source)
        (e.key === "i" && e.ctrlKey && e.shiftKey) // Ctrl+Shift+I (Inspect)
      ) {
        e.preventDefault();
      }
    };

    // 4. Prevent Back Navigation
    const preventBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // 5. Prevent Tab Switching (Alert and submit exam)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Tab switching is not allowed during the exam!");
        // Trigger automatic exam submission (can be added here)
        // handleSubmit();
      }
    };

    // Apply all restrictions
    goFullScreen();
    preventBackNavigation();
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("contextmenu", disableRightClick);
    window.addEventListener("dragstart", disableDrag); // Prevent dragging
    document.body.style.userSelect = "none"; // Disable text selection
    window.addEventListener("keydown", disableShortcuts);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("dragstart", disableDrag);
      document.body.style.userSelect = ""; // Re-enable text selection
      window.removeEventListener("keydown", disableShortcuts);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
};

export default PreventCheating;
