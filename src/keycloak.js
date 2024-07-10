import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080/',
  realm: 'MiniFacebook',
  clientId: 'clt',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
