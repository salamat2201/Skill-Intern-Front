import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './SuccessPopup.css';

function SuccessPopup({message, onClose }) {
  // Анимация для всплывающего окна
  const popupAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 200, friction: 15 }
  });

  // Анимация для галочки
  const checkmarkAnimation = useSpring({
    from: { strokeDashoffset: 50 },
    to: { strokeDashoffset: 0 },
    config: { duration: 1000 }
  });

  // Автоматическое закрытие через 5 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <animated.div className="success-popup-overlay" style={popupAnimation}>
      <div className="success-popup-content">
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark-circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <animated.path
            className="checkmark-check"
            style={checkmarkAnimation}
            fill="none"
            stroke="#4CAF50"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="50"
            strokeDashoffset="50"
            d="M14 27l8 8 16-16"
          />
        </svg>
        <p className="success-message">{message}</p>
      </div>
    </animated.div>
  );
}

export default SuccessPopup;
