import React from 'react';

import {SERVER_URL} from '../static/config.js';

const axios = require('axios');

class ProjectForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alertHook: props.alert,
            name: "",
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
        }, config)
            .then((res) => {
                this.state.alertHook("Proiect creeat cu succes!", "success");
                this.props.history.push("/");
            }).catch((error) => {
                this.state.alertHook(error.response.data.error, "error");
            });
        
    }

    handleNameChange = (e) => {
        this.setState({name: e.target.value});
    }

    render() {
        return (
            <div className="form-container">
                <fieldset>
                    <legend>CREATE NEW PROJECT</legend>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input  type="text" id="name" name="name"
                                    value={this.state.name}
                                    onChange={this.handleNameChange}/>
                        </div>

                        <div className="form-group">
                            <input type="submit" value="Submit"/>
                        </div>
                    </form>
                </fieldset>
            </div>
        )
    }
}

export default ProjectForm;