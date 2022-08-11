import axios from "axios";

export default function Deconnexion(props) {

  function logMeOut() {
    axios({
      method: "POST",
      url:"logout",
    })
    .then((response) => {
       props.token()
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })}

  	return(
		<header className="App-header">
            <button onClick={logMeOut}>Deconnexion </button>
		</header>
	)
}