import React from 'react';
import "./Card-style.css"

class Card extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filename: this.props.imagesrc,
            loadSuccess: false
        }
        this.download = this.download.bind(this)
    }

    download() {
        console.log("download button pressed")
        fetch("http://localhost:5000/download/" + this.state.filename)
        .then(response => response.text())
        .then(data => this.setState({loadSuccess: true}))
        setTimeout(() => {this.setState({loadSuccess: false})}, 1000)
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
                    <img src={imagesrc} alt="image1" className="card-img-top" />
                    <div className="card-bg">
                    {/* <h4 className="card-title">Card Title</h4> */}
                    <button href="#" className="btn btn-danger" onClick={this.download}>
                        {this.state.loadSuccess ? 
                        <span class="spinner-border spinner-border-sm"></span>
                        :
                        "Download"
                        }                        
                    </button>
                </div>
                </div>
                

            </div>
        )
    }
}

export default Card;
