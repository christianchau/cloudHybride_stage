import React, { useState, useEffect } from 'react';
import './style/Register.css';


export default function Register() {

  const [isShownAdd, setIsShownAdd] = useState(false);

  const handleClick = event => {
    setIsShownAdd(current => !current);
  };

  return(

    <div class="content">
    <button onClick={handleClick}>Inscription</button>
    {isShownAdd && (<Register_b />)}    
    </div>

  )
}

function Register_b() {

  return(


    <div class="container">
    <div class="title">Inscription</div>
    <div class="content">
      <form method="POST" action="https://cloudhybride-stage.cleverapps.io/register">
        <div class="user-details">
          <div class="input-box">
            <span class="details">Prénom</span>
            <input type="text" placeholder="Prénom" name= "firstname" required/>
          </div>
          <div class="input-box">
            <span class="details">Nom</span>
            <input type="text" placeholder="Nom" name="lastname" required/>
          </div>
          <div class="input-box">
            <span class="details">E-mail</span>
            <input type="text" placeholder="E-mail" name="email" required/>
          </div>
          <div class="input-box">
            <span class="details">Numéro de téléphone</span>
            <input type="text" placeholder="Numéro de téléphone" name='phoneNumber'required/>
          </div>
          <div class="input-box">
            <span class="details">Mot de passe</span>
            <input type="text" placeholder="Mot de passe" name="password"required/>
          </div>
          <div class="input-box">
            <span class="details">Confirmer le mot de passe</span>
            <input type="text" placeholder="Confirmer le mot de passe" required/>
          </div>
          <div class="input-box">
            <span class="details">Adresse</span>
            <input type="text" placeholder="Adresse" name="address"required/>
          </div>
          <div class="input-box">
            <span class="details">Ville</span>
            <input type="text" placeholder="Ville" name="city"required/>
          </div>
          <div class="input-box">
            <span class="details">Code Postal</span>
            <input type="text" placeholder="Code Postal" name="ZipCode"required/>
          </div>
          <div class="input-box">
            <span class="details">Date de naissance</span>
            <input type="date" name="dateOfBirth" required/>
          </div>
        </div>
        <div class="gender-details">
          <input type="radio" name="gender" value="Homme" id="dot-1"/>
          <input type="radio" name="gender" value="Femme" id="dot-2"/>
          <input type="radio" name="gender" value="None" id="dot-3"/>
          <span class="gender-title">Sexe</span>
          <div class="category">
            <label for="dot-1">
            <span class="dot one"></span>
            <span class="gender">Homme</span>
          </label>
          <label for="dot-2">
            <span class="dot two"></span>
            <span class="gender">Femme</span>
          </label>
          <label for="dot-3">
            <span class="dot three"></span>
            <span class="gender">Ne pas renseigner</span>
            </label>
          </div>
        </div>
        <div class="button">
          <input type="submit" value="S'inscrire"/>
        </div>
      </form>
    </div>
  </div>


  )
}
