import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import './News.css'; // Подключаем стили

function News() {
  const [role, setRole] = useState(null);
  const [newsData, setNewsData] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [allNews, setAllNews] = useState([]); // Состояние для всех новостей
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Получение роли пользователя
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setRole(decoded.role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Получение всех новостей
    const fetchAllNews = async () => {
      try {
        const response = await axios.get(`${api}/api/news/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data)
        setAllNews(response.data); // Сохранение новостей в состояние
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchAllNews();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsData({ ...newsData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Сохранение файла в state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newsData.title || !newsData.description || !imageFile) {
      alert('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('description', newsData.description);
    formData.append('image', imageFile); // Добавление файла в FormData

    try {
      const response = await axios.post(`${api}/api/admin/addNews`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Указываем тип контента
          Authorization: `Bearer ${token}`,// Указываем тип контента
        },
      });
      alert('News added successfully!');
      console.log(response);
    } catch (error) {
      console.error('Error adding news:', error);
      alert('Failed to add news.');
    }
  };

  return (
    <div>
      {/* Кнопка для добавления новости */}
      {role === 'ROLE_ADMIN' && (
        <div>
          <button
            className="addnews"
            onClick={() => {
              const modal = document.getElementById('newsModal');
              modal.style.display = 'block';
            }}
          >
            Add news +
          </button>

          {/* Модальное окно для добавления новости */}
          <div id="newsModal" className="modal" style={{ display: 'none' }}>
            <div className="modal-contents">
              <span
                className="close"
                onClick={() => {
                  const modal = document.getElementById('newsModal');
                  modal.style.display = 'none';
                }}
              >
                &times;
              </span>
              <h2>Add News</h2>
              <div>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newsData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newsData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="image">Image:</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Список всех новостей */}
      <div className="news-list">
        <h2>All News</h2>
        {allNews.length > 0 ? (
          allNews.map((news, index) => (
            <div className="news-item">
              <h3 className="news-title">{news.title}</h3>
              <div className='newss'>
                {news.imageUrl && <img className="news-image" src={news.imageUrl} alt={news.title} />}
                <p className="news-description">{news.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No news available</p>
        )}
      </div>
    </div>
  );
}

export default News;
