import React, { Component } from 'react';
import classNames from 'classnames'; 

class SkillSettings extends Component {
    constructor(props) {
        super(props)
    }

    getSetName() {
        if(!!this.props.set) {
            return this.props.set.name;
        }
    }

    render() {
        return(
            <div className="statistic-block block">
                <h1>{this.getSetName()}</h1>
            </div>
        )
    }
}

export default SkillSettings;