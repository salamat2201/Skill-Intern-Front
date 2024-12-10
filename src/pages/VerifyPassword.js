import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import SuccessPopup from '../components/SuccessPopup';

function VerifyPassword({ onClose, userEmail, onResetSuccess }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [error, setError] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Обработчик для проверки кода
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Проверяем код через эндпоинт verify-reset-code
      await axios.post(`${api}/api/auth/verify-password`, {
        email: userEmail,
        code,
      });

      setPopupMessage('Код подтвержден! Теперь вы можете установить новый пароль.');
      setSuccessPopup(true);
      setIsCodeVerified(true);

      setTimeout(() => {
        setSuccessPopup(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data || 'Неверный код подтверждения.');
    }
  };

  // Обработчик для обновления пароля
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    try {
      // Отправляем запрос на изменение пароля
      await axios.post(`${api}/api/auth/update-password`, {
        email: userEmail,
        password:newPassword,
      });

      setPopupMessage('Пароль успешно изменен!');
      setSuccessPopup(true);

      // Через 3 секунды закрываем форму и уведомляем об успешном изменении пароля
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data || 'Произошла ошибка при изменении пароля.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{isCodeVerified ? 'Установите новый пароль' : 'Введите код подтверждения'}</h2>

        {isCodeVerified ? (
          // Форма для установки нового пароля
          <form onSubmit={handleUpdatePassword}>
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="login-input"
            />
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="login-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">Изменить пароль</button>
          </form>
        ) : (
          // Форма для ввода кода подтверждения
          <form onSubmit={handleVerifyCode}>
            <input
              type="text"
              placeholder="4-значный код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="login-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">Подтвердить код</button>
          </form>
        )}
        {successPopup && <SuccessPopup message={popupMessage} onClose={() => setSuccessPopup(false)} />}
      </div>
    </div>
  );
}

export default VerifyPassword;
