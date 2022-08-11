import './style/Header.css';

import Login from './Login'
import Offre from './Offre'
import Register from './Register'
import useToken from './useToken'
import Deconnexion from './Deconnexion'
import Profile from './Profile'

export default function Header() {


    return(
  <section class="top-nav">
    <div>
      Logo Here
    </div>
    <input id="menu-toggle" type="checkbox" />
    <label class='menu-button-container' for="menu-toggle">
    <div class='menu-button'></div>
  </label>
    <ul class="menu">
      <li><Profile></Profile></li>
      <li><Offre></Offre></li>
      <li><Register></Register></li>
      <li><Deconnexion></Deconnexion></li>
    </ul>
  </section>
    )
}