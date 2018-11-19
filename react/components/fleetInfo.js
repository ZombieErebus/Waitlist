import React, { Component } from 'react';
import ShowInfo from 'components/showInfo';
import Comms from 'components/comms';
import SetWaypoint from 'components/setWaypoint';

class FleetInfo extends Component {
    constructor(props) {
        super(props);
    }


    render(){
        return (
            <div classMame="col-lg-6 col-md-12">
                <div className="statistic-block block">
                    <div className="title"><strong>Fleet Info</strong></div>
                    <table className="table table-striped table-sm">
                        <tbody>
                            <tr>
                                <td className="tw60per">Fleet Commander:</td>
                                <td><ShowInfo entity={this.props.fleet.fc}/></td>
                            </tr>
                            <tr>
                                <td>Secondary Fleet Commander:</td>
                                <td><ShowInfo entity={this.props.fleet.backseat}/></td>
                            </tr>
                            <tr>
                                <td>Fleet Type:</td>
                                <td>{this.props.fleet.type}</td>
                            </tr>
                            <tr>
                                <td>Fleet Status:</td>
                                <td>{this.props.fleet.status}</td>
                            </tr>
                            <tr>
                                <td>Fleet Size:</td>
                                <td>{this.props.fleet.size}</td>
                            </tr>
                            <tr>
                                <td>Fleet Location:</td>
                                <td><SetWaypoint system={this.props.fleet.location} /></td>
                            </tr>
                            <tr>
                                <td>Fleet Comms:</td>
                                <td><Comms comms={this.props.fleet.comms} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
} 

export default FleetInfo;