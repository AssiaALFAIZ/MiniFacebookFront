// App.js
import React, { useEffect, useState} from 'react';
import SecureRoutes from './SecureRoutes';
import keycloak from './keycloak';
import {  Routes, Route } from "react-router-dom";
import Home from './components/Home';
import axios from 'axios';
import PersonalProfile from "./components/Profile";
import Navbar from './components/Navbar';
import HomeUser from './components/HomeUser'

import Online from './components/Online';



const App = () => {
  const [userInfo, setUserInfo] = useState({
    first: '',
    last: '',
    username:'',
    email:'',
    token:''
  });
  //const [token, setToken]=useState('');
  
  useEffect(() => {
  keycloak.init({ onLoad: 'login-required' }).then((authenticated) => {
    if (authenticated) {
      //userInfo
        const token = keycloak.token;
        //setToken(token);
        const getUsername = () => keycloak.tokenParsed?.preferred_username;
        const getFirstname = () => keycloak.tokenParsed?.given_name;
        const getFamilyname = () => keycloak.tokenParsed?.family_name;
        const getEmail = () => keycloak.tokenParsed?.email;

        setUserInfo({
          first:getFirstname(),
          last:getFamilyname(),
          username:getUsername(),
          email:getEmail(),
          token:token
        });
        console.log("username :", getUsername());
        console.log("name :", getFirstname());
        console.log("family :", getFamilyname());
        console.log("email :", getEmail());
        
        const Data = new FormData();
        Data.append("given_name",getFirstname());
        Data.append("family_name", getFamilyname());
        Data.append("email",getEmail());
        Data.append("preferred_username", getUsername());

        // Envoyer le token au backend
        axios.post('http://localhost:8083/api/Infos', Data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).then(response => {
            console.log('Réponse du backend:', response.data);
            // Traitez la réponse du backend si nécessaire
          })
          .catch(error => {
            console.error('Erreur lors de l\'envoi du token au backend:', error);
            // Gérez les erreurs
          });
      } else {
        console.log('Échec de l\'authentification de l\'utilisateur');
        // Gérez l'échec de l'authentification
      }
        })
        .catch(error => {
          console.error('Error during login:', error);
          // Handle error
        });
}, []);

if (!userInfo.token) {
  // If token is not available yet, you can render a loading spinner or message.
  return <div>Loading...</div>;
}
  return (
    <div>
        <Navbar userInfo={ userInfo}  />

        
        <SecureRoutes />
        <Routes>
          <Route path="/" element={<Home userInfo={userInfo} />} />
          <Route path="/profile" element={<PersonalProfile userInfo={userInfo} />} />
          <Route path="/homeUser" element={<HomeUser userInfo={userInfo} />} />
        </Routes>

    </div>
    
  );
};

export default App;
