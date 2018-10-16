import React, { Component } from 'react';
import OpenMarket from 'components/OpenMarket';


class Skills extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <tr>
                <td>{/* <i className="fas fa-check-circle text-success"></i> */}</td>
                <td><OpenMarket item={this.props.skill} /></td>
                <td>{this.props.skill.required}</td>
                <td>{this.props.skill.recommended}</td>
                <td><button className="btn btn-sm btn-primary"><i className="fas fa-edit"></i></button></td>
            </tr>
        )
    }
}

export default Skills;