import React from 'react';
import { Link, Switch, Route, Redirect, BrowserRouter } from "react-router-dom"

import {SERVER_URL} from '../config/configuration.js';
import Backlog from './Backlog.js';
import Board from './Board.js';
import Settings from './Settings.js';
import TaskDetails from '../task/TaskDetails.js';
import TaskForm from '../task/TaskForm.js';

import "../App.scss"

const axios = require('axios');

class ProjectDetails extends React.Component {

    constructor(props) {
        super(props);

        const params = this.props.match.params;

        this.state = {
            projectId: params.projectId,
            project: null,
            data: []
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
    }

    render() {
        return (
            <>
                <h2>{!!this.state.project && this.state.project.name}</h2>

                <BrowserRouter basename={"/projects/" + this.state.projectId}>
                    <div className="tab">
                        <Link to="/backlog">
                            <strong>
                                Backlog
                            </strong>
                        </Link>
                        <Link to="/board">
                            <strong>
                                Board
                            </strong>
                        </Link> 
                        <Link to="/settings">
                            <strong>
                                Settings
                            </strong>
                        </Link>
                        <Link to={"/add-task"}>
                            <div className="btn-add btn-link">
                                <i className="fa fa-plus-square fa-lg"></i>
                            </div>  
                            <strong>
                                New
                            </strong>
                        </Link>
                    </div>
                
                    <Redirect to="/board"/>

                    

                    <Switch>
                        <Route exact path={"/backlog"}>
                            <Backlog projectId={this.state.projectId}/>
                        </Route>
                        <Route exact path={"/board"}>
                            <Board projectId={this.state.projectId}/>
                        </Route>
                        <Route exact path={"/settings"}>
                            <Board projectId={this.state.projectId}/>
                        </Route>
                        <Route exact path={"/tasks/:taskId"} render={
                            (props) => <TaskDetails projectId={this.state.projectId} {...props}/>
                        }/>
                        <Route exact path={"/add-task"} render={
                            (props) => <TaskForm projectId={this.state.projectId} {...props}/>
                        }/>
                    </Switch>
                </BrowserRouter>
            </>
        )
    }
}

export default ProjectDetails