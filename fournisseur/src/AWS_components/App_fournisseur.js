import React from 'react'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import "./style/App_fournisseur.css";


import Register_fournisseur from './Register_fournisseur';
import Login_fournisseur from './Login_fournisseur';
import useToken_fournisseur from './useToken_fournisseur';
import Deconnexion_fournisseur from './Deconnexion_fournisseur';
import Offre_fournisseur from './Offre_fournisseur';
import Profile_fournisseur from './Profile_fournisseur';

//npm start to start a webpage



export default function App_fournisseur() {
    const { token, removeToken, setToken } = useToken_fournisseur();


return (
    <BrowserRouter>
    <div className="App">
    <h1>Application Fournisseur</h1>
    <Link to="/"> Home</Link>
    <Link to="/Profile_fournisseur"> Profile </Link>
    <Link to="/Offre_fournisseur"> Les offres</Link>

    {!token && token!=="" &&token!== undefined?  
    <Login_fournisseur setToken={setToken} />:
    <>
    <Deconnexion_fournisseur token={removeToken}/>
    <Routes>
        <Route path="/Profile_fournisseur" element={<Profile_fournisseur token={token}/>}/>
        <Route path="/Offre_fournisseur" element ={<Offre_fournisseur token ={token}/>}/>
    </Routes>
    </>
    }
    <Register_fournisseur/>
    </div>
    </BrowserRouter>
	)
}
