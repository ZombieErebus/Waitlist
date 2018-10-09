import React, { Component } from 'react';
import classNames from 'classnames'; 

class SkillSets extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="statistic-block block">
                <table class="table table-striped table-hover table-sm table-responsive">
                    <thead class="thead-inverse|thead-default">
                        <tr>
                            <th>Plan Name</th>
                            <th>Ships</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td scope="row">Vindicator</td>
                                <td>icon 1</td>
                                <td><button className="btn btn-sm btn-info"><i className="fas fa-eye"></i></button></td>
                            </tr>
                        </tbody>
                </table>
            </div>
        )
    }
}

export default SkillSets;