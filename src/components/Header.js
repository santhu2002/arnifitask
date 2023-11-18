import React from "react";

export default function Header(props) {
  const signOut = () => {
    props.signOut();
  };
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{position:"sticky",top:"0px",zIndex:"1"}}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Instagram
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            {props.user ? (
              <>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={signOut}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    data-bs-toggle="modal"
                    data-bs-target="#signupModal"
                  >
                    Sign Up
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#signinModal"
                  >
                    Sign In
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
