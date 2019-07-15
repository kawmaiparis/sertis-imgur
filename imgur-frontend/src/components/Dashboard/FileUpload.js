import React, { Fragment } from 'react'

const axios = require("axios");

class FileUpload extends React.Component {
    constructor() {
        super()
        this.state = {
            file: null,
            user: "user1",
        }
        this.onClick = this.onClick.bind(this)
        this.onChange = this.onChange.bind(this)
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

    onClick(e) {
        e.preventDefault()

        if (this.state.file == null) {
            console.log("file is null when uploading")
            return
        }
        fetch("http://localhost:5000/upload")
    }

    render() {
        return (
            <Fragment>
                <form>
                    <h3>FILE UPLOAD</h3>
                    <div className="custom-file mb-4">
                        <input type="file" accept="image/*" className="custom-file-input" id="customFile" onChange={this.onChange}/>
                        <label className="custom-file-label" htmlFor="customFile">{this.state.file == null ? "choose file" : this.state.file.name}</label>
                    </div>

                    <input type="submit" value="Upload" className="btn btn-primary btn-block mt04" onClick={this.onClick}/>
                    {/* <Spinner /> */}
                </form>

            </Fragment>
        )
    }
}

export default FileUpload