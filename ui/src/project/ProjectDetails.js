import React from 'react';

import {SERVER_URL} from '../static/config.js';
import TaskItem from '../task/TaskItem.js';

import "../App.scss"
import UserSelect from '../user/UserSelect.js';
import { parseJwt } from '../jwt/parseJwt';
import { GRANTABLE_PERMISSIONS } from '../static/permission.js';
import { BOARD_STATUSES } from '../static/status.js';

const axios = require('axios');

class ProjectDetails extends React.Component {

    constructor(props) {
        super(props);

        const params = props.match.params;

        this.state = {
            alertHook: props.alert,
            currentPage: 0,
            userId: parseJwt(localStorage.getItem("token")).userId,
            projectId: params.projectId,
            userPermissionsOnProject: [],
            project: null,
            tasks: [],
            formTaskDescription: "",
            formTaskStatus: "TODO",
            settingsUser: null,
            settingsUserPermissions: [],
        };

        this.handleSettingsUserChange = this.handleSettingsUserChange.bind(this);
        this.togglePermission = this.togglePermission.bind(this);
    }

    componentDidMount() {  
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.get(SERVER_URL + `/permissions/${this.state.userId}/${this.state.projectId}`, config)
        .then((res) => {
            this.setState({userPermissionsOnProject: res.data.map((d, i) => {
                return d.permission;
            })});
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
        });

        axios.get(SERVER_URL + `/projects/${this.state.projectId}`, config)
        .then((res) => {
            this.setState({project: res.data});
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
        });

        this.fetchTasks();
    }

    fetchTasks() {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.get(SERVER_URL + `/${this.state.projectId}/tasks`, config)
        .then((res) => {
            this.setState({tasks: res.data});
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
            this.props.history.goBack();
        });
    } 

    getBoardBody() {
        let tasks = {}
        let height = 0
        for (let status of BOARD_STATUSES) {
            tasks[status] = this.state.tasks.filter((d, idx) => {
                return d.status === status;
            });

            height = Math.max(height, tasks[status].length);
        }

        let body = [];
        for (let i = 0; i < height; i++) {
            let line = [];
            for (let status of BOARD_STATUSES) {
                let d = tasks[status][i];
                line.push(<td>{!!d && <TaskItem key={d.id} data={d}/>}</td>)
            }

            body.push(<tr>{line}</tr>);
        }

        return body;
    }

    grantPermissions = (e) => {
        e.preventDefault();

        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.post(`${SERVER_URL}/permissions/${this.state.settingsUser}/${this.state.projectId}`, {
            permissions: this.state.settingsUserPermissions
        }, config)
            .then((res) => {
                this.state.alertHook("Permisiuni actualizate cu succes!", "success");
            }).catch((error) => {
                this.state.alertHook(error.response.data.error, "error");
            });
        
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.post(`${SERVER_URL}/${this.state.projectId}/tasks`, {
            description: this.state.formTaskDescription,
            status: this.state.formTaskStatus
        }, config)
            .then((res) => {
                this.state.alertHook("Un task nou a fost creeat cu succes!", "success");
                this.setState({currentPage: 0});
                this.fetchTasks();
            }).catch((error) => {
                this.state.alertHook(error.response.data.error, "error");
            });
        
    }

    handleDescriptionChange = (e) => {
        this.setState({formTaskDescription: e.target.value});
    }

    handleStatusChange = (e) => {
        this.setState({formTaskStatus: e.target.value});
    }

    handleSettingsUserChange(e) {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.get(SERVER_URL + `/permissions/${e.target.value}/${this.state.projectId}`, config)
        .then((res) => {
            this.setState({settingsUserPermissions: res.data.map((d, i) => {
                return d.permission;
            })});
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
        });

        this.setState({settingsUser: parseInt(e.target.value)});
    }

    togglePermission(e) {
        let perms = this.state.settingsUserPermissions;
        let currentPerm = e.target.value;

        if (perms.indexOf(currentPerm) > -1) {
            perms = perms.filter((d) => currentPerm !== d);
        } else {
            perms = perms.concat(currentPerm);
        }

        this.setState({settingsUserPermissions: perms});
    }

    render() {
        return (
            <>
                <h2>{!!this.state.project && this.state.project.name}</h2>

                <nav>
                    <ul>
                        <li>
                            <a  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({currentPage: 0});
                                }}
                                active={this.state.currentPage === 0}>
                                Board
                            </a>
                        </li>
                        <li>
                            <a  onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({currentPage: 1});
                                }}
                                active={this.state.currentPage === 1}>
                                Backlog
                            </a>
                        </li>
                        <li>
                            <a  onClick={(e) => {
                                    e.preventDefault();

                                    console.log(this.state.currentPage, 2, this.state.currentPage === 2)

                                    if (this.state.userPermissionsOnProject.indexOf('GRANT_PERMISSION') === -1) {
                                        this.state.alertHook('Nu aveti permisiunea de a acorda permisiuni!', 'error');
                                        return;
                                    }

                                    this.setState({currentPage: 2});
                                }}
                                active={this.state.currentPage === 2}>
                                Settings
                            </a>
                        </li>
                        <li>
                            <a  onClick={(e) => {
                                    e.preventDefault();

                                    if (this.state.userPermissionsOnProject.indexOf('CREATE_TASK') === -1) {
                                        this.state.alertHook('Nu aveti permisiunea de a adauga taskuri noi!', 'error');
                                        return;
                                    }

                                    this.setState({currentPage: 3});
                                }}
                                active={this.state.currentPage === 3}>
                                New task
                                <i className="fa fa-plus fa-lg"/>
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* board logic */}
                {this.state.currentPage === 0 &&
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    {BOARD_STATUSES.map((d, idx) => {
                                        return <th>{d}</th>
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {this.getBoardBody()}
                            </tbody>
                        </table>
                    </div>
                }

                {/* backlog logic */}
                {this.state.currentPage === 1 &&
                    <>
                        <h2>TODO</h2>
                        <div>
                            {this.state.tasks.filter((d, idx) => {
                                return d.status === "TODO";
                            }).map((d, idx) =>{
                                return (<TaskItem key={d.id} data={d}/>)
                            })}
                        </div>
                    </>
                }

                {/* settings logic */}
                {this.state.currentPage === 2 &&
                    <div className="form-container">
                        <fieldset>
                            <legend>
                                <label>User</label>
                                <UserSelect alert={this.state.alertHook} handleChange={this.handleSettingsUserChange}/>
                            </legend>
                            <form onSubmit={this.grantPermissions}>
                                {
                                    GRANTABLE_PERMISSIONS.map((d, i) => {
                                        return (
                                            <div className="form-group">
                                                <input  type="checkbox" id={d} value={d}
                                                        checked={this.state.settingsUserPermissions.indexOf(d) > -1}
                                                        onClick={this.togglePermission}
                                                        disabled={this.state.settingsUser === this.state.userId}/>
                                                <label>{d}</label>
                                            </div>
                                        )
                                    })
                                }
                                
                                <div className="form-group">
                                    <input  type="submit" value="Grant" className="btn btn-submit"
                                            disabled={this.state.settingsUser === this.state.userId}/>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                }

                {/* task form logic */}
                {this.state.currentPage === 3 &&
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
                                    <label>Status</label>
                                    <select id="status" name="status"
                                        onChange={this.handleStatusChange}>
                                        <option value="TODO">TODO</option>
                                        {BOARD_STATUSES.map((d, idx) => {
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
                }
            </>
        )
    }
}

export default ProjectDetails