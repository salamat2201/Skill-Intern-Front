import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import VerifyPassword from './VerifyPassword';

function ForgotPassword({ onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(`${api}/api/auth/forgot-password`, { email: email });
      if (response.status === 200) {
        setSuccess('Код отправлен на ваш email.');
        setTimeout(() => {
          setShowVerifyPassword(true); // Переход на VerifyPassword
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data || 'Ошибка при отправке email.');
    }
  };

  return (
    <div>
      {showVerifyPassword ? (
        <VerifyPassword onClose={onClose} userEmail={email} />
      ) : (
        <>
          <h3>Восстановление пароля</h3>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Введите ваш email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="login-button">Отправить код</button>
          </form>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;
