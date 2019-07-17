import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase"

import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';

class App extends React.Component {
  constructor() {
    super()
    firebase.initializeApp({
      apiKey: "AIzaSyAvZ6FseRLo2NMkIxhmi8zXiQ5QPfSUYwM",
      authDomain: "login-page-9b3b5.firebaseapp.com"
    })
  }

  render() {
    return (  
      <Router>
        <div className="App" >
          <Switch>
            <Route path ="/" exact component={Login}/>
            <Route path ="/dashboard" exact component = {Dashboard}/>
          </Switch>
        </div>
      </Router> 
    );
  }
}

export default App;
