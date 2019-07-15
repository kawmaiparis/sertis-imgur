import React from 'react';
import "./Card-style.css"

class Card extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filename: this.props.imagesrc
        }
        this.download = this.download.bind(this)
    }

    download() {
        console.log("download button pressed")
        fetch("http://localhost:5000/download/" + this.state.filename)
    }

    render() {
        let imagesrc
        if (this.state.filename === undefined) 
            imagesrc = "https://storage.cloud.google.com/image_bucket_here/default?folder=true&organizationId=true"
        else
            imagesrc = "https://storage.cloud.google.com/image_bucket_here/" + this.state.filename + "?folder=true&organizationId=true"
            
        return (
            <div className="card text-center">
                <div className="overflow">
                    <img src={imagesrc} alt="image1" className="card-img-top"/>
                </div>
                <div>
                    {/* <h4 className="card-title">Card Title</h4> */}
                    <a href ="#" className="btn btn-outline-success" onClick={this.download}>Download this Image!</a> 
                </div>

            </div>
        )
    }
}

export default Card;
