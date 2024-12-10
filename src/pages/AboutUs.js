// src/pages/AboutUs.js
import React from 'react';
import './AboutUs.css'

function AboutUs() {
  return (
    <div>
      <h1>About Us</h1>
      <div className='content'>
      <div className='photos'>
        <img height={300} src='https://static.vecteezy.com/system/resources/previews/007/932/867/non_2x/about-us-button-about-us-text-template-for-website-about-us-icon-flat-style-vector.jpg'></img>
        <img width={300} src='https://media.licdn.com/dms/image/v2/D5616AQHhlGBKcYumVg/profile-displaybackgroundimage-shrink_200_800/profile-displaybackgroundimage-shrink_200_800/0/1694778921357?e=2147483647&v=beta&t=VqB0xf18U6QHE5L5lkGxFC5Oha_3LWB_oXJWDs-Oc9w'></img>
      </div>
      <div className='texts'>
        <p className='title'><b>Skill Intern</b></p>
        <p className='gray'>from Kazakhstan</p>
        <p className='text'>
          О ПРОЕКТЕ:
          <br></br>
          SKill Intern работает с 2024
          года. 
          Наша аудитория - это не только айтишники. Это
          активный средний класс, который хочет быть
          независимым, - представители цифровых и
          свободных профессий, предприниматели,
          преподаватели, студенты, учёные, активисты. И
          вообще все, кто планирует переход в ОТ эли
          просто интересуется инновациями.
          Владельцы: основатели Skill:Intern Yerassyl
          Омирзак, Мансур Жумажан, Salamat Daribayev,
          Bakdaulet Bekkhoja and Nurbek Suieubek . 
        </p>
      </div>
      </div>
    </div>
  )
}

export default AboutUs;
