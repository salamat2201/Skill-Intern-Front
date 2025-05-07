import axios from 'axios';

const API_BASE_URL = 'https://example.com/api'; // Укажите URL вашего API

// Получение списка курсов
export const fetchCourses = async () => {
  const response = await axios.get(`${API_BASE_URL}/courses`);
  return response.data; // Предполагаем, что API возвращает массив курсов
};
