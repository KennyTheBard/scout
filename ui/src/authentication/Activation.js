import React from 'react';
import {SERVER_URL} from '../static/config.js';

const axios = require('axios');

class Activation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alertHook: props.alert,
            history: props.history,
            username: '',
            password: ''
        };
    }

    componentDidMount() {
        axios.put(`${SERVER_URL}/users/activate/${this.props.match.params.userId}/${this.props.match.params.code}`)
            .then(() => {
                this.state.alertHook("Contul a fost activat cu succes!", "success");
                this.state.history.push("/login");
            }).catch((error) => {
                if (!!error.response) {
                    this.state.alertHook(error.response.data.error, "error");
                } else {
                    this.state.alertHook(error, "error");
                }
            });
    }

    render() {
        return <p>Pagina de activare</p>
    }
}

export default Activation