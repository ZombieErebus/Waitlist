import React, { Component } from 'react';
import FleetGlanceTable from 'components/fleetGlanceTable';

class FcFleetGlance extends Component {
    render() {
        return(
            <div className="statistic-block block">
                <div>
                    <ul className="nav nav-pills nav-justified">
                        <li className="nav-item"><a role="tab" data-toggle="pill" id="fleet" href="javascript:void();" className="nav-link comp active">Fleet</a></li>
                        <li className="nav-item"><a role="tab" data-toggle="pill" id="logi" href="javascript:void();" className="nav-link comp">Logistics</a></li>
                        <li className="nav-item"><a role="tab" data-toggle="pill" id="caps" href="javascript:void();" className="nav-link comp">Capitals</a></li>
                        <li className="nav-item"><a role="tab" data-toggle="pill" id="supers" href="javascript:void();" className="nav-link comp">Supers</a></li>
                    </ul>
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane active">
                            <FleetGlanceTable ships={this.props.glance} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FcFleetGlance;