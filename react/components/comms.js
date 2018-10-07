import React, { Component } from 'react';
import classNames from 'classnames'; 

class Comms extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return(
            <a href={this.props.comms.resource}>{this.props.comms.link}</a>
        );
    }
}

export default Comms;