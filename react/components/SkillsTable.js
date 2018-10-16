import React, { Component } from 'react';

class SkillsTable extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="table-responsive">
                <table className="table table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Skill</th>
                            <th>Required</th>
                            <th>Recommended</th>
                            <th>Failable?</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><i className="fas fa-check-circle text-success"></i></td>
                            <td><a href="#">Gallente Battleship</a></td>
                            <td>3</td>
                            <td>5</td>
                            <td></td>
                            <td><button className="btn btn-sm btn-info"><i className="fas fa-edit"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default SkillsTable;