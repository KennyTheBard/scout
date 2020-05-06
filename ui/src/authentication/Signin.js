import React from 'react';
import {SERVER_URL} from '../config/configuration.js';
import { Link } from "react-router-dom";

const axios = require('axios');

class Signin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: props.history,
            username: '',
            password: '',
            repassword: ''
        };
    }

    onChangeUsername = (e) => {
        this.setState({ username: e.target.value })
    }

    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    onChangeRepassword = (e) => {
        this.setState({ repassword: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const userObject = {
            username: this.state.username,
            password: this.state.password,
            repassword: this.state.repassword
        };

        axios.post(SERVER_URL + '/users/register', userObject)
            .then((res) => {
                this.props.history.push('/login');
            }).catch((error) => {
                console.log(error);
            });

        this.setState({
            username: '',
            password: '',
            repassword: ''
        });
    }

    render() {
        return (
        <div className="form-container">
            <fieldset>
                <legend>Sign in</legend>

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
                        <label>Retype Password</label>
                        <input type="password" value={this.state.repassword} onChange={this.onChangeRepassword} className="form-control" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Sign in" className="btn btn-submit" />
                    </div>
                </form>
                <Link to="/login">Already have an account?</Link>
            </fieldset>
        </div>)
    }
}

export default Signin