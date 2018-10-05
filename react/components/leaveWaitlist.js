import React, { Component } from 'react';

class LeaveWaitlist extends Component {
    onClick() {
        let updateCall = this.props.onForceUpdate;

        $.ajax({
            type: "POST",
            url: "/remove/all/" + this.props.characterID
        }).done(function() {
            updateCall();
        }).fail(function(error) {
            console.log(error);
        });
    }

    render() {
        return <button className="btn btn-danger btn-block mt-3" onClick={this.onClick.bind(this)}><i class="fas fa-engine-warning"></i> Leave the Waitlist</button>;
    }
}

export default LeaveWaitlist;