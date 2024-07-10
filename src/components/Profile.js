import React, { useState, useEffect } from 'react';
import "../styles/Profile.css";
import { FiEdit } from "react-icons/fi";
import { AiFillInstagram, AiFillTwitterCircle } from "react-icons/ai";
import { BiLogoSnapchat } from "react-icons/bi";
import axios from 'axios';
import person from '../images/person.png'

function PersonalProfile({ userInfo }) {
  const [editedUserInfo, setEditedUserInfo] = useState({
    nom: userInfo.last,
    prenom: userInfo.first,
    email: userInfo.email,
    username: userInfo.username,
    ville: '',
    adresse: '',
    date_naissance: '',
  });
  const [isEditing, setEditing] = useState(false);
  const [isProfileComplete, setProfileComplete] = useState(false);

  // Retrieve user information from localStorage on component mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setEditedUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // Persist user information in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(editedUserInfo));
  }, [editedUserInfo]);

  

  useEffect(() => {
    
    const fetchUserInfo = async () => {
       
      try {
         if (!userInfo.token) {
          console.error('Token is missing.');
          return;
        }
        const response = await axios.get(`http://localhost:8083/api/user/${userInfo.username}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
  
        if (response.status === 200) {
          setEditedUserInfo(response.data);
          const { ville, date_naissance, adresse } = response.data;
          const isComplete = ville && date_naissance && adresse;
          setProfileComplete(isComplete);
        } else {
          console.error('Failed to retrieve user information. Response:', response.status);
        }
      } catch (error) {
        console.error('Error during user information retrieval:', error);
      }
    };
  
    fetchUserInfo();
  }, [userInfo.token, userInfo.username]);
  

  const handleEditClick = () => {
    setEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      const data = new FormData();
      // Append edited user info to FormData
      for (const key in editedUserInfo) {
        data.append(key, editedUserInfo[key]);
      }

      const response = await axios.post('http://localhost:8083/api/update', data, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (response.ok) {
        console.log('Modifications sauvegardées avec succès !');
      } else {
        console.error('Échec de la sauvegarde des modifications.');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des modifications :', error);
    }

    // Disable edit mode after saving
    setEditing(false);
  };

  return (
    <div className="mb-3" style={{ borderRadius: '.5rem' }}>
      <div className="gradient-custom">
        <img
          src={person}
          alt="Avatar"
          className="my-5"
          style={{ width: '80px' }}
          fluid="true"
        />
        <div tag="h5">
          {isEditing ? (
            <input
              type="text"
              name="prenom"
              value={editedUserInfo.prenom }
              onChange={handleInputChange}
            />
          ) : (
            editedUserInfo.prenom 
          )}&nbsp;
          {isEditing ? (
            <input
              type="text"
              name="nom"
              value={editedUserInfo.nom}
              onChange={handleInputChange}
            />
          ) : (
            editedUserInfo.nom
          )}
        </div>
        <FiEdit className='edit' onClick={handleEditClick} />
      </div>

      <div className="p-4">
        <div tag="h6">Information</div>
        <hr className="mt-0 mb-4" />
        <div className="pt-1">
          <div>
            <div>Email</div>
            {isEditing ? (
              <input
                type="text"
                name="email"
                value={editedUserInfo.email}
                onChange={handleInputChange}
              />
            ) : (
              editedUserInfo.email 
            )}
          </div>
          {isEditing && (
            
            <>
              <div>
                <div>Ville</div>
                <input
                  type="text"
                  name="ville"
                  value={editedUserInfo.ville}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <div>Adresse</div>
                <input
                  type="text"
                  name="adresse"
                  value={editedUserInfo.adresse}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <div>Date de Naissance</div>
                <input
                  type="date"
                  name="date_naissance"
                  value={editedUserInfo.date_naissance}
                  onChange={handleInputChange}
                />
                 </div>
            </>
          )}
        </div>
        {!isEditing && (
  <div>
    {/* Display progress bar based on profile completion */}
    <div className="progress" style={{ height: '15px', marginBottom: '10px', backgroundColor: '#70e497', marginLeft: '10%', marginRight: isProfileComplete ? '10%' : '50%' , marginTop: '10px', display: 'flex' }}>
  <div
    className={`progress-bar ${isProfileComplete ? 'bg-success' : 'bg-warning'}`}
    role="progressbar"
    style={{ borderRadius: '10px', flex: isProfileComplete ? '1' : '0.5' }}
    aria-valuenow={isProfileComplete ? '100' : '50'}
    aria-valuemin="0"
    aria-valuemax="100"
  > {isProfileComplete ? '100%' : '50%'}</div>
</div>


    {/* Display completion message */}
    <div className="mt-2">
      {isProfileComplete ? (
        <p>Votre profil est complet. Toutes les informations sont remplies.</p>
      ) : (
        <p>Complétez votre profil en ajoutant la ville, la date de naissance et l'adresse.</p>
      )}
    </div>
  </div>
)}


        {isEditing && <button onClick={handleSaveClick} className='save'>Sauvegarder</button>}
        {!isEditing && (
          <div>
            <p>Ville: {editedUserInfo.ville}</p>
            <p>Adresse: {editedUserInfo.adresse}</p>
            <p>Date de Naissance: {editedUserInfo.date_naissance}</p>
          </div>
        )}
        <div className="d-flex justify-content-start">
          <a href="#!"><AiFillInstagram /></a>
          <a href="#!"><AiFillTwitterCircle /></a>
          <a href="#!"><BiLogoSnapchat /></a>
        </div>
      </div>
    </div>
  );
}

export default PersonalProfile;