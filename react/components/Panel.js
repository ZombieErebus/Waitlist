import React, { Component } from 'react';

class Panel extends Component {
    colorClass(){
        return this.props.bgclass;
    }

    render() {

        let bgColor;
        let borderColor;
        let bgTextColor;
        if(!!this.colorClass()) {
            bgColor = ` bg-${this.colorClass()}`
            borderColor = ` border-${this.colorClass()}`
            bgTextColor = ` text-white`
        }

        return(
            <div className="card border-danger">
                <div className={"card-header " + bgColor + bgTextColor}>
                    <h5 className="mb-0">{this.props.title}</h5>
                </div>
                <div className={"card-body " + borderColor + " bg-dark"}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Panel;