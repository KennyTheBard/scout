import React from 'react';

import { parseJwt } from '../jwt/parseJwt';
import { SERVER_URL } from '../static/config.js';
import { STATUSES } from '../static/status.js';

const axios = require('axios');

class TaskDetails extends React.Component {

    constructor(props) {
        super(props);

        const params = this.props.match.params;

        this.state = {
            alertHook: props.alert,
            userPermissionsOnProject: null,
            userId: parseJwt(localStorage.getItem("token")).userId,
            projectId: params.projectId,
            taskId: params.taskId,
            task: null
        };
    }

    fetchTask() {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        
        axios.get(`${SERVER_URL}/${this.state.projectId}/tasks/${this.state.taskId}`, config)
        .then((res) => {
            this.setState({task: res.data[0]});
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
        });
    }

    deleteTask = (e) => {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };
        
        axios.delete(`${SERVER_URL}/${this.state.projectId}/tasks/${this.state.taskId}`, config)
        .then((res) => {
            this.state.alertHook("Taskul a fost sters cu succes!", "success");
            this.props.history.goBack();
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
        });
    }

    async componentDidMount() {  
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        this.fetchTask();

        axios.get(SERVER_URL + `/permissions/${this.state.userId}/${this.state.projectId}`, config)
        .then((res) => {
            this.setState({userPermissionsOnProject: res.data.map((d, i) => {
                return d.permission;
            })});
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
        });
    }

    onChangeDescription = (e) => {
        let task = {...this.state.task}
        task.description = e.target.value;
        this.setState({task})
    }

    onChangeStatus = (e) => {
        let task = {...this.state.task}
        task.status = e.target.value;
        this.setState({task})
    }

    onSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        const taskObject = {
            description: this.state.task.description,
            status: this.state.task.status
        };

        axios.put(`${SERVER_URL}/${this.state.projectId}/tasks/${this.state.taskId}`, taskObject, config)
            .then((res) => {
                this.state.alertHook("Taskul a fost actualizat cu succes!", "success");
                this.props.history.goBack();
            }).catch((error) => {
                this.state.alertHook(error.response.data.error, "error");
            });
    }

    render() {
        if (!this.state.task || !this.state.userPermissionsOnProject) {
            return <div>Loading...</div>
        }

        let cannotUpdate = this.state.userPermissionsOnProject.indexOf('UPDATE_TASK') === -1;
        let cannotDelete = this.state.userPermissionsOnProject.indexOf('DELETE_TASK') === -1;

        return (
            <div className="form-container">
                <fieldset>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Description</label>
                            <input  type="text" value={this.state.description}
                                    onChange={this.onChangeDescription}
                                    className="form-control"
                                    defaultValue={this.state.task.description}
                                    disabled={cannotUpdate}/>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select id="status" name="status"
                                onChange={this.onChangeStatus}
                                disabled={cannotUpdate}>
                                {STATUSES.map((d, idx) => {
                                    return (
                                        <option key={d} defaultValue={d}   
                                                selected={d === this.state.task.status}>
                                            {d}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="form-group buttons">
                            <button type="button" className="btn btn-cancel"
                                    onClick={() => {this.props.history.goBack();}}>
                                <i className="fa fa-arrow-left"/>
                            </button>
                            <button type="button" className="btn btn-delete"
                                    onClick={this.deleteTask}
                                    hidden={cannotDelete}>
                                <i className="fa fa-trash"/>
                            </button>
                            <input type="submit" value="Update" className="btn btn-submit" hidden={cannotUpdate}/>
                        </div>
                    </form>
                </fieldset>
            </div>
        )
    }
}

export default TaskDetails