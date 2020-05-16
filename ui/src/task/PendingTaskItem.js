import React from 'react';
import { useHistory } from "react-router-dom";

import {SERVER_URL} from '../static/config.js';

const axios = require('axios');

function PendingTaskItem(props) {

    function acceptPendingTask(e) {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.put(`${SERVER_URL}/${props.data.project_id}/pending-tasks/accept/${props.data.id}`, {}, config)
            .then((res) => {
                props.alertHook("Taskul a fost aprobat cu succes!", "success");
                props.fetchTasksHook();
            }).catch((error) => {
                props.alertHook(error.response.data.error, "error");
            });
    }

    function denyPendingTask(e) {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        
        axios.delete(`${SERVER_URL}/${this.state.projectId}/pending-tasks/decline/${props.data.id}`, {
            description: this.state.formTaskDescription,
            status: this.state.formTaskStatus
        }, config)
            .then((res) => {
                this.state.alertHook("Taskul a fost refuzat cu succes!", "success");
                this.setState({currentPage: 0});
            }).catch((error) => {
                this.state.alertHook(error.response.data.error, "error");
            });
    }

    return (
        <div className="taskItem">
            <div className="wrapable">
                {props.data.description}
            </div>
            <div>
                {props.data.status}
            </div>
            <div>
                {props.data.author} ({props.data.author_email})
            </div>
            <div className="form-group buttons actions">
                <button type="button" className="btn btn-submit"
                        onClick={approvePendingTask}>
                    <i className="fa fa-check"/>
                </button>
                <button type="button" className="btn btn-delete"
                        onClick={denyPendingTask}>
                    <i className="fa fa-times"/>
                </button>
            </div>
        </div>
    )
}

export default PendingTaskItem