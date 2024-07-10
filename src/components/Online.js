import React from 'react'
import "../styles/online.css"
import userImage from "../images/avatar.png";

export default function Online({user}) {
  return (
    <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
            <img className='rightbarProfileImg' src={userImage} alt="" />
            <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{user.nom}  {user.prenom}</span>
    </li>
  )
}