import React, { Component } from 'react';
import classNames from 'classnames'

class Panel extends Component {
    backgroundColorClass(){
        return this.props.bgclass;
    }

    borderColorClass() {
        return this.props.borderclass;
    }

    render() {

        let titleClass = classNames("card-header", "text-white", this.backgroundColorClass(), this.borderColorClass());
        let cardClass = classNames("card-body", "text-white", "bg-dark", this.borderColorClass());

        return(
            <div className="card border-danger">
                <div className={titleClass}>
                    <h5 className="mb-0">{this.props.title}</h5>
                </div>
                <div className={cardClass}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Panel;