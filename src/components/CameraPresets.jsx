import React from "react";

export const CameraPresets = ({ presets, onSelectPreset }) => {
  return (
    <div className="camera-presets">
      {Object.keys(presets).map((presetName) => (
        <button
          key={presetName}
          onClick={() => onSelectPreset(presetName)}
          className="camera-preset-button"
        >
          <svg
            className="camera-icon"
            fill="#000000"
            height="64px"
            width="64px"
            version="1.1"
            id="Icons"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            xmlSpace="preserve"
          >
            <path
              d="M29.5,14.1c-0.3-0.2-0.7-0.2-1,0l-4.6,2.3C23.7,15,22.5,14,21,14H7c-1.7,0-3,1.3-3,3v6c0,1.7,1.3,3,3,3h5.1l-3,4.4
	c-0.3,0.5-0.2,1.1,0.3,1.4c0.5,0.3,1.1,0.2,1.4-0.3l3.2-4.8l3.2,4.8c0.2,0.3,0.5,0.4,0.8,0.4c0.2,0,0.4-0.1,0.6-0.2
	c0.5-0.3,0.6-0.9,0.3-1.4l-3-4.4H21c1.5,0,2.7-1,2.9-2.4l4.6,2.3C28.7,26,28.8,26,29,26c0.2,0,0.4-0.1,0.5-0.1
	c0.3-0.2,0.5-0.5,0.5-0.9V15C30,14.7,29.8,14.3,29.5,14.1z"
            />
            <path
              d="M19,1c-2.1,0-3.9,1.1-5,2.7C12.9,2.1,11.1,1,9,1C5.7,1,3,3.7,3,7s2.7,6,6,6c2.1,0,3.9-1.1,5-2.7c1.1,1.6,2.9,2.7,5,2.7
	c3.3,0,6-2.7,6-6S22.3,1,19,1z M9,9C7.9,9,7,8.1,7,7s0.9-2,2-2s2,0.9,2,2S10.1,9,9,9z M19,9c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2
	S20.1,9,19,9z"
            />
          </svg>
          <span className="preset-name">{presetName}</span>
        </button>
      ))}
    </div>
  );
};
