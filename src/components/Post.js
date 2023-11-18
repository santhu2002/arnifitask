import {React,useEffect,useState} from "react";
import { Avatar } from "@mui/material";
import { faComment, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db } from "../firebase";
import { collection, onSnapshot,addDoc } from "firebase/firestore";


export default function Post(props) {
  const {postId, caption, username, avatarUrl, imgUrl } = props;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const myCollection = collection(db, "posts");

  useEffect(() => {
    let unsubscribe;
  if (postId) {
    const commentsCollection = collection(myCollection, postId, "comments");
    unsubscribe = onSnapshot(commentsCollection, (snapshot) => {
      setComments(snapshot.docs.map((doc) => doc.data()));
    });
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
  }, [postId]);

  const postcomment = async (e) => {
    e.preventDefault();
    const commentsCollectionRef = collection(db, "posts", postId, "comments");
  
    try {
      await addDoc(commentsCollectionRef, {
        text: comment,
        username: username,
      });
  
      // Clear the comment input after posting
      setComment("");
    } catch (error) {
      console.error("Error adding comment: ", error.message);
    }
  };

  return (
    <div className="card my-3" >
      <div
        style={{ display: "flex", alignItems: "center", padding: "10px" }}
        className="post__header"
      >
        <Avatar
          style={{ marginRight: "5px" }}
          className="post__avatar"
          alt={username}
          src={avatarUrl}
        />
        <h4 style={{ marginBottom: "0" }}>{username}</h4>
      </div>
      <img src={imgUrl} className="mg-fluid" style={{objectFit:"cover",width:"100%",height:"240px"}}  alt="..." />
      <div className="card-body">
        <h6 className="card-title">
          <strong>@{username}: </strong>
          {caption}
        </h6>
        <div>
        {/* <FontAwesomeIcon icon={solid("heart")} /> */}
        {/* <FontAwesomeIcon  icon={faComment} style={{marginRight:"5px"}}/> */}
        <div>
          {comments.map((comment) => (
            <p>
              <strong>@{comment.username}: </strong>
              {comment.text}
            </p>
          ))}
        </div>
        </div>
      </div>
      <div className="card-footer" >
        <form onSubmit={postcomment} style={{display:"flex",justifyContent:"space-between"}} >
        <input type="text" placeholder="Comment" style={{width:"60%",paddingLeft:"4px"}} value={comment} onChange={(e)=>setComment(e.target.value)} required/>
        <button type="submit" style={{width:"30%",padding:"2px",borderRadius:"5px",}}>
          Post
        </button>
        </form>
      </div>
    </div>
  );
}
