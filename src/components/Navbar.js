import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import { api } from '../api/api';

function Navbar({ onLoginClick, isAuthenticated, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [editMode, setEditMode] = useState(true);
  const [resumeLink, setResumeLink] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setRole(decoded.role);
          setUser(decoded.sub);
          
          // Загружаем companyName только для работодателей
          if (decoded.role === 'ROLE_EMPLOYER') {
            const savedCompanyName = localStorage.getItem('companyName');
            if (savedCompanyName) {
              setCompanyName(savedCompanyName); 
              setEditMode(false);
            }
          } else {
            // Если пользователь не работодатель, очищаем companyName
            setCompanyName('');
          }
        } catch (error) {
          console.error('Ошибка декодирования токена:', error);
        }
      }
      setIsMenuOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMenuOpen]);

  const confirmCompanyName = () => {
    if (companyName.trim() === '') {
      alert('Пожалуйста, введите название компании.');
      return;
    }
  
    const url = new URL(`${api}/api/vacancy/addCompany`);
    url.searchParams.append('company', companyName);
  
    fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ company: companyName }),
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text || 'Что-то пошло не так');
        });
      }
      return response.text();
    })
    .then(text => {
      console.log('Компания успешно добавлена:', text);
      localStorage.setItem('companyName', companyName);
      setEditMode(false);
      alert('Компания успешно добавлена!');
    })
    .catch(error => {
      console.error('Не удалось добавить компанию:', error);
      alert(`Не удалось добавить компанию: ${error.message}`);
    });
  };

  const changeCompanyName = () => {
    setEditMode(true);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadProgress(0);
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      alert('Пожалуйста, выберите файл для загрузки.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      setUploading(true);
      const response = await axios.post('http://localhost:5000/add-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setResumeLink(response.data.resumeUrl);
      alert('Резюме успешно загружено!');
    } catch (error) {
      console.error('Ошибка загрузки резюме:', error);
      alert('Произошла ошибка при загрузке резюме.');
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/vacancies">Skill-Intern</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>News</Link>
        <Link to="/vacancies" className={`navbar-link ${location.pathname === '/vacancies' ? 'active' : ''}`}>Vacancies</Link>
        <Link to="/internships" className={`navbar-link ${location.pathname === '/internships' ? 'active' : ''}`}>Internships</Link>
        <Link to="/about-us" className={`navbar-link ${location.pathname === '/about-us' ? 'active' : ''}`}>About Us</Link>
      </div>
      
      {/* Кнопка добавления вакансии только для работодателей */}
      {isAuthenticated && role === 'ROLE_EMPLOYER' && location.pathname === '/vacancies' && (
        <button className="add-vacancy-button" onClick={() => navigate('/add-vacancy')}>Добавить вакансию</button>
      )}
      
      <div className="navbar-right">
        <i className="search-icon">&#128269;</i>
        <i className="theme-icon">&#9728;</i>
        {isAuthenticated ? (
          <div className="profile-container" ref={menuRef}>
            <div className="profile-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <img src="/path/to/default-avatar.png" alt="Avatar" className="avatar-icon" />
            </div>
            {isMenuOpen && (
              <div className="profile-menu">
                <p>{user || 'Пользователь'}</p>
                
                {/* Навигационные ссылки в зависимости от роли */}
                {role === 'ROLE_EMPLOYER' && (
                  <Link to="/my-vacancies" className="navbar-linkk">Мои вакансии</Link>
                )}
                {role === 'ROLE_USER' && (
                  <Link to="/my-responses" className="navbar-linkk">Мои отклики</Link>
                )}
                {role === 'ROLE_ADMIN' && (
                  <Link to="/all-users" className="navbar-linkk">All Users</Link>
                )}

                
                {/* Блок изменения названия компании только для работодателей */}
                {role === 'ROLE_EMPLOYER' && (
                  <div className="company-field">
                    {editMode ? (
                      <>
                        <input 
                          type="text" 
                          className="company-input" 
                          placeholder="Название компании" 
                          value={companyName} 
                          onChange={(e) => setCompanyName(e.target.value)} 
                        />
                        <button onClick={confirmCompanyName} className="navbar-button">OK</button>
                      </>
                    ) : (
                      <>
                        <span className="company-name">{companyName}</span>
                        <button onClick={changeCompanyName} className="navbar-button">Изменить</button>
                      </>
                    )}
                  </div>
                )}
          {role === 'ROLE_USER' && (
            <div className="resume-section">
              {resumeLink ? (
                <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="navbar-linkk">
                  Мое резюме
                </a>
              ) : (
                <div className="upload-resume">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileChange} 
                    className="resume-input"
                  />
                  <button 
                    onClick={handleUploadResume} 
                    className="navbar-button" 
                    disabled={uploading || !selectedFile}
                  >
                    {uploading ? 'Загрузка...' : 'Загрузить файл'}
                  </button>
                  {uploading && (
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
                
                <button onClick={onLogout} className="navbar-button logout-button">Выйти</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onLoginClick} className="navbar-button">Login</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
