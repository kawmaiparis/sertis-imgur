import React, { Fragment } from 'react'
import './Dashboard.css';
import '../../App.css';
import Card from "./Card"
import firebase from "firebase"
import { Link } from "react-router-dom"

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"

const axios = require("axios");

class Dashboard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: "user1",
            image_locations: [],
            file: null
        }

        this.openPopup = this.openPopup.bind(this)
        this.onChange = this.onChange.bind(this)
        this.uploadPhoto = this.uploadPhoto.bind(this)
        this.closePopup = this.closePopup.bind(this)
    }

    componentDidMount() {
        console.log("downloading filenames")
        fetch("http://localhost:5000/display")
            .then(response => response.json())
            .then(data => this.setState({ image_locations: data }))
    }

    onChange(e) {
        this.setState({
            file: e.target.files[0]
        }, () => {
            if (this.state.file == null) {
                console.log("file is null when browsing")
                return
            }
            console.log("browsed: ", this.state.file.name);

            let formData = new FormData()
            formData.append("myImage", this.state.file)

            let req = {
                method: 'post',
                url: 'http://localhost:5000/browseFile',
                data: formData
            }
            axios(req).then(res => {
                return res;
            })
        })
    }

    openPopup(e) {
        e.preventDefault()

        if (this.state.file == null) {
            console.log("file is null when uploading")
            return
        }
        document.querySelector(".popup-box").style.display = "flex"

    }

    uploadPhoto() {
        console.log("confirm upload")
        fetch("http://localhost:5000/upload")
            .then(response => response.json())
            .then(data => console.log(data))
        document.querySelector(".popup-box").style.display = "none"
        setTimeout(() => { window.location.reload() }, 5000)

    }

    closePopup() {
        document.querySelector(".popup-box").style.display = "none"
    }

    render() {
        return (
            <div className="base-container">
                <h4 className="display-4 text-center mb-4">Dashboard</h4>

                <div className='container mt-4'>
                    <Fragment>
                        <form>
                            <h3>Upload your Image</h3>
                            <div className="custom-file mb-4">
                                <input type="file" accept="image/*" className="custom-file-input" id="customFile" onChange={this.onChange} />
                                <label className="custom-file-label" htmlFor="customFile">{this.state.file == null ? "choose file" : this.state.file.name}</label>
                            </div>

                            <input type="submit" value="Upload" className="btn btn-warning btn-block" onClick={this.openPopup} />
                        </form>
                    </Fragment>
                </div>

                <div className="signOut">
                    <h2 className="user">{this.state.user}</h2>
                    <Link to="/" className="btn btn-outline-dark" isLoggedIn={false}>Sign out!</Link>
                    {/* <img alt="profile picture" src={firebase.auth().currentUser.photoURL}/> */}
                </div>
                <br />

                <div className="flex-container">
                    {this.state.image_locations.map((image) => <Card imagesrc={image} />)}
                </div>

                <div className="popup-box">
                    <div className="popup-content">
                        <p>Quality of image to be compressed...</p>
                        <p>100 = original  0 = max-compression</p>
                        <div>
                            <div className="popup-close" onClick={this.closePopup}>+</div>
                            <input className="popup-input" type="text" placeholder="eg: 99" />
                            <button className="btn btn-warning btn-lg" onClick={this.uploadPhoto}>Confirm Upload</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Dashboard;
