import { useState } from 'react';

export default function useToken_fournisseur() {

  function getToken() {
	const userToken = localStorage.getItem('token');
	return userToken && userToken
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  function removeToken() {
	localStorage.removeItem("token");
    setToken(null);
  }

  return {
    setToken: saveToken,
    token,
	removeToken
  }

}
