"use client";
import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-dvh fixed z-[9999] bg-textColor top-0 right-0 w-full">
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          width: 48px;
          height: 48px;
          border: 3px solid #fff;
          border-radius: 50%;
          display: inline-block;
          position: relative;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        .loader::after {
          content: "";
          box-sizing: border-box;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid;
          border-color: #ff3d00 transparent;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
