import { useState } from 'react'
import axios from "axios";

export default function Profile(props) {

  const [profileData, setProfileData] = useState(null)
  function getData() {
    axios({
      method: "GET",
      url:"profile",
      headers: {
        Authorization: "Bearer "  + props.token
      }
    })
    .then((response) => {
      const res =response.data
      res.access_token && props.setToken(res.access_token)
      console.log("res")
      setProfileData(({
        firstname: res.firstname,
        lastname: res.lastname,
        email: res.email,
        dateofbirth: res.dateofbirth,
        civility: res.civility,
        number: res.number,
        address: res.address,  
        city: res.city, 
        zipcode: res.zipcode, 
        credit: res.credit,            
      }))
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}


  const [isShownAdd, setIsShownAdd] = useState(false);

  const handleClick = event => {
    setIsShownAdd(current => !current);
  };

  return (
    <div className="Profile">
        <button onClick={getData}>Information</button>
        {profileData && <div>
              <p>Prénom: {profileData.firstname}</p>
              <p>Nom: {profileData.lastname}</p>
              <p>E-mail: {profileData.email}</p>
              <p>Date de naissance: {profileData.dateofbirth}</p>
              <p>Civilité: {profileData.civility}</p>
              <p>Numéro de Telephone: {profileData.number}</p>
              <p>Adresse: {profileData.address}</p>
              <p>Ville: {profileData.city}</p>
              <p>Code Postal: {profileData.zipcode}</p>
              <p>Crédit: {profileData.credit}€</p>                            
            </div>
        }
    </div>
  );
}
