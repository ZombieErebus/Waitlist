import React, { Component } from 'react';
import FleetGlanceTable from 'components/fleetGlanceTable';
import classNames from 'classnames';

const TabFilters = {
    fleet: {
        name: "Fleet"
    },
    logi: {
        name: "Logistics",
        ships:  [11987, 11989,22474,22442,37458,37460,37482,37480],//Guardian, Oneiros, Damnation, Eos, Kirin, Scalpel, Stork, Bifrost
    },
    caps: {
        name: "Capitals",
        ships: [23757,37604,23915,37605,23911,37607,24483,37606,42242,45645],//Archon, Apostle, Chimera, Minokawa, Thanatos, Ninazu, Nidhoggur, Lif, Dagon, Loggerhead
    },
    supers: {
        name: "Supers",
        ships: [23919,11567,23917,3764,23913,671,22852,23773,42241,3514,42125,42126,45649]//Aeon, Avatar, Wyvern, Leviathan, Nyx, Erebus, Hel, Ragnarok, Molok, Revenant, Vendetta, Vanquisher, Komodo
    }
}

const EmptyFilterResponse = [];

class FcFleetGlance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilter: TabFilters['fleet']
        };
    }

    getFilteredShips(filter) {
        // Do we have a filter at all or any ships?
        if(!filter || !filter.ships) {
            // If not, just return all ships
            return this.props.glance || EmptyFilterResponse;
        }

        if(!this.props.glance) {
            return EmptyFilterResponse;
        }

        return this.props.glance.filter((ship) => {
            let included = filter.ships.includes(ship.id);
            return included;
        });
    }

    selectTab(filter) {
        this.setState({selectedFilter: filter});
    }

    render() {
        let tabs = Object.keys(TabFilters).map((key, index) => {
            let filter = TabFilters[key];
            let classes = classNames('nav-link', 'comp', { 'active': this.state.selectedFilter == filter});
            let filteredShips = this.getFilteredShips(filter);
            let shipCount = 0;
            if(!!filteredShips) {
                shipCount = filteredShips.length;
            }

            return (
                <li className="nav-item" key={index}>
                    <a role="tab" data-toggle="pill" className={classes} onClick={this.selectTab.bind(this, filter)}>
                        <span className="badge badge-primary">{shipCount}</span> {filter.name}
                    </a>
                </li>
            );
        }, this);

        return(
            <div className="statistic-block block">
                <div>
                    <ul className="nav nav-pills nav-justified">
                        {tabs}
                    </ul>
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane active">
                            <FleetGlanceTable ships={this.getFilteredShips(this.state.selectedFilter)} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FcFleetGlance;