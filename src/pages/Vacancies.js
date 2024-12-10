import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VacancyCard from '../components/VacancyCard';
import './Vacancies.css';
import { api } from '../api/api';
import qs from 'qs';

function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [level, setLevel] = useState('');
  const [company, setCompany] = useState(null);
  const [technology, setTechnology] = useState(null);
  const [employmentType, setEmploymentType] = useState(null);
  const [remoteWork, setRemoteWork] = useState(false);
  const [companyNames, setCompanyNames] = useState([]);

  useEffect(() => {
    fetchAllVacancies(); 
    fetchAllCompanyNames();
  }, []);

  const fetchAllVacancies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/api/vacancy/all`);
      setVacancies(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchAllCompanyNames = async () => {
    try {
      const response = await axios.get(`${api}/api/vacancy/companies`);
      setCompanyNames(response.data);
      console.log(companyNames)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSbros = () => {
    setCompanyNames([]);
    setEmploymentType(null);
    setRemoteWork(false);
    setLevel(null);
    setTechnology(null);
    fetchAllVacancies();
  }


  const fetchFilteredVacancies = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const params = {
        levels: level ? [level] : null,
        companies: company ? [company] : null,
        technologies: technology ? [technology] : null,
        employmentType,
        remoteWork,
      };
      console.log(params)
  
      const response = await axios.get(`${api}/api/vacancy/by-filter`, {
        params,
        paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
      });
      console.log(response.data)
  
      setVacancies(response.data);
      console.log(vacancies)
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  

  const handleFilterApply = () => {
    fetchFilteredVacancies();
  };

  if (loading) {
    return <p>Загрузка вакансий...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <section className="vacancies-section">
      <div className="filter-panel">
        <p className='filter-text'>Filter</p>
        <div className="filter-group">
            <p>Level</p>
            <div onChange={e => setLevel(e.target.value)}>
              {["Intern", "Junior", "Middle", "Senior", "Lead"].map(l => (
                <label key={l}>
                  <input type="radio" name="level" value={l} checked={level === l} onChange={() => setLevel(l)}/> {l}
                </label>
              ))}
            </div>
        </div>
        <div className="filter-group">
          <label htmlFor="company">Technology:</label>
          <select id="technology" name="technology" value={technology} onChange={e => setTechnology(e.target.value)}>
            <option value="">Choose a technology</option>
            <option value="Company1">technology1</option>
            <option value="Company2">technology2</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="company">Компания:</label>
          <select 
            id="company" 
            name="company" 
            value={company} 
            onChange={e => setCompany(e.target.value)}
          >
            <option value="">Выберите компанию</option>
            {companyNames.map((companyName) => (
              <option key={companyName} value={companyName}>{companyName}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <p>Type of Employment:</p>
          <div onChange={e => setEmploymentType(e.target.value)}>
            {["full-time", "part-time", "contract", "hybrid"].map(type => (
              <label key={type}>
                <input type="radio" name="employmentType" value={type} checked={employmentType === type}/> {type}
              </label>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>
            <input type="checkbox" checked={remoteWork} onChange={e => setRemoteWork(e.target.checked)} /> Remote Work
          </label>
        </div>
        <button onClick={handleSbros}>Сбросить</button>
        <button onClick={handleFilterApply}>Применить</button>
      </div>

      <div className="vacancies-list">
        {vacancies.map((vacancy) => (
          <VacancyCard
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
    </section>
  );
}

export default Vacancies;
