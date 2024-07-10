// SecureRoutes.js
import React from 'react';
import { Route, Navigate, Routes } from 'react-router-dom';
import keycloak from './keycloak';

const Home = () => <h2>Home</h2>;

const SecureRoutes = () => {
  const isAuthenticated = keycloak.authenticated;

  return (
    <div>
      <Routes>
        <Route path="/Home" render={() => (isAuthenticated ? <Home /> : <Navigate to="/" />)} />
      </Routes>
      
    </div>
  );
};

export default SecureRoutes;
