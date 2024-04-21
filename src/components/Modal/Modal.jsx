import React, { useState, useEffect } from 'react';
import { Rings } from 'react-loader-spinner';
import moduleCss from './modal.module.css';

const Modal = ({ largeImageURL, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleImageLoaded = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    alert('Failed to load the image.');
  };

  return (
    <div className={moduleCss.overlay} onClick={handleOverlayClick}>
      <div className={moduleCss.modal}>
        {loading && (
          <Rings
            visible={true}
            ariaLabel="loading"
            color="#3f51b5"
            height={80}
            width={80}
          />
        )}
        <img
          src={largeImageURL}
          alt="Modal"
          onLoad={handleImageLoaded}
          onError={handleImageError}
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        />
      </div>
    </div>
  );
};

export default Modal;
