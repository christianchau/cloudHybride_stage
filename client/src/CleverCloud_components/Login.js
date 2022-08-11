import { useState } from 'react';
import axios from "axios";

export default function Login(props) {

    const [loginForm, setloginForm] = useState({
      email: "",
      password: ""
    })

    function logMeIn(event) {
      axios({
        method: "POST",
        url:"token",
        data:{
          email: loginForm.email,
          password: loginForm.password
         }
      })
      .then((response) => {
        props.setToken(response.data.access_token)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
      })
  
      setloginForm(({
        email: "",
        password: ""}))
  
      event.preventDefault()
    }
    
    function handleChange(event) { 
      const {value, name} = event.target
      setloginForm(prevNote => ({
          ...prevNote, [name]: value})
      )}
      
    return (
      <div class="container">
      <div class="title">Se connecter</div>
      <div class="content">
          <form className="login">
          <div class="user-details">
          <div class="input-box">
          <span class="details">Adresse E-mail</span>
            <input onChange={handleChange} type="email"
                  text={loginForm.email} 
                  name="email" 
                  placeholder="Adresse e-mail" 
                  value={loginForm.email} required/>
                            </div>
            <div class="input-box">
           <span class="details">Mot de passe</span>
            <input onChange={handleChange} 
                  type="password"
                  text={loginForm.password} 
                  name="password" 
                  placeholder="Mot de passe" 
                  value={loginForm.password} required/>
                    </div>
                    </div>
          <div class="button">
          <input type="submit" value="Connexion" onClick={logMeIn}/>
          </div>
        </form>
        </div>
      </div>
      
    );
}

/*
import React, { useState, useEffect } from 'react';
import './style/Login.css';
import axios from "axios";

import PropTypes from 'prop-types';

async function loginUser(credentials) {
    return fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }



function Login( setToken ) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          email,
          password
        });
        setToken(token)
      }

  return(

    <div className="login-wrapper">
    <h1>Se connecter</h1>
    <form onSubmit={handleSubmit}>
      <label>
        <p>Adresse e-mail</p>
        <input type="text" onChange={e => setEmail(e.target.value)} placeholder="Adresse e-mail" required />
      </label>
      <label>
        <p>Mot de passe</p>
        <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required />
      </label>
      <div>
        <button type="submit">Connexion</button>
      </div>
    </form>
    </div>

  )
}


Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }

export default Login
*/