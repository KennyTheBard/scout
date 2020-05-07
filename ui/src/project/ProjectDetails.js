import React from 'react';

import {SERVER_URL} from '../config/configuration.js';
import TaskItem from '../task/TaskItem.js';

import "../App.scss"

const axios = require('axios');

class ProjectDetails extends React.Component {

    constructor(props) {
        super(props);

        const params = this.props.match.params;

        this.state = {
            pages: ['Board', 'Backlog', 'Settings', 'New task'],
            boardStatuses: ['SELECTED FOR DEVELOPMENT',
                'IN PROGRESS',
                'READY FOR CODE REVIEW',
                'READY FOR TESTING',
                'DONE'],
            currentPage: 0,
            projectId: params.projectId,
            project: null,
            tasks: [],
            formTaskDescription: "",
            formTaskStatus: "TODO"
        };
    }

    componentDidMount() {  
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.get(SERVER_URL + `/projects/${this.state.projectId}`, config)
        .then((res) => {
            this.setState({project: res.data});
        }).catch((error) => {
            console.log(error);
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
            console.log(error);
        });
    } 

    getBoardBody() {
        let tasks = {}
        let height = 0
        for (let status of this.state.boardStatuses) {
            tasks[status] = this.state.tasks.filter((d, idx) => {
                return d.status === status;
            });

            height = Math.max(height, tasks[status].length);
        }

        let body = [];
        for (let i = 0; i < height; i++) {
            let line = [];
            for (let status of this.state.boardStatuses) {
                let d = tasks[status][i];
                line.push(<td>{!!d && <TaskItem key={d.id} data={d}/>}</td>)
            }

            body.push(<tr>{line}</tr>);
        }

        return body;
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
                this.setState({currentPage: 0});
                this.fetchTasks();
            }).catch((error) => {
                console.log(error);
            });
        
    }

    handleDescriptionChange = (e) => {
        this.setState({formTaskDescription: e.target.value});
    }

    handleStatusChange = (e) => {
        console.log(e);
        this.setState({formTaskStatus: e.target.value});
    }

    render() {
        return (
            <>
                <h2>{!!this.state.project && this.state.project.name}</h2>

                <nav>
                    <ul>

                        {this.state.pages.map((d, i) => {
                            return (
                                <li>
                                    <a  onClick={(e) => {
                                            e.preventDefault();
                                            this.setState({currentPage: i});
                                        }}
                                        active={i === this.state.currentPage}>
                                        {d}
                                        {i + 1 === this.state.pages.length && <i className="fa fa-plus fa-lg"/>}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* board logic */}
                {this.state.currentPage === 0 &&
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    {this.state.boardStatuses.map((d, idx) => {
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
                    <div>
                        {this.state.tasks.filter((d, idx) => {
                            return d.status === "TODO";
                        }).map((d, idx) =>{
                            return (<TaskItem key={d.id} data={d}/>)
                        })}
                    </div>
                }

                {/* settings logic */}

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
                                        {this.state.boardStatuses.map((d, idx) => {
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