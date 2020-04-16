import React from 'react';

class ProjectList extends React.Component {

    componentDidMount() {
        this.loading = true;
        fetch("https://localhost:8080")

    }

    render() {

    }

}

exports default ProjectList