import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom"
import Cookies from 'universal-cookie';
import { confirmAlert } from 'react-confirm-alert';

import ProjectList from './project/ProjectList';
import ProjectForm from './project/ProjectForm';
import ProjectDetails from './project/ProjectDetails';

import "./App.scss";
import Login from './authentication/Login';
import Signin from './authentication/Signin';
import TaskDetails from './task/TaskDetails';
import Alert from './alert/Alert';
import UserDisplay from './user/UserDisplay';
import { parseJwt } from './jwt/parseJwt';

import { SERVER_URL } from './static/config.js';
import Activation from './authentication/Activation';

const axios = require('axios');

require('dotenv').config()

const cookies = new Cookies();

class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: !!localStorage.getItem("token"),
      alerts: []
    }

    this.addAlert = this.addAlert.bind(this);
  }

  componentDidMount() {
    if (!cookies.get('ChocolateCookie')) {
      confirmAlert({
        title: "Cookie policy",
        message: "Buna ziua! Acest website foloseste cookie-uri (nu, nu foloseste) pentru a imbunatatii experienta dumneavoastra. Acceptati, in conformitate cu GDPR, acest fapt?",
        buttons: [
          {
            label: 'Da, sunt de acord',
            onClick: () => cookies.set('ChocolateCookie', 'qwerty1234567890')
          },
          {
            label: 'Nu, scoate-ma de aici',
            onClick: () => window.location.replace("http://www.google.com")
          }
        ],
      })
      // if (window.confirm("Buna ziua! Acest website foloseste cookie-uri (nu, nu foloseste) pentru a imbunatatii experienta dumneavoastra. Acceptati, in conformitate cu GDPR, acest fapt?")) {
      //   cookies.set('ChocolateCookie', 'qwerty1234567890');
      // } else {
      //   this.state.history.goBack();
      // }
    }
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
          <div className="header-content">
            <div className="header-title">Scout</div>
            <div className="header-user">
              {this.state.loggedIn &&
                <UserDisplay logOut={this.logOut} user={parseJwt(localStorage.getItem("token"))}/>
              }
            </div>
          </div>
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
                  <Route exact path={"/"} render={(matchProps) =>
                    <ProjectList
                      {...matchProps}
                      alert={this.addAlert}/>
                    }
                  />
                  <Route exact path={"/login"} render={(matchProps) =>
                    <Login
                      {...matchProps}
                      logIn={this.logIn}
                      alert={this.addAlert}/>
                    }
                  />
                  <Route exact path={"/signin"} render={(matchProps) =>
                    <Signin
                      {...matchProps}
                      alert={this.addAlert}/>
                    }
                  />
                  <Route exact path={"/projects/new"} render={(matchProps) =>
                    <ProjectForm
                      {...matchProps}
                      alert={this.addAlert}/>
                    }
                  />
                  <Route exact path={"/projects/:projectId/"} render={(matchProps) =>
                    <ProjectDetails
                      {...matchProps}
                      alert={this.addAlert}/>
                    }
                  />
                  <Route exact path={"/projects/:projectId/tasks/:taskId"} render={(matchProps) =>
                    <TaskDetails
                      {...matchProps}
                      alert={this.addAlert}/>
                    }
                  />
                  <Route exact path={"/activate/:userId/:code"} render={(matchProps) =>
                    <Activation
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
