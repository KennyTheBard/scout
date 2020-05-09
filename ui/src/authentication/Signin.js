import React from 'react';
import {SERVER_URL} from '../static/config.js';
import { Link } from "react-router-dom";

const axios = require('axios');

class Signin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: props.history,
            alertHook: props.alert,
            username: '',
            email: '',
            fullname: '',
            password: '',
            repassword: ''
        };
    }

    componentDidMount() {
        if (!!localStorage.getItem("token")) {
            this.state.history.push("/")
        }
    }

    onChangeUsername = (e) => {
        this.setState({ username: e.target.value })
    }

    onChangeEmail = (e) => {
        this.setState({ email: e.target.value })
    }

    onChangeFullname = (e) => {
        this.setState({ fullname: e.target.value })
    }

    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    onChangeRepassword = (e) => {
        this.setState({ repassword: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        if (this.state.password !== this.state.repassword) {
            this.state.alertHook('Parolele difera!', "error");
            return;
        }

        const userObject = {
            username: this.state.username,
            email: this.state.email,
            fullname: this.state.fullname,
            password: this.state.password,
            repassword: this.state.repassword
        };

        axios.post(SERVER_URL + '/users/register', userObject)
            .then((res) => {
                this.state.alertHook("Un link de activare va va fi trimis pe email in cel mai scurt timp.", "warning");
                this.props.history.push('/login');
            }).catch((error) => {
                this.state.alertHook(error.response.data.error, "error");
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
                        <label>Email</label>
                        <input type="text" value={this.state.email} onChange={this.onChangeEmail} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Fullname</label>
                        <input type="text" value={this.state.fullname} onChange={this.onChangeFullname} className="form-control" />
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