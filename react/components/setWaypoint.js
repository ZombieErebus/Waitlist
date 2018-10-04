import React, { Component } from 'react';
import classNames from 'classnames'; 

class SetWaypoint extends Component {
    constructor(props) {
        super(props)
    }

    esiSetWapoint(){
        $.ajax({
            type: "POST",
            url: "/esi/ui/waypoint/" + this.props.system.systemID
        });
    }

    render(){
        return(
            <a href="javascript:void()" onClick={this.esiSetWapoint.bind(this)}>{this.props.system.name}</a>
        );
    }
}

export default SetWaypoint;