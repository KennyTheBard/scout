import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

import ProjectItem from './ProjectItem.js';
import {SERVER_URL} from '../config/configuration.js';
import "../App.scss"

const axios = require('axios');

class ProjectList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
                console.log(error);
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
                
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map((d, idx) =>{
                            return (<ProjectItem component={this} key={d.id} data={d}/>)
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ProjectList