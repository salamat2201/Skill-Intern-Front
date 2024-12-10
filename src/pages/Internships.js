// src/pages/Internships.js
import React from 'react';
import axios from 'axios';
import { api } from '../api/api';
import InternCard from '../components/InternCard.js'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css'

function Internships() {

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  useEffect(() => {
    // Функция для загрузки данных
    const fetchVacancies = async () => {
      try {
        const response = await axios.get(`${api}/api/internship/all`);
        setInternships(response.data);
        setLoading(false);
        console.log(response.data)
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  if (loading) {
    return <p>Загрузка вакансий...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className="vacancies-list intern">
      {internships.map((vacancy) => (
        <InternCard
          key={vacancy.id}
          id={vacancy.id}
          title={vacancy.title}
          location={vacancy.location}
          salaryStart={vacancy.salaryStart}
          salaryEnd={vacancy.salaryEnd}
          experience={vacancy.experience}
          companyName={vacancy.companyName}
        />
      ))}
    </div>
  );
}

export default Internships;
