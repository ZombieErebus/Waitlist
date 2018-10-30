import React, { Component } from 'react';
import classNames from 'classnames';

class NumberBox extends Component {
    render() {
        let inputClass = classNames('form-control', this.props.cssClasses);

        return <input type="number" id={this.props.id} className={inputClass} value={this.props.value} min={this.props.min} max={this.props.max} placeholder={this.props.placeholder} onChange={this.props.changeFunction} />;
    }
}

export default NumberBox;