import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({width = "100%", height = "100%", url}) => {
  return (
    <div
      className={"relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ease-in-out"}
      style={{ width, height }} //props
    >
      <ReactPlayer
        className="absolute top-0 left-0"
        width={"100%"}
        height={"100%"}
        url={url}
        controls={true} //built-in controls
      />
    </div>
  );
};

export default VideoPlayer;
