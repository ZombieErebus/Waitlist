import React, { Component } from 'react';
import classNames from 'classnames'; 
import ShowInfo from 'components/showInfo';
import Comms from 'components/comms';
import SetWaypoint from 'components/setWaypoint';

class FleetInfo extends Component {
    constructor(props) {
        super(props);
    }


    render(){
        return (
            <div>
                <div id="fleetInfoCards" class="col-md-12">
                    <div class="statistic-block block">
                        <div class="title"><strong>Fleet Info</strong></div>
                        <table class="table table-striped table-sm">
                            <tbody>
                                <tr>
                                    <td class="tw60per">Fleet Commander:</td>
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
            </div>
        );
    }
} 

export default FleetInfo;