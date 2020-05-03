import React from 'react';
import { Switch, Route, Link, Redirect, BrowserRouter } from "react-router-dom"
import Login from './Login';
import Signin from './Signin';

class Authentication extends React.Component {
    render() {
        return (
            <BrowserRouter basename="/">
                <Link to="/login">Log In</Link> 
                <Link to="/signin">Sign</Link>
                <Redirect to="/login"/>

                <Switch>
                    <Route exact path={"/login"} component={Login} />
                    <Route exact path={"/signin"} component={Signin} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Authentication