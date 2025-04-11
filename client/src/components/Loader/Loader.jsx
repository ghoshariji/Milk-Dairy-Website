import React from 'react';
import './loader.css'; // Make sure this file contains the CSS below

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} style={{ '--i': i }}></span>
        ))}
      </div>
    </div>
  );
};

export default Loader;
