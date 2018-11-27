import React, { Component } from 'react';

class FleetGlanceRow extends Component {
    render() {
        let entries = this.props.ships.map((ship, index) => {
            return(
                <React.Fragment key={index}>
                    <td className="tw35"><img src={`https://image.eveonline.com/Render/${ship.id}_32.png`} alt="Ship Icon" /></td>
                    <td className="tw20per">
                        <a href="#" data-toggle="tooltip" data-html="true" title={ship.pilots.join("<br/>")}>{ship.name}</a>
                    </td>
                    <td>{ship.pilots.length}</td>
                </React.Fragment>
            );
        });

        return(
            <tr>
                {entries}
            </tr>
        );
    }
}

export default FleetGlanceRow;