import { useState } from 'react'
import axios from "axios";

export default function Profile_fournisseur(props) {

  const [profileData, setProfileData] = useState(null)
  function getData() {
    axios({
      method: "GET",
      url:"profile_f",
      headers: {
        Authorization: "Bearer "  + props.token
      }
    })
    .then((response) => {
      const res =response.data
      res.access_token && props.setToken(res.access_token)
      console.log("res")
      setProfileData(({
        name: res.name,
        email: res.email,
        number: res.number,
        address: res.address,  
        city: res.city, 
        zipcode: res.zipcode, 
        description: res.description, 
        IBAN: res.IBAN, 
        SIREN: res.SIREN,             
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

        <button onClick={getData}>Information du profil</button>
        {profileData && <div>
              <p>Nom de l'entreprise: {profileData.name}</p>
              <p>E-mail: {profileData.email}</p>
              <p>Numéro de Telephone: {profileData.number}</p>
              <p>Adresse: {profileData.address}</p>
              <p>Ville: {profileData.city}</p>
              <p>Code Postal: {profileData.zipcode}</p>
              <p>Description: {profileData.description}</p>
              <p>IBAN: {profileData.IBAN}</p>
              <p>SIREN: {profileData.SIREN}€</p>                            
            </div>
        }

    </div>
  );
}