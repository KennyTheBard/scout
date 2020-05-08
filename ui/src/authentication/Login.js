import React from 'react';
import {SERVER_URL} from '../static/config.js';
import { Link } from "react-router-dom";

const axios = require('axios');

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            LoginHook: props.hook,
            alertHook: props.alert,
            username: '',
            password: ''
        };
    }

    onChangeUsername = (e) => {
        this.setState({ username: e.target.value })
    }

    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const userObject = {
            username: this.state.username,
            password: this.state.password
        };

        axios.post(SERVER_URL + '/users/login', userObject)
            .then((res) => {
                this.state.alertHook("V-ati autentificat cu succes!", "success");
                localStorage.setItem("token", res.data);
                this.state.LoginHook();
            }).catch((error) => {
                this.state.alertHook(error.response.data.error, "error");
            });
    }

    render() {
        return (
        <div className="form-container">
            <fieldset>
                <legend>Log in</legend>

                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={this.state.username} onChange={this.onChangeUsername} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={this.state.password} onChange={this.onChangePassword} className="form-control" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-submit" />
                    </div>
                </form>
                <Link to="/signin">No account?</Link>
            </fieldset>
        </div>)
    }
}

export default Login