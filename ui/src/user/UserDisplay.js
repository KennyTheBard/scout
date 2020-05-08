import React from 'react';

class UserSelect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            logOut: props.logOut,
            user: props.user
        }
    }

    render() {
        return (
            <div className="user-container">
                <div className="user">
                    <div className="user username">
                        {this.state.user.fullname}
                    </div>
                    <div className="user email">
                        {this.state.user.email}
                    </div>
                </div>
                <div className="icon">
                    <i className="fa fa-user-circle-o" aria-hidden="true"/>
                </div>
                <a onClick={this.state.logOut} href="#">Log out</a>
            </div> 
        )
    } 
}

export default UserSelect