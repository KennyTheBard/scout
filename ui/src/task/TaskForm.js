import React from 'react';

import {SERVER_URL} from '../config/configuration.js';

const axios = require('axios');

class TaskForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: props.projectId, 
            description: "",
            status: "TODO"
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

    handleCodeChange = (e) => {
        this.setState({code: e.target.value});
    }

    handleStatusChange = (e) => {
        console.log(e);
        this.setState({status: e.target.value});
    }

    render() {
        const statuses = ['TODO',
        'SELECTED FOR DEVELOPMENT',
        'IN PROGRESS',
        'READY FOR CODE REVIEW',
        'READY FOR TESTING',
        'DONE'];

        return (
            <div className="form-container">
                <fieldset>
                    <legend>CREATE NEW TASK</legend>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>Description</label>
                            <input  type="text" id="description" name="description"
                                    value={this.state.description}
                                    onChange={this.handleDescriptionChange}/>
                        </div>
                        
                        <div className="form-group">
                            <label>Code</label>
                            <input  type="text" id="code" name="code"
                                    value={this.state.code}
                                    onChange={this.handleCodeChange}/>
                        </div>
                      
                        <div className="form-group">
                            <label>Status</label>
                            <select id="status" name="status"
                                onChange={this.handleStatusChange}>
                                {statuses.map((d, idx) => {
                                    return <option value={d}>{d}</option>
                                })}
                            </select>
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

export default TaskForm