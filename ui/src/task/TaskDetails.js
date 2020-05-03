import React from 'react';

import {SERVER_URL} from '../config/configuration.js';

const axios = require('axios');

class TaskDetails extends React.Component {

    constructor(props) {
        super(props);

        const params = this.props.match.params;

        this.state = {
            projectId: this.props.projectId,
            taskId: params.taskId,
            task: null
        };
    }

    async componentDidMount() {  
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.get(`${SERVER_URL}/${this.state.projectId}/tasks/${this.state.taskId}`, config)
        .then((res) => {
            this.setState({task: res.data[0]});
        }).catch((error) => {
            console.log(error);
        });

    }

    render() {
        if (!this.state.task) {
            return <div>Loading...</div>
        }

        return (
            <div>
                <h3>{this.state.task.description}</h3>
                <h3>{this.state.task.status}</h3>
            </div>
        )
    }
}

export default TaskDetails