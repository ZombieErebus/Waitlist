import React, { Component } from 'react';
import classNames from 'classnames';

class TextBox extends Component {
    render() {
        let inputClass = classNames('form-control', this.props.cssClasses);

        return <input type="text" id={this.props.id} className={inputClass} value={this.props.value} placeholder={this.props.placeholder} onChange={this.props.changeFunction} />;
    }
}

export default TextBox;