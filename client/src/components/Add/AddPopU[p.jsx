import { useEffect, useState, useRef } from "react";

const AdPopup = ({ ads }) => {
  const [visible, setVisible] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [countdown, setCountdown] = useState(5); // 5 seconds countdown

  const countdownRef = useRef(null);
  const skipTimeoutRef = useRef(null);
  const nextAdTimeoutRef = useRef(null);

  useEffect(() => {
    if (!ads || ads.length === 0 || !visible) return;

    setCountdown(5);
    setShowSkip(false);

    // Countdown timer
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show skip button
    skipTimeoutRef.current = setTimeout(() => {
      setShowSkip(true);
    }, 5000);

    // Move to next ad
    nextAdTimeoutRef.current = setTimeout(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 8000);

    return () => {
      clearInterval(countdownRef.current);
      clearTimeout(skipTimeoutRef.current);
      clearTimeout(nextAdTimeoutRef.current);
    };
  }, [currentAdIndex, ads, visible]);

  const handleClose = () => {
    setVisible(false);
    clearInterval(countdownRef.current);
    clearTimeout(skipTimeoutRef.current);
    clearTimeout(nextAdTimeoutRef.current);
  };

  if (!visible || !ads.length) return null;

  const ad = ads[currentAdIndex];

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg overflow-hidden z-50 max-w-xs w-80">
      <div className="relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg"
        >
          &#10005;
        </button>

        {ad.mediaType === "video" ? (
          <video
            src={ad.mediaUrl}
            className="w-full h-48 object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <img
            src={ad.mediaUrl}
            className="w-full h-48 object-cover"
            alt="Advertisement"
          />
        )}

        <div className="p-4">
          <p className="text-sm text-gray-700">{ad.description}</p>
          {!showSkip && (
            <p className="text-xs text-gray-500 mt-1">
              Skip available in {countdown}s
            </p>
          )}
          {showSkip && (
            <button
              onClick={() => {
                setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
              }}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
