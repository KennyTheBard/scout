import React from 'react';
import { useHistory } from "react-router-dom";

function ProjectItem(props) {
    
    const history = useHistory();

    function goToDetails() {
        history.push("/projects/" + props.data.id);
    }

    return (
        <tr>
            <td>{props.data.name}</td>
            <td>{props.data.code}</td>
            <td>
                <i onClick={goToDetails} className="fa fa-info-circle"/>
            </td>
        </tr>
    )
}

export default ProjectItem