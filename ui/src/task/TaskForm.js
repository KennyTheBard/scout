import React from 'react';

import {SERVER_URL} from '../config/configuration.js';

const axios = require('axios');

class TaskForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: props.projectId, 
            description: "",
            status: "",
            authors: {}
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.post(`${SERVER_URL}/${this.state.projectId}/tasks`, {
            description: this.state.description,
            code: this.state.code,
            status: this.state.status
        }, config)
            .then((res) => {
                // success notification
                this.props.history.push("/board");
            }).catch((error) => {
                console.log(error);
            });
        
    }

    handleDescriptionChange = (e) => {
        this.setState({description: e.target.value});
    }

    handleStatusChange = (e) => {
        this.setState({status: e.target.value});
    }

    handleCodeChange = (e) => {
        this.setState({code: e.target.value});
    }

    render() {
        return (
            <>
                <h2>CREATE NEW TASK</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>Description</label>
                    <input  type="text" id="description" name="description"
                            value={this.state.description}
                            onChange={this.handleDescriptionChange}/>
                    <br/>
                    
                    <label>Code</label>
                    <input  type="text" id="code" name="code"
                            value={this.state.code}
                            onChange={this.handleCodeChange}/>
                    <br/>

                    <label>Status</label>
                    <input  type="text" id="status" name="status"
                            value={this.state.status}
                            onChange={this.handleStatusChange}/>
                    <br/>
                    
                    <input type="submit" value="Submit"/>
                </form>
            </>
        )
    }
}

export default TaskForm