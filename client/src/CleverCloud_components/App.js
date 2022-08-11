import React, {useState} from 'react'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import './style/App.css';

import Login from './Login'
import Offre from './Offre'
import Register from './Register'
import useToken from './useToken'
import Deconnexion from './Deconnexion'
import Profile from './Profile'
//npm start to start a webpage



export default function App() {
  const { token, removeToken, setToken } = useToken();


	return (
    <BrowserRouter>
		<div className="App">
    <h1>Application Beneficiaire</h1>
      <Link to="/"> Home </Link>
      <Link to="/Profile"> Profile </Link>
      <Link to="/Offre"> Offres </Link>

        {!token && token!=="" &&token!== undefined?  
        <Login setToken={setToken} />:
        
      <>
      <Deconnexion token={removeToken}/>
      <Routes>
        <Route path="/Profile" element={<Profile token={token}/>}/>
        <Route path="/Offre" element ={<Offre token ={token}/>}/>
      </Routes>
      </>
      }
        <Register/>
    

		</div>
    </BrowserRouter>
	)

}



/*
{token && token=="" &&token== undefined?  
<Login setToken={setToken} />:
*/
