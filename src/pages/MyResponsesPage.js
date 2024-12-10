import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyVacanciesPage.css';
import { api } from '../api/api';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

function MyResponsesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [currentFilter, setCurrentFilter] = useState(''); // Будем хранить текущий выбранный фильтр: 'pending', 'accepted', 'rejected'

  // Функция для перевода статуса на русский
  const translateStatus = (status) => {
    switch (status) {
      case 'REJECTED':
        return 'Отказано';
      case 'ACCEPTED':
        return 'Принято';
      case 'PENDING':
      default:
        return 'В ожидании';
    }
  };

  const fetchVacanciesByStatus = async (statusEndpoint) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Вы не авторизованы.');
      }

      // В зависимости от выбранного статуса подставляем нужный URL
      let url = `${api}/api/responses/my`;
      if (statusEndpoint) {
        url = `${api}/api/responses/my/${statusEndpoint}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVacancies(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoBack = () => navigate(-1);

  // При первом рендере получим все мои отклики (без фильтра)
  useEffect(() => {
    fetchVacanciesByStatus('');
  }, []);

  return (
    <div className="my-vacancies-page">
      <h1>Мои отклики</h1>
      <button className="back-buttons" onClick={handleGoBack}>
        &#8592; Назад
      </button>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => {
            setCurrentFilter(''); 
            fetchVacanciesByStatus('');
          }} 
          className={currentFilter === '' ? 'active-filter-button' : ''}
        >
          Все
        </button>
        <button 
          onClick={() => {
            setCurrentFilter('pending'); 
            fetchVacanciesByStatus('pending');
          }} 
          className={currentFilter === 'pending' ? 'active-filter-button' : ''}
        >
          В ожидании
        </button>
        <button 
          onClick={() => {
            setCurrentFilter('accepted'); 
            fetchVacanciesByStatus('accepted');
          }}
          className={currentFilter === 'accepted' ? 'active-filter-button' : ''}
        >
          Принятые
        </button>
        <button 
          onClick={() => {
            setCurrentFilter('rejected'); 
            fetchVacanciesByStatus('rejected');
          }}
          className={currentFilter === 'rejected' ? 'active-filter-button' : ''}
        >
          Отклонённые
        </button>
      </div>

      {loading && <p className="my-vacancies-loading">Загрузка вакансий...</p>}
      {error && <p className="my-vacancies-error">Ошибка: {error}</p>}

      {!loading && !error && vacancies.length === 0 ? (
        <p className="no-vacancies-message">У вас нет откликов по выбранному фильтру.</p>
      ) : (
        <div className="vacancies-list">
          {vacancies.map((vacancy) => (
            <div className="vacancy-card" key={vacancy.id}>
              <div className="vacancy-card-header">
                <img
                  src="/placeholder-logo.png"
                  alt={`${vacancy.companyName} logo`}
                  className="company-logo"
                />
                <div>
                  <h3 className="vacancy-title">{vacancy.title}</h3>
                  <p className="company-name"><FaBuilding /> {vacancy.companyName}</p>
                </div>
              </div>
              <div className="vacancy-card-body">
                <p className="vacancy-location"><FaMapMarkerAlt /> {vacancy.location}</p>
                <div className="vacancy-details">
                  <p><FaBriefcase /> {vacancy.experience} years</p>
                  <p className="vacancy-salary">
                    {vacancy.salaryStart} - {vacancy.salaryEnd} USD
                  </p>
                </div>
                {/* Отображаем статус отклика */}
                <p className="response-status">
                  Статус: {translateStatus(vacancy.responseStatus)}
                </p>
              </div>
              <Link to={`/vacancies/${vacancy.id}`} className="preview-button">Предпросмотр ➔</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyResponsesPage;