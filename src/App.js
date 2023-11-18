import "./App.css";
import Header from "./components/Header";
import Post from "./components/Post";
import CreatePost from "./components/CreatePost";
import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import {InstagramEmbed} from "react-social-media-embed";

function App() {
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  const myCollection = collection(db, "posts"); // Use firestore functions

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [user, username]);

  useEffect(() => {
    const unsubscribe = onSnapshot(myCollection, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    // console.log(posts);
    return () => unsubscribe();
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        return updateProfile(authUser.user, {
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
  };

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      alert(error.message);
      setEmail("");
      setPassword("");
      setUsername("");
    });
  };

  const signOut = () => {
    auth.signOut();
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <div className="App">
      <div
        className="modal fade"
        id="signupModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Sign Up for Instagram
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    @
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <div className="mb-3 align_left">
                  <label htmlFor="signupEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="signupEmail"
                    aria-describedby="emailHelp"
                  />
                  <div id="emailHelp" className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3 align_left">
                  <label htmlFor="signupPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    id="signupPassword"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  onClick={signUp}
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="signinModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h1 className="modal-title fs-5">Sign In for Instagram</h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 align_left">
                  <label htmlFor="signinEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="signinEmail"
                    aria-describedby="emailHelp"
                  />
                  <div className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3 align_left">
                  <label htmlFor="singinPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="singinPassword"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={signIn}
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Header user={user} signOut={signOut} />
      <div className="container my-3" style={{display:"flex",justifyContent: "space-between",flexDirection:"row",flexWrap:"wrap",alignItems:"flex-start"}}>
        <div className="row" style={{width:"70%"}}>
          {posts.map((post) => (
            <div className="col-md-4">
              <Post
                key={post.id}
                postId={post.id}
                caption={post.caption}
                username={post.username}
                avatarUrl={post.avatarUrl}
                imgUrl={post.imgUrl}
              />
            </div>
          ))}
        </div>
        <div>
          {user && <h3 style={{ margin: "10px",textAlign:"center",fontFamily:"cursive" }}>Hello {user.displayName} 😉</h3>}
          <div style={{ display: "flex", justifyContent: "center",width:"320px" }}>
            <InstagramEmbed
              url="https://www.instagram.com/p/CUbHfhpswxt/"
              width={328}
            />
          </div>
        </div>
      </div>
      {user && (
        <div className="d-flex justify-content-center">
          <CreatePost user={user} />
        </div>
      )}
    </div>
  );
}

export default App;
