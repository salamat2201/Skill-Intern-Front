import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyVacanciesPage.css';
import { api } from '../api/api';
import { Link } from 'react-router-dom';

function MyVacanciesPage() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyVacancies();
  }, []);

  const fetchMyVacancies = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Вы не авторизованы.');
      }
      const response = await axios.get(`${api}/api/vacancy/my-vacancies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVacancies(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteVacancy = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Вы не авторизованы.');
      }
      await axios.delete(`${api}/api/vacancy/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
      alert('Вакансия успешно удалена.');
    } catch (err) {
      alert(`Ошибка удаления вакансии: ${err.message}`);
    }
  };

  const handleGoBack = () => navigate(-1);

  if (loading) {
    return <p className="my-vacancies-loading">Загрузка вакансий...</p>;
  }

  if (error) {
    return <p className="my-vacancies-error">Ошибка: {error}</p>;
  }

  return (
    <div className="my-vacancies-page">
      <button className="back-button" onClick={handleGoBack}>
        &#8592; Назад
      </button>
      <h1>Мои вакансии</h1>
      {vacancies.length === 0 ? (
        <p className="no-vacancies-message">У вас нет добавленных вакансий.</p>
      ) : (
        <div className="vacancies-list">
          {vacancies.map((vacancy) => (
            <div className="vacancy-card" key={vacancy.id}>
              <h3>{vacancy.title}</h3>
              <p><strong>Компания:</strong> {vacancy.companyName}</p>
              <p><strong>Локация:</strong> {vacancy.location}</p>
              <p>
                <strong>Зарплата:</strong> {vacancy.salaryStart} - {vacancy.salaryEnd} KZT
              </p>
              <p><strong>Опыт:</strong> {vacancy.experience} лет</p>
              {/* Вместо вызова whoResponse просто переходим на страницу откликов */}
              <p 
                className='response-button' 
                onClick={() => navigate(`/responses/${vacancy.id}`)}
                style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
              >
                Откликнулись
              </p>
              <Link to={`/vacancies/${vacancy.id}`} className="preview-button">Предпросмотр ➔</Link>
              <button className="delete-button" onClick={() => deleteVacancy(vacancy.id)}>
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyVacanciesPage;
