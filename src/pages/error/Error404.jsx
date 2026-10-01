import React from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './error-404.css'
import { Link } from 'react-router-dom';

import errorImage from '../../assets/img/error404.webp'

const Error404 = () => {
  return (
    <>
      <section className='error404'>
        <div className="container">
          <div className='row'>
            <div className='col-6'>
              <img src={errorImage} alt='404 page image' width="616" height="646" />
            </div>
            <div className='col-6'>
              <p>This Page is Not Found.</p>
              <h1 className='heading'>We are very sorry for error. We <span>can’t find this</span> page.</h1>
              <Link to="/">
                Go To Home
                <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 44 45" fill="none">
                  <circle cx="21.9644" cy="22.7372" r="11" fill="#074568"/>
                  <path d="M14.1211 14.0219C9.31467 18.4663 9.01336 25.9632 13.4476 30.7791C17.8888 35.5922 25.3916 35.8938 30.2048 31.4526C35.0179 27.0113 35.3195 19.5086 30.8783 14.6954C26.437 9.88221 18.9343 9.58066 14.1211 14.0219ZM28.8643 29.9999C24.8533 33.701 18.6014 33.4497 14.9003 29.4386C11.1991 25.4275 11.4504 19.1757 15.4615 15.4746C19.475 11.7794 25.7216 12.0305 29.4256 16.0358C33.1267 20.0469 32.8754 26.2988 28.8643 29.9999Z" fill="white"/>
                  <path d="M27.1005 20.1981L27.0344 26.31L25.0026 26.1684L25.0526 21.4967L18.5158 27.5284L17.0944 25.988L23.6312 19.9563L18.9706 19.6312L18.9925 17.5947L25.0901 18.0192C26.2123 18.0981 27.112 19.0731 27.1005 20.1981Z" fill="white"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
    </>
  )
}

export default Error404
