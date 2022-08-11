import { useState } from 'react';
import axios from "axios";

export default function Login_fournisseur(props) {

  const [loginForm, setloginForm] = useState({
    email: "",
    password: ""
  })

  function logMeIn(event) {
    axios({
      method: "POST",
      url:"token_f",
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
                  value={loginForm.email} />
                            </div>
            <div class="input-box">
           <span class="details">Mot de passe</span>
            <input onChange={handleChange} 
                  type="password"
                  text={loginForm.password} 
                  name="password" 
                  placeholder="Mot de passe" 
                  value={loginForm.password} />
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


