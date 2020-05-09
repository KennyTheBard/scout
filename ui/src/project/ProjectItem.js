import React from 'react';
import { useHistory } from "react-router-dom";

import {SERVER_URL} from '../static/config.js';

const axios = require('axios');

function ProjectItem(props) {
    
    const history = useHistory();

    function goToDetails() {
        history.push("/projects/" + props.data.id);
    }

    function deleteProject() {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.delete(`${SERVER_URL}/projects/${props.data.id}`, config)
            .then((res) => {
                props.component.fetchProjects();
            }).catch((error) => {
                props.alert(error.response.data.error, "error");
            });
    }

    return (
        <tr>
            <td>
                <div className="projectName">
                    {props.data.name}
                </div>
            </td>
            <td>
                <div className="form-group buttons actions">
                    <button type="button" className="btn btn-details"
                            onClick={goToDetails}>
                        <i className="fa fa-info-circle"/>
                    </button>
                    <button type="button" className="btn btn-delete"
                            onClick={deleteProject}>
                        <i className="fa fa-trash"/>
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default ProjectItem