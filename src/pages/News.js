import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../api/api';
import './News.css'; // Подключаем стили

function News() {
  const [role, setRole] = useState(null);
  const [newsData, setNewsData] = useState({ title: '', description: '', image: '' });
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
        const response = await axios.get(`${api}/api/admin/allNews`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const handleSubmit = async () => {
    if (!newsData.title || !newsData.description || !newsData.image) {
      alert('All fields are required!');
      return;
    }

    try {
      const response = await axios.post(
        `${api}/api/admin/addNews`,
        {
          title: newsData.title,
          description: newsData.description,
          image: newsData.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('News added successfully!');
      console.log(response.data);
      setNewsData({ title: '', description: '', image: '' });
      document.getElementById('newsModal').style.display = 'none';
      setAllNews((prev) => [...prev, response.data]); // Добавление новой новости в список
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
            <div className="modal-content">
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
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newsData.title}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newsData.description}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={newsData.image}
                onChange={handleInputChange}
              />
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
            <div key={index} className="news-item">
              <h3>{news.title}</h3>
              <p>{news.description}</p>
              {news.image && <img src={news.image} alt={news.title} />}
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
