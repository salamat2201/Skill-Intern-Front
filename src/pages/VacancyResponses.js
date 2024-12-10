import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { api } from '../api/api';
import './VacancyResponses.css';
import { useNavigate } from 'react-router-dom';

function VacancyResponses() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResponses();
  }, [id]);

  const fetchResponses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Вы не авторизованы.');
      }
      const response = await axios.get(`${api}/api/responses/forMyVacancy`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { vacancyId: id }
      });
      setResponses(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateResponseStatus = async (responseId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Вы не авторизованы.');
      }

      await axios.patch(
        `${api}/api/responses/status/${responseId}?status=${newStatus}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResponses((prevResponses) =>
        prevResponses.map((res) =>
          res.id === responseId ? { ...res, status: newStatus } : res
        )
      );

      alert(`Статус отклика #${responseId} обновлен на ${newStatus}`);
    } catch (err) {
      console.error('Ошибка при обновлении статуса отклика:', err.message);
      alert('Ошибка при обновлении статуса. Попробуйте снова.');
    }
  };

  if (loading) return <p>Загрузка откликов...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const goBack = () => navigate(-1);

  return (
    <div>
       <button className="back-button" onClick={goBack}>
        &#8592; Назад
      </button>
      <h1>Отклики на вакансию</h1>
      {responses.length === 0 ? (
        <p>Нет откликов на эту вакансию.</p>
      ) : (
        responses.map((res) => (
          <div 
            key={res.id} 
            className={`response-card ${res.status === 'REJECTED' ? 'rejected' : ''} ${res.status === 'ACCEPTED' ? 'accepted' : ''}`}
          >
            <p><strong>ID отклика:</strong> {res.id}</p>
            <p><strong>Почта:</strong> {res.email}</p>
            <p><strong>Имя пользователя:</strong> {res.username}</p>
            <p><strong>Текущий статус:</strong> {res.status}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => updateResponseStatus(res.id, 'ACCEPTED')}>
                Принять
              </button>
              <button onClick={() => updateResponseStatus(res.id, 'REJECTED')}>
                Отклонить
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default VacancyResponses;
