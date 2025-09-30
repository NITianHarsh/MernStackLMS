import React, { useEffect } from "react";
import { toast } from "react-toastify";

const PreventCheating = ({ onCheatingDetected, maxTabSwitches = 1 }) => {
  let tabSwitchCount = 0;

  useEffect(() => {
    //  Force Fullscreen
    const goFullScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    };

    //  Disable Right Click, Drag, Text Selection
    const disableRightClick = (e) => e.preventDefault();
    const disableDrag = (e) => e.preventDefault();
    document.body.style.userSelect = "none"; // Disable text selection

    //  Disable certain keyboard shortcuts
    const disableShortcuts = (e) => {
      if (
        e.ctrlKey ||
        e.altKey ||
        e.metaKey ||
        e.key === "F12" ||
        e.key === "F11" ||
        (e.key === "u" && e.ctrlKey) ||
        (e.key === "i" && e.ctrlKey && e.shiftKey)
      ) {
        e.preventDefault();
      }
    };

    // Prevent Back Navigation
    const preventBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };
    const handlePopState = () => window.history.pushState(null, "", window.location.href);

    // Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount++;
        toast.error("Tab switching detected!");

        if (tabSwitchCount > maxTabSwitches) {
          toast.error("Maximum tab switch limit reached. Submitting exam...");
          if (onCheatingDetected) onCheatingDetected();
        }
      }
    };

    goFullScreen();
    preventBackNavigation();
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("contextmenu", disableRightClick);
    window.addEventListener("dragstart", disableDrag);
    window.addEventListener("keydown", disableShortcuts);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("dragstart", disableDrag);
      document.body.style.userSelect = "";
      window.removeEventListener("keydown", disableShortcuts);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onCheatingDetected, maxTabSwitches]);

  return null;
};

export default PreventCheating;
