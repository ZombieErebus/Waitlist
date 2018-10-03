import React, { Component } from 'react';
import classNames from 'classnames'; 

class SetWaypoint extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return(
            <a href="javascript:void()" onclick="setWaypoint({this.props.system.systemID})">{this.props.system.name}</a>
        );
    }
}

export default SetWaypoint;