import React from 'react';

import {SERVER_URL} from '../config/configuration.js';

const axios = require('axios');

class UserSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            alertHook: props.alert,
            users: []
        }
    }

    componentDidMount() {
        axios.get(SERVER_URL + `/users/all`)
        .then((res) => {
            this.setState({users: res.data});
        }).catch((error) => {
            this.state.alertHook(error.response.data.error, "error");
        });
    }

    render() {
        return (
            <select id="user" name="user"
                onChange={this.props.handleChange}>
                {this.state.users.map((d, idx) => {
                    return <option value={d.id}>{d.full_name} ({d.usernam})</option>
                })}
            </select>
        )
    } 
}

export default UserSelect