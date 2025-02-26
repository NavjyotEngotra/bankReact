import React from "react";
import ReactDOM from "react-dom";

const Loader = () => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-12 h-12 border-4 border-white border-dashed rounded-full animate-spin"></div>
    </div>,
    document.getElementById("loader-root")
  );
};

export default Loader;

