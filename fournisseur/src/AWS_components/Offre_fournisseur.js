import React, {useState} from 'react';
import "./style/Register_fournisseur.css";

export default function Offre_fournisseur() {

const [isShownAdd, setIsShownAdd] = useState(false);
const [isShownModify, setIsShownModify] = useState(false);
const [isShownDelete, setIsShownDelete] = useState(false);

const handleClick = event => {
    setIsShownAdd(current => !current);
  };

const handleClickModify = event => {
  setIsShownModify(current => !current);
  };

const handleClickDelete = event => {
  setIsShownDelete(current => !current);
  };

  return(

    <div class="container">
    <div class="title">Gérer les offres</div>
    <div class="content">
    <button onClick={handleClick}>Ajouter une offre</button>
    {isShownAdd && (<Add />)}    
    <button onClick={handleClickModify}>Modifier une offre</button>
    {isShownModify && (<Modify />)}
    <button onClick={handleClickDelete}>Supprimer une offre</button>
    {isShownDelete && (<Delete />)}
    </div>
    </div>

  )
}


function Add() {
  return (
    <form method="POST" action="/add_offer">
    <div class="user-details">
      <div class="input-box">
        <span class="details">Intitulé de l'offre</span>
        <input type="text" placeholder="Intitulé de l'offre" name="name" required/>
      </div>
      <div class="input-box">
        <span class="details">Type d'offre</span>
        <input type="text" placeholder="Concert/Livre/Film" name="type" required/>
      </div>
      <div class="input-box">
        <span class="details">Description</span>
        <textarea type="text" placeholder="Decrivez l'offre" name='description' rows="4" cols="30" required/>
      </div>
      <div class="input-box">
        <span class="details">Date de début</span>
        <input type="date" placeholder="Date du début" name="dateDebut"/>
      </div>
      <div class="input-box">
        <span class="details">Durée de l'offre</span>
        <input type="text" placeholder="90 minute" name="durée"/>
      </div>
      <div class="input-box">
        <span class="details">Adresse</span>
        <input type="text" placeholder="Adresse" name="address"/>
      </div>
      <div class="input-box">
        <span class="details">Ville</span>
        <input type="text" placeholder="Ville" name="city"/>
      </div>
      <div class="input-box">
        <span class="details">Prix</span>
        <input type="text" placeholder="Prix" name="creditNecessaire"/>
      </div>
    </div>
    <div class="button">
      <input type="submit" value="Créer l'offre"/>
    </div>
  </form>
  );
}

function Modify() {
  return (
    <form method="POST" action="/modify_offer">
    <div class="user-details">
      <div class="input-box">
        <span class="details">Intitulé de l'offre</span>
        <input type="text" placeholder="Intitulé de l'offre" name="name" required/>
      </div>
      <div class="input-box">
        <span class="details">Type d'offre</span>
        <input type="text" placeholder="Concert/Livre/Film" name="type" required/>
      </div>
      <div class="input-box">
        <span class="details">Description</span>
        <textarea type="text" placeholder="Decrivez l'offre" name='description' rows="4" cols="30" required/>
      </div>
      <div class="input-box">
        <span class="details">Date du début</span>
        <input type="date" placeholder="Date du début" name="dateDebut" required/>
      </div>
      <div class="input-box">
        <span class="details">Durée de l'offre</span>
        <input type="text" placeholder="90 minute" name="durée"/>
      </div>
      <div class="input-box">
        <span class="details">Adresse</span>
        <input type="text" placeholder="Adresse" name="address"/>
      </div>
      <div class="input-box">
        <span class="details">Ville</span>
        <input type="text" placeholder="Ville" name="city"/>
      </div>
      <div class="input-box">
        <span class="details">Prix</span>
        <input type="text" placeholder="Prix" name="creditNecessaire"required/>
      </div>
    </div>
    <div class="button">
      <input type="submit" value="Supprimer l'offre"/>
    </div>
  </form>
  );
}

function Delete() {
  return (
    <form method="POST" action="/delete_offer">
    <div class="user-details">
      <div class="input-box">
        <span class="details">Intitulé de l'offre</span>
        <input type="text" placeholder="Intitulé de l'offre" name="name" required/>
      </div>
      <div class="input-box">
        <span class="details">Type d'offre</span>
        <input type="text" placeholder="Concert/Livre/Film" name="type" required/>
      </div>
      <div class="input-box">
        <span class="details">Description</span>
        <textarea type="text" placeholder="Decrivez l'offre" name='description' rows="4" cols="30" required/>
      </div>
      <div class="input-box">
        <span class="details">Date du début</span>
        <input type="date" placeholder="Date du début" name="dateDebut" required/>
      </div>
      <div class="input-box">
        <span class="details">Durée de l'offre</span>
        <input type="text" placeholder="90 minute" name="durée"/>
      </div>
      <div class="input-box">
        <span class="details">Adresse</span>
        <input type="text" placeholder="Adresse" name="address"/>
      </div>
      <div class="input-box">
        <span class="details">Ville</span>
        <input type="text" placeholder="Ville" name="city"/>
      </div>
      <div class="input-box">
        <span class="details">Prix</span>
        <input type="text" placeholder="Prix" name="creditNecessaire"required/>
      </div>
    </div>
    <div class="button">
      <input type="submit" value="Supprimer l'offre"/>
    </div>
  </form>
  );
}