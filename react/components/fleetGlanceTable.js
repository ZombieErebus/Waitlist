import React, { Component } from 'react';
import NoFleetIndicator from 'components/noFleetIndicator';
import FleetGlanceRow from 'components/fleetGlanceRow';

const ShipsPerRow = 3;

class FleetGlanceTable extends Component {
    render() {
        if(!this.props.ships || this.props.ships.length == 0) {
            return <NoFleetIndicator />;
        }

        let splicedShips = this.props.ships.reduce((acc, ship, index) => {
            let row = Math.ceil((index + 1) / ShipsPerRow) - 1;
            
            // Should we create a row?
            if(acc.length <= row) {
                acc[row] = [];
            }

            acc[row].push(ship);

            return acc;
        }, []);

        let rows = splicedShips.map((ships, index) => {
            return <FleetGlanceRow key={index} ships={ships} />;
        });

        return(
            <table className="table table-striped table-sm">
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}

export default FleetGlanceTable;