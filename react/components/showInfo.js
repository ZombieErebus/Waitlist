import React, { Component } from 'react';
import classNames from 'classnames'; 

class ShowInfo extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return(
            <a href="javascript:void()" onclick="showInfo('{this.props.entity.characterID}')">{this.props.entity.name}</a>
        );
    }
}

export default ShowInfo;