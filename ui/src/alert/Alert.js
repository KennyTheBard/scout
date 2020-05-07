import React from 'react';

function Alert(props) {
    let classes = `alert ${props.type}`;

    return (
        <div className={classes}>
            <p>{props.message}</p>
        </div>
    )
}

export default Alert