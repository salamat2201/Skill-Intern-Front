import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { api } from '../api/api';
import VerifyCode from './VerifyCode';
import VerifyPassword from './VerifyPassword';
import SuccessPopup from '../components/SuccessPopup';
import { Link } from 'react-router-dom';

function Login({ onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isEmployer: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVerifyCode, setIsVerifyCode] = useState(false);
  const [isVerifyResetCode, setIsVerifyResetCode] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Обработчик нажатия "Forgot Password"
  const handleForgotPassword = async () => {
    try {
      if (!forgotEmail) {
        setError('Введите ваш email.');
        return;
      }

      await axios.post(`${api}/api/auth/forgot-password`, { email: forgotEmail });
      setPopupMessage('Инструкция по восстановлению пароля отправлена на ваш email.');
      setShowSuccessPopup(true);


      setIsVerifyResetCode(true);
      
      setTimeout(() => {
        setShowSuccessPopup(false);
        setShowForgotPassword(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data || 'Произошла ошибка при отправке запроса.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        const response = await axios.post(`${api}/api/auth/signup`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          isEmployer: formData.isEmployer
        });

        setSuccess('Регистрация прошла успешно. Пожалуйста, подтвердите свой email.');
        setIsVerifyCode(true);
      } else {
        const response = await axios.post(`${api}/api/auth/login`, {
          username: formData.username,
          password: formData.password
        });

        if (response.status !== 200) {
          setError('Ваш email не подтвержден. Пожалуйста, введите код подтверждения.');
          setIsVerifyCode(true);
          return;
        } else {
          const token = response.data.token;
          localStorage.setItem('token', token);
          console.log(token);
        
          setPopupMessage('Вход выполнен успешно!');
          setShowSuccessPopup(true);
        
          setTimeout(() => {
            setShowSuccessPopup(false);
            onLoginSuccess(); // Уведомляем родителя об успешном входе
          }, 3000);
          }
      }
    } catch (err) {
      console.log(formData.email)
      setError(err.response?.data || 'Произошла ошибка');
    }
  };

  const handleEmailVerified = () => {
    setPopupMessage('Email подтвержден успешно!');
    setShowSuccessPopup(true);
  
    setTimeout(() => {
      setShowSuccessPopup(false);
      setIsVerifyCode(false);
      setIsRegister(false); // Переключаемся на окно логина
    }, 3000);
  };
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        {showForgotPassword ? (
          <>
            <h2 className="login-title">Forgot Password</h2>
            <p className="login-subtitle">Введите ваш email для восстановления пароля</p>

            {error && <p className="error-message">{error}</p>}
            <input
              type="email"
              name="forgotEmail"
              placeholder="Email"
              className="login-input"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <button
              className="login-button"
              onClick={handleForgotPassword}
            >
              Отправить
            </button>
            <button
              className="login-button back-button"
              onClick={() => setShowForgotPassword(false)}
            >
              Назад
            </button>
          </>
        ) : isVerifyCode ? (
          <VerifyCode 
            onClose={onClose} 
            onEmailVerified={handleEmailVerified} 
            userEmail={formData.email}
          />
        ) : isVerifyResetCode ? (
          <VerifyPassword 
            userEmail={forgotEmail} 
            onClose={onClose} 
            onEmailVerified={handleEmailVerified}
          />
        ) : (
          <>
            <h2 className="login-title">
              <span className={!isRegister ? "active" : ""} onClick={() => setIsRegister(false)}>Login</span> |
              <span className={isRegister ? "active" : ""} onClick={() => setIsRegister(true)}>Register</span>
            </h2>
            <p className="login-subtitle">
              {isRegister ? "Введите ваши данные для регистрации." : "Введите ваш логин и пароль для входа."}
            </p>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="login-input"
                value={formData.username}
                onChange={handleChange}
              />
              {isRegister && (
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="login-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="login-input"
                value={formData.password}
                onChange={handleChange}
              />
              {isRegister && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="login-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              )}
              {isRegister && (
                <label className="employer-checkbox">
                  <input 
                    type="checkbox" 
                    name="isEmployer" 
                    checked={formData.isEmployer}
                    onChange={handleChange}
                  /> Я работодатель
                </label>
              )}
              <button type="submit" className="login-button">
                {isRegister ? "Register" : "Login"}
              </button>
            </form>
            {!isRegister && (
              <button
                className="forgot-password-link"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            )}
          </>
        )}
        {showSuccessPopup && <SuccessPopup message={popupMessage} onClose={() => setShowSuccessPopup(false)} />}
      </div>
    </div>
  );
}

export default Login;