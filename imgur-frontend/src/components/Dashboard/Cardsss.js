import React from "react"
import Card from "./Card"

class Cards extends React.Component {
    render() {
        return (
            <div className="container-fluid d-flex justify-content-center">
                <div className="row">
                    <div className="col-md-4">
                        <Card imagesrc={this.props.imageA}/>
                    </div>
                    <div className="col-md-4">
                        <Card imagesrc={this.props.imageB}/>
                    </div>
                    <div className="col-md-4">
                        <Card imagesrc={this.props.imageC}/>
                    </div>
                    <h1>Props: {this.props.imageA}</h1>

                </div>
            </div>
        )
    }
}

export default Cards