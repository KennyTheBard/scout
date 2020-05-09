import React from 'react';

import {SERVER_URL} from '../static/config.js';
import TaskItem from '../task/TaskItem.js';

import "../App.scss"
import UserSelect from '../user/UserSelect.js';
import { parseJwt } from '../jwt/parseJwt';
import { GRANTABLE_PERMISSIONS } from '../static/permission.js';
import { BOARD_STATUSES } from '../static/status.js';
import PendingTaskItem from '../task/PendingTaskItem.js';

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
            pendingTasks: [],
            formTaskDescription: "",
            formTaskStatus: "TODO",
            settingsUser: null,
            settingsUserPermissions: [],
        };

        this.handleSettingsUserChange = this.handleSettingsUserChange.bind(this);
        this.togglePermission = this.togglePermission.bind(this);
        this.fetchTasks =  this.fetchTasks.bind(this);
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

            this.fetchTasks();
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
            this.props.history.goBack();
        });
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
        });

        axios.get(SERVER_URL + `/${this.state.projectId}/pending-tasks`, config)
        .then((res) => {
            this.setState({pendingTasks: res.data});
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
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
                line.push(<td key={`${status}-${i}`}>
                        {!!d && <TaskItem data={d}
                                userPermissionsOnProject={this.state.userPermissionsOnProject}/>}
                    </td>)
            }

            body.push(<tr key={i}>{line}</tr>);
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

        if (this.state.userPermissionsOnProject.indexOf('CREATE_TASK') > -1) {
            axios.post(`${SERVER_URL}/${this.state.projectId}/tasks`, {
                description: this.state.formTaskDescription,
                status: this.state.formTaskStatus
            }, config)
                .then((res) => {
                    this.state.alertHook("Un task nou a fost creeat cu succes!", "success");
                    this.setState({formTaskDescription: ""});
                    this.setState({formTaskStatus: "TODO"});
                    this.setState({currentPage: 0});
                    this.fetchTasks();
                }).catch((error) => {
                    this.state.alertHook(error.response.data.error, "error");
                });
        } else {
            axios.post(`${SERVER_URL}/${this.state.projectId}/pending-tasks`, {
                description: this.state.formTaskDescription,
                status: this.state.formTaskStatus
            }, config)
                .then((res) => {
                    this.state.alertHook("Un nou task a fost transmis spre a fi evaluat!", "success");
                    this.setState({formTaskDescription: ""})
                    this.setState({formTaskStatus: "TODO"})
                    this.setState({currentPage: 0});
                }).catch((error) => {
                    this.state.alertHook(error.response.data.error, "error");
                });
        }
    
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
                                className={this.state.currentPage === 0 ? 'active' : ''}>
                                Board
                            </a>
                        </li>
                        <li>
                            <a  onClick={(e) => {
                                    e.preventDefault();

                                    this.setState({currentPage: 1});
                                }}
                                className={this.state.currentPage === 1 ? 'active' : ''}>
                                Backlog
                            </a>
                        </li>
                        <li hidden={this.state.userPermissionsOnProject.indexOf('GRANT_PERMISSION') === -1 ? 1 : 0}>
                            <a  onClick={(e) => {
                                    e.preventDefault();

                                    this.setState({currentPage: 2});
                                }}
                                className={this.state.currentPage === 2 ? 'active' : ''}>
                                Settings
                            </a>
                        </li>
                        <li style={{position: 'relative'}}
                            hidden={this.state.userPermissionsOnProject.indexOf('CREATE_TASK') === -1 ? 1 : 0}>
                            <a  onClick={(e) => {
                                    e.preventDefault();

                                    this.setState({currentPage: 3});
                                }}
                                className={this.state.currentPage === 3 ? 'active' : ''}>
                                Pending
                            </a>
                            <div hidden={this.state.pendingTasks.length === 0 ? 1 : 0}
                                className="pendingTaskNumber">
                                {this.state.pendingTasks.length}
                            </div>
                        </li>
                        <li>
                            <a  onClick={(e) => {
                                    e.preventDefault();

                                    this.setState({currentPage: 4});
                                }}
                                className={this.state.currentPage === 4 ? 'active' : ''}>
                                New task
                                <i className="fa fa-plus fa-lg"/>
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* board logic */}
                {this.state.currentPage === 0 &&
                    <div>
                        <table className="board">
                            <thead>
                                <tr>
                                    {BOARD_STATUSES.map((d, idx) => {
                                        return <th key={d}>{d}</th>
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
                                return (<TaskItem key={d.id} data={d}
                                        userPermissionsOnProject={this.state.userPermissionsOnProject}/>)
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

                {/* pending logic */}
                {this.state.currentPage === 3 &&
                    <>
                        <h2>Pending</h2>
                        <div>
                            {this.state.pendingTasks.map((d, idx) =>{
                                return (
                                    <PendingTaskItem    key={d.id} data={d}
                                                        alertHook={this.state.alertHook}
                                                        fetchTasksHook={this.fetchTasks}/>)
                            })}
                        </div>
                        <div hidden={this.state.pendingTasks.length > 0}>
                            No pending tasks right now
                        </div>
                    </>
                }

                {/* new task form logic */}
                {this.state.currentPage === 4 &&
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

                                <div className="form-info"
                                    hidden={this.state.userPermissionsOnProject.indexOf('CREATE_TASK') > -1 ? 1 : 0}>
                                    <p>*Deoarece nu aveti permisiunea de a adauga taskuri noi,<br/>acest task va necesita comfirmarea cuiva cu aceasta permisiune</p>
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