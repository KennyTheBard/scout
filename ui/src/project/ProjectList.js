import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

import ProjectItem from './ProjectItem.js';
import {SERVER_URL} from '../static/config.js';
import "../App.scss"

const axios = require('axios');

class ProjectList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alertHook: props.alert,
            data: []
        };
    }

    componentDidMount() {
        this.fetchProjects();
    }

    fetchProjects() {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.get(SERVER_URL + '/projects', config)
            .then((res) => {
                this.setState({data: res.data});
            }).catch((error) => {
                this.state.alertHook(error.response.data.error, "error");
            });
        
    }

    addNewProject = (e) => {
        this.props.history.push("/projects/new");
    }

    render() {
        return (
            <div>
                <h2>PROJECTS</h2>

                <div className="btn-add">
                    <i onClick={this.addNewProject} className="fa fa-plus-square fa-2x"></i>
                </div>  
                
                <table className="projectList">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map((d, idx) =>{
                            return (<ProjectItem alert={this.state.alertHook} component={this} key={d.id} data={d}/>)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ProjectList