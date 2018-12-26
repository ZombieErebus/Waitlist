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

        let systemName;
        if(this.props.system && this.props.system.name)
            systemName = this.props.system.name;

        return(
            <a href="javascript:void()" onClick={this.esiSetWapoint.bind(this)}>{systemName}</a>
        );
    }
}

export default SetWaypoint;