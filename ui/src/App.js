import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom"

import ProjectList from './project/ProjectList';
import ProjectForm from './project/ProjectForm';
import ProjectDetails from './project/ProjectDetails';

import "./App.scss";
import Login from './authentication/Login';
import Signin from './authentication/Signin';
import TaskDetails from './task/TaskDetails';
import Alert from './alert/Alert';

require('dotenv').config()

class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: !!localStorage.getItem("token"),
      alerts: []
    }

    this.addAlert = this.addAlert.bind(this);
  }

  addAlert(message, type) {
    let alerts = this.state.alerts.concat({message, type});
    this.setState({alerts: alerts});
    setTimeout(
        function() {
            let alerts = [...this.state.alerts];
            this.setState({alerts: alerts.slice(1)});
        }
        .bind(this),
        3000
    );
  }

  parseJwt = (token) => {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
  
  logOut = () => {
    localStorage.removeItem("token");
    this.setState({loggedIn: false});
  }

  logIn = () => {
    this.setState({loggedIn: true});
  }

  render() {
    
    let initialRedirect;
    if (!!localStorage.getItem("token")) {
      initialRedirect = (<Redirect to="/"/>);
    } else {
      initialRedirect = (<Redirect to="/login"/>);
    }
  
    return (
      <div className="page">
        <header>
          <h1 className="title">Scout</h1>
          <h1 className="user">
            {this.state.loggedIn && (
              <>
                <i className="fa fa-user-circle-o" aria-hidden="true"/>
                <span style={{padding: '10px'}}/>
                <div className="dropup">
                  <button className="dropbtn">{this.parseJwt(localStorage.getItem("token")).username}</button>
                  <div className="dropup-content">
                    <a onClick={this.logOut} href="#">Log out</a>
                  </div>
                </div> 
              </>
            )}
          </h1>
        </header>
        <div className="username">
          
        {this.state.alerts.map((d, i) => {
          return <Alert message={d.message} type={d.type}/>
        })}

        </div>
        <div className="content">
          <BrowserRouter basename="/">
              {initialRedirect}
  
              <Switch>
                  <Route exact path={"/"}>
                    <ProjectList alert={this.addAlert}/>
                  </Route>
                  <Route exact path={"/login"}>
                    <Login hook={this.logIn} alert={this.addAlert}/>
                  </Route>
                  <Route exact path={"/signin"}>
                    <Signin alert={this.addAlert}/>
                  </Route>
                  <Route exact path={"/projects/new"}>
                    <ProjectForm alert={this.addAlert}/>
                  </Route>
                  <Route exact path={"/projects/:projectId/"} render={(matchProps) =>
                    <ProjectDetails
                      {...matchProps}
                      alert={this.addAlert}/>
                    }
                  />
                  <Route exact path={"/tasks/:taskId"} render={(matchProps) =>
                    <TaskDetails
                      {...matchProps}
                      alert={this.addAlert}/>
                    }
                  />
              </Switch>
          </BrowserRouter>
        </div>
      </div>
    )
  }
}

export default App;
