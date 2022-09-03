import { useState } from 'react';
import "./style/Register_fournisseur.css";


export default function Register_fournisseur() {

  const [isShownAdd, setIsShownAdd] = useState(false);

  const handleClick = event => {
    setIsShownAdd(current => !current);
  };

  return(

    <div class="content">
    <button onClick={handleClick}>Inscription</button>
    {isShownAdd && (<Register />)}    
    </div>

  )
}

function Register() {

  return(

    <div class="container">
    <div class="title">Inscription Fournisseur</div>
    <div class="content">
      <form method="POST" action="/register_f">
        <div class="user-details">
          <div class="input-box">
            <span class="details">Nom de l'entreprise</span>
            <input type="text" placeholder="Nom de l'entreprise" name="name" required/>
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
            <span class="details">IBAN</span>
            <input type="text" placeholder="IBAN" name="IBAN"required/>
          </div>
          <div class="input-box">
            <span class="details">SIREN</span>
            <input type="text" placeholder="SIREN" name="SIREN"required/>
          </div>                    
          <div class="input-box">
            <span class="details">Description</span>
            <textarea type="text" name="description" rows="5" cols="60" required/>
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
