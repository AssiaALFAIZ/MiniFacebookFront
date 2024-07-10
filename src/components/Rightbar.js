import React, {useState,useEffect}from 'react'
import '../styles/rightbar.css'
import { Users } from "../dummyData"
import Online from '../components/Online'
import gift from "../images/gift.png";
import ad from "../images/ad.png";
import axios from 'axios';


export default function Rightbar() {
    const [onlineFriends, setOnlineFriends] = useState([]);
    useEffect(() => {
    
        // Charge les amis en ligne depuis l'API
        axios.get('http://localhost:8083/api/utilisateurs')
          .then(response => setOnlineFriends(response.data))
          .catch(error => console.error('Erreur lors du chargement des utilisateurs en ligne :', error));
      }, []);

      const HomeRightbar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img className='birthdayImg' src={gift} alt="" />
                    <span className="birthdayText">
                        <b>Pola foster</b> and <b>3 others</b> have a birthday today.
                    </span>
                </div>
                <img className='rignhtbarAd' src={ad} alt="" />
                <h4 className="rightbarTitle">Les utilisateurs</h4>
                <ul className="rightbarfriendList">
                    {onlineFriends.map(u => (
                        <Online key={u.id} user={u} />
                    ))}
                </ul>
            </>
        );
    };
    

    
    return (
        <div className='rightbar'>
      <div className="rightbarWrapper">
         <HomeRightbar />
      </div>
        </div>
    )
}