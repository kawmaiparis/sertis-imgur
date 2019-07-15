import React from 'react';
import firebase from "firebase"
import FileUpload from './FileUpload';
import './Dashboard.css';
import '../../App.css';
import Cardsss from "./Cardsss"
import Card from "./Card"
import { Link } from "react-router-dom"
// import Spinner from "./Spinner"

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"

class Dashboard extends React.Component {

    constructor() {
        super()
        this.state = {
            user: "user1",
            image_locations: []
        }
    }
    
    componentDidMount() {
        console.log("downloading filenames")
        fetch("http://localhost:5000/display")
        .then(response => response.json())
        .then(data => this.setState({image_locations: data}))
    }

    render() {
        return ( 
            <div className="App">
                    <h4 className="display-4 text-center mb-4">Dashboard</h4>

                    <div className='container mt-4'>
                        <FileUpload/>
                    </div>
                    <br/>

                    <div className="flex-container">
                        {this.state.image_locations.map((image) => <Card imagesrc={image}/> )}
                    </div>

                    {/* <Spinner/> */}
                    <br/>
                    <h2>user: {this.state.user}</h2>
                    <Link to="/" isLoggedIn={false}>Sign out!</Link>
            </div>
        );
    }
}

export default Dashboard;
