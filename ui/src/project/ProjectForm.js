import React from 'react';

import {SERVER_URL} from '../config/configuration.js';

const axios = require('axios');

class ProjectForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            authors: {}
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.post(SERVER_URL + '/projects', {
            name: this.state.name,
            code: this.state.code
        }, config)
            .then((res) => {
                // success notification
                this.props.history.push("/projects");
            }).catch((error) => {
                console.log(error);
            });
        
    }

    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    }

    handleCodeChange = (e) => {
        this.setState({code: e.target.value});
    }

    render() {
        return (
            <>
                <h2>CREATE NEW PROJECT</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>Name</label>
                    <input  type="text" id="name" name="name"
                            value={this.state.name}
                            onChange={this.handleNameChange}/>
                    <br/>
                    
                    <label>Code</label>
                    <input  type="text" id="code" name="code"
                            value={this.state.code}
                            onChange={this.handleCodeChange}/>
                    <br/>
                    
                    <input type="submit" value="Submit"/>
                </form>
            </>
        )
    }
}

export default ProjectForm;