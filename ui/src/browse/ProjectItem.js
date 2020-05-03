import React from 'react';
import { useHistory } from "react-router-dom";

import {SERVER_URL} from '../config/configuration.js';

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
                window.location.reload();
            }).catch((error) => {
                console.log(error);
            });
    }

    return (
        <tr>
            <td>{props.data.name}</td>
            <td>{props.data.code}</td>
            <td>
                <div>
                    <i onClick={goToDetails} className="fa fa-info-circle"/>
                    <i onClick={deleteProject} className="fa fa-trash"/>
                </div>
            </td>
        </tr>
    )
}

export default ProjectItem