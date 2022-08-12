import React, { useState } from 'react'
import axios from "axios";
//npm start to start a webpage
export default function Offres(props) {


  const [offreData, setOffreData] = useState(null)
  function getData() {
    axios({
      method: "GET",
      url:"offre",
      headers: {
        Authorization: "Bearer "  + props.token
      }
    })
    .then((response) => {
      const res =response.data
      res.access_token && props.setToken(res.access_token)
      console.log("res")
      setOffreData(({
        name: res.name,
        type: res.type,
        description: res.description,
        datedebut: res.datedebut,
        duree: res.duree,
        address: res.address,  
        ville: res.ville, 
        prix: res.prix,            
      }))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

  return (


    <div className="Profile">

        <button onClick={getData}>Offres : </button>
        {offreData && <div>
              <p>Nom de l'offre: {offreData.name}</p>
              <p>Type: {offreData.type}</p>
              <p>Description: {offreData.description}</p>
              <p>Date de début: {offreData.datedebut}</p>
              <p>Durée: {offreData.duree}</p>
              <p>Adresse: {offreData.address}</p>
              <p>Ville: {offreData.ville}</p>
              <p>Crédit: {offreData.prix}€</p>                            
            </div>
        }

    </div>
  );
}


/*
default export function Offres() {


  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/offres").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  return (
    <div>
        <h1>Offres:</h1>
        {(typeof data.concerts === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          data.concerts.map((offre, i) => (
            <p key={i}>{offre}</p>
          ))
        )}
    </div>

  )

}
*/