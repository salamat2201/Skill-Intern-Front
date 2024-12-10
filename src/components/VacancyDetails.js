import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './VacancyDetails.css';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';

function VacancyDetails() {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [error, setError] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacancyDetails = async () => {
      try {
        const response = await axios.get(`${api}/api/vacancy/detail/${id}`);
        setVacancy(response.data);
      } catch (err) {
        setError(err.message);
     
      }
    };

    fetchVacancyDetails();
  }, [id]);
  
  const goBack = () => navigate(-1)

  const handleApply = async () => {
    try {
      const response = await axios.post(
        `${api}/api/responses/create?vacancyId=${id}`,
        {}, // No need to send a body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Make sure the token is valid and present
          },
        }
      );
      console.log(response)
      
  
      if (response.status === 201) {
        setIsApplied(true);
      }

    } catch (err) {
      console.log(err);
      setError('Не удалось отправить отклик. Попробуйте снова.');
    }
  };
  

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  if (!vacancy) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div className="vacancy-details-container">
      <button className="back-button" onClick={goBack}>
        &#8592; Назад
      </button>
      <h2>{vacancy.title || 'No title available'}</h2>
      <p><strong>Location:</strong> {vacancy.location || 'Not provided'}</p>
      <p><strong>Salary:</strong> {vacancy.salaryStart} - {vacancy.salaryEnd} USD</p>
      <p><strong>Experience:</strong> {vacancy.experience} years</p>
      <p><strong>Team Size:</strong> {vacancy.sizeOfTeam}</p>
      <p><strong>Operating Mode:</strong> {vacancy.operatingMode}</p>
      <p><strong>Level:</strong> {vacancy.level}</p>
      <p><strong>English Level:</strong> {vacancy.englishLevel}</p>
      <p><strong>Profession:</strong> {vacancy.profession}</p>
      <p><strong>Description:</strong> {vacancy.description}</p>
      <p><strong>Remote Work:</strong> {vacancy.remoteWork ? 'Yes' : 'No'}</p>
      <p><strong>Company:</strong> {vacancy.companyName}</p>
      <h3>Contact Details</h3>
      <p><strong>Email:</strong> {vacancy.email}</p>
      <p><strong>Telegram:</strong> {vacancy.telegram}</p>
      <p><strong>WhatsApp:</strong> {vacancy.whatsappNumber}</p>

      {/* Button for applying */}
      <button onClick={handleApply} disabled={isApplied}>
        {isApplied ? 'Отклик отправлен' : 'Откликнуться'}
      </button>
    </div>
  );
}

export default VacancyDetails;