import React, { useState } from "react";
import axios from "axios";
import './AddVacancyForm.css'
import { api } from "../api/api";

function AddVacancyForm() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salaryStart: "",
    salaryEnd: "",
    experience: "",
    sizeOfTeam: "",
    operatingMode: "full-time",
    level: "Intern",
    englishLevel: "Не важно",
    profession: "",
    description: "",
    telegram: "",
    whatsappNumber: "",
    email: "",
    remoteWork: false,
    companyName: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Отправляем данные:", formData);
  
    try {
      const token = localStorage.getItem("token");
      console.log(token)
      if (!token) {
        alert("Ошибка: Вы не авторизованы.");
        return;
      }
  
      const response = await axios.post(`${api}/api/vacancy/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      alert("Вакансия успешно добавлена!");
      console.log("Ответ сервера:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Ошибка при добавлении вакансии:", error.response.data);
        alert(`Ошибка: ${error.response.data.message || "Не удалось добавить вакансию."}`);
      } else if (error.request) {
        console.error("Нет ответа от сервера:", error.request);
        alert("Ошибка: Сервер не отвечает. Проверьте соединение.");
      } else {
        console.error("Ошибка:", error.message);
        alert(`Ошибка: ${error.message}`);
      }
    }
  };
  

  return (
    <form className="vacancy-form" onSubmit={handleSubmit}>
      <h2>Детали вакансии</h2>
      <div className="form-group">
        <label>
          Название вакансии:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Город/Страна:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Зарплата от:
          <input
            type="number"
            name="salaryStart"
            value={formData.salaryStart}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Зарплата до:
          <input
            type="number"
            name="salaryEnd"
            value={formData.salaryEnd}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Опыт работы (лет):
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Размер команды:
          <input
            type="number"
            name="sizeOfTeam"
            value={formData.sizeOfTeam}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Режим работы:
          <select
            name="operatingMode"
            value={formData.operatingMode}
            onChange={handleChange}
            required
          >
            <option value="Полная">full-time</option>
            <option value="Частичная">part-time</option>
            <option value="Удаленная">hybrid</option>
          </select>
        </label>
        <label>
          Уровень:
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Middle">Middle</option>
            <option value="Senior">Senior</option>
          </select>
        </label>
        <label>
          Уровень английского:
          <select
            name="englishLevel"
            value={formData.englishLevel}
            onChange={handleChange}
            required
          >
            <option value="Не важно">Не важно</option>
            <option value="Начальный">Начальный</option>
            <option value="Средний">Средний</option>
            <option value="Продвинутый">Продвинутый</option>
          </select>
        </label>
      </div>
      <label>
        Технологии и специализации:
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          placeholder="Введите технологии через запятую"
          required
        />
      </label>
      <label>
        Опишите позицию:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </label>
      <div className="form-group">
        <label>
          Telegram:
          <input
            type="text"
            name="telegram"
            value={formData.telegram}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          WhatsApp:
          <input
            type="text"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          E-mail:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <label>
        <input
          type="checkbox"
          name="remoteWork"
          checked={formData.remoteWork}
          onChange={handleChange}
        />
        Удалённая работа
      </label>
      <button type="submit">Отправить</button>
    </form>
  );
}

export default AddVacancyForm;
