import React from 'react';
import { useHistory } from "react-router-dom";

function TaskItem(props) {
    const history = useHistory();

    function handleClick() {
        history.push(`${props.data.project_id}/tasks/${props.data.id}`);
    }

    return (
        <div onClick={handleClick}>
            {props.data.description}
        </div>
    )
}

export default TaskItem