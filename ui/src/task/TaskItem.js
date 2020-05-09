import React from 'react';
import { useHistory } from "react-router-dom";

function TaskItem(props) {
    const history = useHistory();
    const userPermissionsOnProject = props.userPermissionsOnProject;

    function handleClick() {
        if (userPermissionsOnProject.indexOf('VIEW_TASK') === -1) {
            return;
        }
        
        history.push(`${props.data.project_id}/tasks/${props.data.id}`);
    }

    return (
        <div onClick={handleClick} className="taskItem hoverable">
            {props.data.description}
        </div>
    )
}

export default TaskItem