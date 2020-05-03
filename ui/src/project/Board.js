import React from 'react';
import TaskItem from './TaskItem.js';
import {SERVER_URL} from '../config/configuration.js';

const axios = require('axios');

class Board extends React.Component {

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
        let statuses = this.state.data.filter((d, idx) => {
            return d.status !== "TODO";
        }).map((d, idx) =>{
            return d.status;
        }).filter((val, idx, arr) => {
            return arr.indexOf(val) === idx;
        })

        let tasks = {}
        let height = 0
        for (let status of statuses) {
            tasks[status] = this.state.data.filter((d, idx) => {
                return d.status === status;
            });

            height = Math.max(height, tasks[status].length);
        }

        let body = [];
        for (let i = 0; i < height; i++) {
            let line = [];
            for (let status of statuses) {
                let d = tasks[status][i];
                line.push(<td>{!!d && <TaskItem key={d.id} data={d}/>}</td>)
            }

            body.push(<tr>{line}</tr>);
        }

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            {statuses.map((d, idx) => {
                                return <th><strong>{d}</strong></th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {body}
                    </tbody>
                </table>
            </div>

        )
    }
}

export default Board
