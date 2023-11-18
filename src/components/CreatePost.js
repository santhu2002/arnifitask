import React, { useState } from "react";
import { storage, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function CreatePost(props) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState("0%");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const imageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(imageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(String(progress) + "%");
      },
      (error) => {
        console.error(error);
        alert(error.message);
      },
      async () => {
        const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

        // Add post to the Firestore collection
        await addDoc(collection(db, "posts"), {
          timestampField: serverTimestamp(),
          caption: caption,
          imgUrl: imageUrl,
          username: props.user.displayName,
          avatarUrl:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp5HDjDPRN6x4LMZ3OIJLejrdnaILx7BybY_btZyE5AX09zVE8HsfnZ-CNzxSMs96xgqU&usqp=CAU",
        });

        setProgress(0);
        setCaption("");
        setImage(null);
      }
    );
  };
  return (
    <>
      <form
        style={{
          width: "400px",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          flexDirection: "column",
          margin: "10px",
        }}
      >
        <h5>Upload Post</h5>
        <div
          className="progress my-3"
          role="progressbar"
          aria-label="Basic example"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: "100%" }}
        >
          <div className="progress-bar" style={{ width: progress }}></div>
        </div>
        <div className="input-group input-group-sm mb-3">
          <span className="input-group-text" id="inputGroup-sizing-sm">
            Caption
          </span>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            required
          />
        </div>
        <div className="mb-3" style={{ width: "100%" }}>
          <input
            onChange={handleChange}
            className="form-control"
            type="file"
            id="formFile"
            required
          />
        </div>
        <button type="button" onClick={handleUpload} className="btn btn-info">
          Create
        </button>
      </form>
    </>
  );
}
