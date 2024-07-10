import React, { useEffect, useState, useRef } from "react";
import "../App.css"; // Import your CSS file for styling
import keycloak from "../keycloak";
import axios from 'axios';
import ChatGPT from "./ChatGPT";
import robot from '../images/robot.png'
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import userImage from "../images/utilisateur.png";
import photoImage from "../images/photo.png";
import heureuxImage from "../images/heureux.png";
import videoImage from "../images/lecteur-video.png";
import Rightbar from './Rightbar';
import Sidebar from './Sidebar';
import {AiFillDislike} from "react-icons/ai";




function Home({ userInfo }) {
  //const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [postText, setPostText] = useState("");
  const [showChatGPT, setShowChatGPT] = useState(false);
  const fileInputRef = useRef(null);
  const [showCommentInput, setShowCommentInput] = useState(false); // New state for comment input visibility
  const [commentText, setCommentText] = useState(""); // New state for comment text
  const [idDisc, setIdDisc]=useState('');
  const [userActions, setUserActions] = useState(getUserActions());


  function getUserActions() {
    const userActionsJSON = localStorage.getItem("userActions");
    return userActionsJSON ? JSON.parse(userActionsJSON) : {};
  }


 
  useEffect(() => {
    if (keycloak.token !== undefined) {
      const backendEndpoint = 'http://localhost:8083/api/posts';
      axios.get(backendEndpoint, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      }).then(response => {
        console.log(response.data);
        const sortedPosts =  (response.data || []).map(post => ({
          ...post,
          isClicked: false
        })).sort((a, b) => new Date(b.date) - new Date(a.date));

        setPosts(sortedPosts);
      });
    }
  }, []);


  const handlePostTextChange = (event) => {
    setPostText(event.target.value);
  };

  const handleImageChange = (event) => {
    setNewImage(event.target.files[0]);
  };

  const handlePostSubmit = async () => {
    try {
      
      const Post = {
        text: postText,
        username: userInfo.username,
        likeCount: 0,
        dislikeCount :0
      };
  
      setNewPost(Post);
  
      const backendEndpoint = 'http://localhost:8083/api/posts';
      const DataPost = new FormData();
      if (postText) {
        DataPost.append("poste", new Blob([JSON.stringify(Post)], { type: "application/json" }));
        console.log("Request Payload:", DataPost);
      }
      if (newImage) {
        DataPost.append("poste", new Blob([JSON.stringify(Post)], { type: "application/json" }));
        DataPost.append("images", newImage);
        console.log("Request Payload:", DataPost);
      }
      if (!postText && !newImage) {
        throw new Error("Veuillez saisir du texte, télécharger une image, ou les deux.");
      }
  
      const response = await axios.post(backendEndpoint, DataPost, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
    
      console.log('Post created successfully:', response.data);
      setPosts([response.data, ...posts]);
      setNewPost({});
      setNewImage(null);
      setPostText("");
    } catch (error) {
      console.error('Error creating post:', error.message);
      console.log('Error response:', error.response);
      // Handle and display the error to the user (e.g., show a notification)
    }
  };
  const handleCommentTextChange = (event) => {
    setCommentText(event.target.value);
  };
  const handleCommentSubmit = async (postId) => {
    if(commentText==""){
      return
    }
    try {
      const backendEndpoint = `http://localhost:8083/api/posts/${postId}/comments`;
      const commentData = {
        text: commentText,
        username: userInfo.username,
        userFullName: userInfo.first+" "+ userInfo.last,
        poste: { id_poste: postId },
      };
      console.log("comment data : ", commentData);
      const DataComment = new FormData();
        DataComment.append("commentaire",new Blob([JSON.stringify(commentData)], {
          type: "application/json"
      }));
  
      const response = await axios.post(backendEndpoint, commentData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      });
      console.log("comment response")
      console.log(response.data)
      const comment={
        id_commentaire:response.data.id_commentaire,
        text:response.data.text,
        userFullName:response.data.userFullName,
        username:response.data.username
      }
      const addPosts = posts.map((post) =>{
        if(post.id === postId){
          console.log(postId);
          return { ...post, commentaires: [...post.commentaires, comment] }
        }else{
          return post
        }
      }
      );
  
      
  
      setPosts(addPosts);
      setCommentText(""); // Clear the comment text after submission
      setShowCommentInput(false); // Hide the comment input field
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };
  
  
  const handleChatbot = async()=>{
    setShowChatGPT(!showChatGPT);
    const discussionDTO=new FormData();
    discussionDTO.append("username",userInfo.username);
    discussionDTO.append("title","Discussion");
    const response= await axios.post('http://localhost:8083/api/discussion/start',discussionDTO, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    });
    console.log(response.data.response);
    setIdDisc(response.data.response);

  };
  const handleShowComment=(postt)=>{
   
   const addPosts = posts.map((post) =>{
    if(post.id === postt.id){
      return { ...post, isClicked:!post.isClicked}
    }else{
      return post
    }
  }
  );
  setPosts(addPosts);
  }

 
  
  const handleLikeOrDislike =  (post, action) => {
    if (post.likes) {
    const actionCode = action === "dislike" ? 0 : 1;

    const userLike = post.likes.find(
      (like) =>
        like.username === userInfo.username && like.like_action !== actionCode
    );
  
    // If the user has already liked/disliked the post, return
    if (userLike) {
      return;
    }
     
      const backendEndpoint = `http://localhost:8083/api/posts/${post.id}/${action}?username=${userInfo.username}`;
      axios.post(backendEndpoint,null, {
      
        headers: {   
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json', 
        },
      }).then((response)=> {
        if (keycloak.token !== undefined) {
          const backendEndpoint = 'http://localhost:8083/api/posts';
          axios.get(backendEndpoint, {
            headers: {
              Authorization: `Bearer ${keycloak.token}`
            }
          }).then(response => {
            console.log(response.data);
            const sortedPosts =  (response.data || []).map(post => ({
              ...post,
              isClicked: false
            })).sort((a, b) => new Date(b.date) - new Date(a.date));
    
            setPosts(sortedPosts);
          });
        }
         
         
      }).catch ((error) =>{
      console.error(`Error ${action === "like" ? "liking" : "disliking"} post:`, error);
          } )
        }
  };
  
   return (
    
    <div className="App">
       <div className="sidebar">
            <Sidebar />
      </div>   
      <img onClick={handleChatbot} src={robot} alt="Robot Icon" className="robot"/>
              {showChatGPT && <ChatGPT idDisc={idDisc} userInfo={userInfo}/>}
      <div className="rightbar">
            <Rightbar />
      </div>      

         
      <div className="post-container">
                
                
        <h2>Create a New Post</h2>
          <textarea
            value={postText}
            onChange={handlePostTextChange}
            placeholder="What's on your mind?"
            rows="4"
            cols="50"
            className="post-textarea"></textarea>
            <div className="icons-container">
                       
            <div className="icon-container">
        <img src={heureuxImage} alt="Feeling" className="icon-image" />
        <h3>Feeling</h3>
      </div>
             <div className="icon-container">
              <img src={videoImage} alt="Live Video" className="icon-image" />
              <h3>Live Video</h3>
            </div>
            
          

                <div className="icon-container">
            <label className="file-label">
            <div htmlFor="image-input"  className="icon-container">
                      <img src={photoImage} alt="Photo" className="icon-image" />
                      <h3>Photo</h3>
               
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageChange}
                id="image-input"
                />
             
               </div>          
            </label>
            
            </div>
            </div>
            <button onClick={handlePostSubmit} className="post-button">
                  Post
            </button>
      </div>
           
             
              
      <div id="posts">
      {Array.isArray(posts) ? (
         posts.map((post, index) => (
          <div key={post.id} className="post">
            <div className="post__top">
              <div className="post__avatar">
                <div className="user-info">
                  <img src={userImage} alt={`${post.userFullName}`} />
                    <br />
                  <div className="post-header">
                    {post.userFullName} 
                  </div>
                </div>
              </div>
                  <br />
              <div className="post__topInfo">
                <p>
                  {new Date(post.date).toLocaleString("en-US", {
                  timeZone: "Europe/Paris",
                  })}
                </p>
              </div>
            </div>
            <div className="post__content">
                {post.text && <p className="post__bottom">{post.text}</p>}
                {post.images && post.images.map((image, index) => (
                  <img
                    key={image.id_image}
                    className="post__image"
                    src={`http://localhost:8083/${image.url}`}
                    alt="Posted"
                  />
                ))}
              </div>
              

              <div className="post__options">
              <div className="post__option" onClick={() => handleLikeOrDislike(post, "like")}>
                  {post.likes && post.likes.filter((like)=>like.username==userInfo.username && like.like_action==1).length>0? (
                    <ThumbUpIcon  style={{ color: "blue" , fontSize: "27px"  }} />
                  ) : (
                    <ThumbUpIcon />
                  )}
                  <p>Like </p>
                  {post.likes && post.likes.filter((like)=> like.like_action==1).length || 0} {/* Display like count */}
                </div>
                <div className="post__option" onClick={() => handleLikeOrDislike(post, "dislike")}>
                {post.likes && post.likes.filter((like)=>like.username==userInfo.username && like.like_action==0).length>0? (
                    <AiFillDislike style={{ color: "red" , fontSize: "27px"  }} />
                  ) : (
                    <AiFillDislike  style={{fontSize: "25px"  }}/>
                  )}
                  <p>Dislike </p>
                  {post.likes && post.likes.filter((like)=> like.like_action==0).length || 0}
                </div>

            <div className="post__option">
                  <ChatBubbleOutlineIcon
                    onClick={() => {
                      handleShowComment(post);}}
                  />
                  <p>Comment</p>
                </div>
              </div>
              <div className="comments">
              
     
              {post.isClicked && (
              <>
              <div className="list-comment">
                <div>{(post.commentaires).map((comment, index) => (
                <div key={comment.id_commentaire}><b>{comment.userFullName}</b> :{comment.text}</div>
              ))}</div>
            </div>  
              <div className="comment-input">

                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={handleCommentTextChange}
                />
                <button onClick={() => handleCommentSubmit(post.id)}
                style={{ backgroundColor: "#84d5ff", color: "white" }}>
                  Add Comment
                </button>
              </div></>
                    )}

              </div>
                    
      </div>
      ))
      ) : (
        <p>No posts to display.</p>
      )}
    </div>
    </div>
  );
 
}


export default Home;