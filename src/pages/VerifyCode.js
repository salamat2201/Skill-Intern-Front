import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import SuccessPopup from '../components/SuccessPopup';

function VerifyCode({ onClose, onEmailVerified, userEmail }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post(`${api}/api/auth/verify-email`, {
        email: userEmail,
        code: code
      });
  
      setPopupMessage('Email подтвержден');
      setSuccessPopup(true);
  
      // Через 3 секунды вызываем onEmailVerified (без закрытия окна)
      setTimeout(() => {
        onEmailVerified();
      }, 3000);
  
    } catch (err) {
      setError(err.response?.data || 'Неверный код подтверждения');
    }
  };
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Введите код подтверждения</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="6-значный код"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="login-input"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Подтвердить</button>
        </form>
        {successPopup && <SuccessPopup message={popupMessage} onClose={() => setSuccessPopup(false)} />}
      </div>
    </div>
  );
}

export default VerifyCode;
