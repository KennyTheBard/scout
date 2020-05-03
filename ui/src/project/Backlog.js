import React from 'react';
import TaskItem from './TaskItem.js';
import {SERVER_URL} from '../config/configuration.js';

const axios = require('axios');

class Backlog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            projectId: props.projectId,
            project: null,
            data: []
        };
    }

    async componentDidMount() {  
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        };

        axios.get(SERVER_URL + `/${this.state.projectId}/tasks`, config)
        .then((res) => {
            this.setState({data: res.data});
        }).catch((error) => {
            console.log(error);
        });
    }


    render() {
        return (
            <div>
                {this.state.data.filter((d, idx) => {
                    return d.status === "TODO";
                }).map((d, idx) =>{
                    return (<TaskItem key={d.id} data={d}/>)
                })}
            </div>

        )
    }
}

export default Backlog