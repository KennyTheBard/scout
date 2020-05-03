import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom"

import Authentication from './authentication/Authentication';
import ProjectList from './browse/ProjectList';
import ProjectForm from './project/ProjectForm';
import ProjectDetails from './project/ProjectDetails';

import "./App.scss";

require('dotenv').config()

function App() {
  // let mainPage = !!localStorage.getItem("token") ? <Authentication/> : <ProjectList/>; 
  
  return (
    <div className="page">
      <div className="title">
        <h1>Scout</h1>
      </div>
      <div className="content">
        <BrowserRouter basename="/">
            {!!localStorage.getItem("token") && <Redirect to="/projects"/>}

            <Switch>
                <Route exact path={"/"} component={Authentication} />
                <Route exact path={"/projects"} component={ProjectList} />
                <Route exact path={"/projects/new"} component={ProjectForm} />
                <Route exact path={"/projects/:projectId/"} component={ProjectDetails} />
            </Switch>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App;
