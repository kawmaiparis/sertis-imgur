import React from 'react';
import '../../App.css';

import { Link , Redirect} from "react-router-dom"
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

class Login extends React.Component {
    uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  }
    constructor(props) {
        super(props)
        if (this.props.isLoggedIn) {
          this.state = {isLoggedIn: true}
        } else {
          this.state = {isLoggedIn: false}
          firebase.auth().signOut()
        }
     
        // firebase.initializeApp({
        //     apiKey: "AIzaSyAvZ6FseRLo2NMkIxhmi8zXiQ5QPfSUYwM",
        //     authDomain: "login-page-9b3b5.firebaseapp.com"
        //   })
    
        firebase.auth().onAuthStateChanged(user => {
          this.setState({isLoggedIn:!!user})
        })
    }   
 
    render() {
        return (
        <div className="login-container">
              {this.state.isLoggedIn ? (
                <Redirect to="dashboard" />
                //   <span>
                //     <h1>Welcome {firebase.auth().currentUser.displayName}, you're signed in!</h1>
                //     <img alt="profile picture" src={firebase.auth().currentUser.photoURL}/>
                //     <Link to="/dashboard">Go to Dashboard</Link>
                //     <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
                // </span>
              ) : (
                <div>
                <h1>Login.</h1>
                <br/>
                <StyledFirebaseAuth
                  uiConfig={this.uiConfig}
                  firebaseAuth={firebase.auth()}
                />
                </div>
              )}
        </div>
        )
    }
}

export default Login;
