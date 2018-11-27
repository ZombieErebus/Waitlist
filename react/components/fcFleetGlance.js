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

class FcFleetGlance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFilter: TabFilters['fleet']
        };
    }

    getFilteredShips() {
        // Do we have a filter at all or any ships?
        if(!this.state.selectedFilter || !this.state.selectedFilter.ships) {
            // If not, just return all ships
            return this.props.glance;
        }

        return this.props.glance.filter((ship) => {
            let included = this.state.selectedFilter.ships.includes(ship.id);
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

            return <li className="nav-item" key={index}><a role="tab" data-toggle="pill" className={classes} onClick={this.selectTab.bind(this, filter)}>{filter.name}</a></li>;
        }, this);

        return(
            <div className="statistic-block block">
                <div>
                    <ul className="nav nav-pills nav-justified">
                        {tabs}
                    </ul>
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane active">
                            <FleetGlanceTable ships={this.getFilteredShips()} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FcFleetGlance;