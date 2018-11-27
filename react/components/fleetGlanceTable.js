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
                    {/* <tr>
                        <td className="tw35"><img src="https://image.eveonline.com/Render/11989_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Oneiros</a></td>
                        <td>7</td><td className="tw35"><img src="https://image.eveonline.com/Render/641_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Megathron</a></td>
                        <td>6</td><td className="tw35"><img src="https://image.eveonline.com/Render/23911_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Thanatos</a></td>
                        <td>4</td>
                    </tr>
                    <tr>
                        <td className="tw35"><img src="https://image.eveonline.com/Render/23757_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Archon</a></td>
                        <td>3</td><td className="tw35"><img src="https://image.eveonline.com/Render/625_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Augoror</a></td>
                        <td>3</td><td className="tw35"><img src="https://image.eveonline.com/Render/24483_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Nidhoggur</a></td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td className="tw35"><img src="https://image.eveonline.com/Render/37604_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Apostle</a></td>
                        <td>2</td><td className="tw35"><img src="https://image.eveonline.com/Render/22474_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Damnation</a></td>
                        <td>2</td><td className="tw35"><img src="https://image.eveonline.com/Render/17738_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Machariel</a></td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td className="tw35"><img src="https://image.eveonline.com/Render/11963_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Rapier</a></td>
                        <td>2</td><td className="tw35"><img src="https://image.eveonline.com/Render/23919_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Aeon</a></td>
                        <td>1</td><td className="tw35"><img src="https://image.eveonline.com/Render/23915_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Chimera</a></td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td className="tw35"><img src="https://image.eveonline.com/Render/22442_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Eos</a></td>
                        <td>1</td><td className="tw35"><img src="https://image.eveonline.com/Render/624_32.png" alt="Ship Icon"/></td>
                        <td className="tw20per"><a href="#">Maller</a></td>
                        <td>1</td>
                    </tr> */}
                </tbody>
            </table>
        );
    }
}

export default FleetGlanceTable;