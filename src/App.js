import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import News from './pages/News.js';
import Vacancies from './pages/Vacancies.js';
import VacancyDetails from './components/VacancyDetails';
import Internships from './pages/Internships.js';
import AboutUs from './pages/AboutUs.js';
import Login from './pages/Login.js';
import AddVacancyForm from './pages/AddVacancyForm.js';
import MyVacanciesPage from './pages/MyVacanciesPage.js';
import MyResponsesPage from './pages/MyResponsesPage.js';
import VacancyResponses from './pages/VacancyResponses.js';
import AllUsers from './pages/AllUsers.js';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверяем, есть ли токен при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  // Функция для входа
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    closeLoginModal();
  };

  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar 
        onLoginClick={openLoginModal} 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      {isLoginOpen && <Login onClose={closeLoginModal} onLoginSuccess={handleLoginSuccess} />}
      <Routes>
        <Route path="/" element={<News />} />
        <Route path="/vacancies" element={<Vacancies />} />
        <Route path="/vacancies/:id" element={<VacancyDetails />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/add-vacancy" element={<AddVacancyForm />} /> 
        <Route path="/my-vacancies" element={<MyVacanciesPage />} />
        <Route path="/my-responses" element={<MyResponsesPage />} />
        <Route path="/responses/:id" element={<VacancyResponses />} />
        <Route path="/all-users" element={<AllUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
