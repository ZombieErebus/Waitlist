import React, { Component } from 'react';
import ShowInfo from 'components/showInfo';
import Comms from 'components/comms';
import SetWaypoint from 'components/setWaypoint';
import {fleet} from '../../setup';

class FcFleetInfo extends Component {
    
    updateFC(){
        $.ajax({
            type: `POST`,
            url: `/internal-api/v2/fleet/${this.props.fleetID}/commander`
        }).fail(function(err) {
            console.warn("Error updating the commander: ", err);
        })
    }

    updateBackseat(){
        $.ajax({
            type: "POST",
            url: `/internal-api/v2/fleet/${this.props.fleetID}/backseat`
        }).fail(function(err) {
            console.warn("Error updating the backseat: ", err);
        })
    }

    setComms(comms){
        $.ajax({
            type: "POST",
            url: `/internal-api/v2/fleet/${this.props.fleetID}/comms`,
            data: {
                name: comms.name,
                url: comms.url
            }
        }).fail(function(err) {
            console.warn("Error updating the fleet comms: ", err);
        });
    }

    setStatus(fleetStatus){
        $.ajax({
            type: "POST",
            url: `/internal-api/v2/fleet/${this.props.fleetID}/status`,
            data: {
                status: fleetStatus
            }
        }).fail(function(err) {
            console.warn("Error updating the fleet status: ", err);
        });
    }

    setType(fleetType){
        $.ajax({
            type: "POST",
            url: `/internal-api/v2/fleet/${this.props.fleetID}/type`,
            data: {
                type: fleetType
            }
        }).fail(function(err) {
            console.warn("Error updating the fleet type: ", err);
        });
    }

    render() {
        let commsOptions;
        if(fleet.comms){
            commsOptions = fleet.comms.map((value, key) =>
                <a className="dropdown-item" key={key} id={key} onClick={this.setComms.bind(this, value)}>{value.name}</a>
            )
        }
        
        return(
            <div className="statistic-block block">
				<div className="title">
					<div className="icon"></div>
					<strong>Fleet Info</strong>
				</div>
				
				<table className="table table-striped table-sm">
					<tbody>
						<tr>
							<td>FC (Boss):</td>
							<td><ShowInfo entity={this.props.info.fc} /></td>
							<td><button className="btn btn-primary btn-sm btn-block" onClick={this.updateFC.bind(this)}>I'm the FC</button></td>
						</tr>
						<tr>
							<td>Backseating FC:</td>
							<td><ShowInfo entity={this.props.info.backseat} /></td>
							<td><button className="btn btn-primary btn-sm btn-block" onClick={this.updateBackseat.bind(this)}>Update Backseat</button></td>
						</tr>
						<tr>
							<td>Fleet Status:</td>
							<td>{this.props.info.status}</td>
							<td>
								<div className="dropdown">
									<button className="btn btn-primary btn-sm btn-block dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button">Update Status <i className="fas fa-sort-down float-right"></i></button>
									<div className="dropdown-menu" role="menu">
										<a className="dropdown-item" onClick={this.setStatus.bind(this, 'Forming')}>Forming</a>
                                        <a className="dropdown-item" onClick={this.setStatus.bind(this, 'Running')}>Running</a>
										<a className="dropdown-item" onClick={this.setStatus.bind(this, 'Docking Soon')}>Docking Soon</a>
										<a className="dropdown-item" onClick={this.setStatus.bind(this, 'Short Break')}>Short Break</a>
                                        <a className="dropdown-item" onClick={this.setStatus.bind(this, 'Not Listed')}>Not Listed</a>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>Fleet Type:</td>
							<td>{this.props.info.type}</td>
							<td>
								<div className="dropdown">
									<button className="btn btn-primary btn-sm btn-block dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button">Change Type <i className="fas fa-sort-down float-right"></i></button>
									<div className="dropdown-menu" role="menu">
										<a className="dropdown-item" onClick={this.setType.bind(this, 'Vanguards')}>Vanguards</a>
										<a className="dropdown-item" onClick={this.setType.bind(this, 'Assaults')}>Assaults</a>
										<a className="dropdown-item" onClick={this.setType.bind(this, 'Headquarters')}>Headquarters</a>
										<a className="dropdown-item" onClick={this.setType.bind(this, 'Mothership')}>Mothership</a>
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>Fleet Comms:</td>
							<td><Comms comms={this.props.info.comms} /></td>
							<td>
								<div className="dropdown">
									<button className="btn btn-primary btn-sm btn-block dropdown-toggle" data-toggle="dropdown" aria-expanded="false" type="button">Change Channel <i className="fas fa-sort-down float-right"></i></button>
									<div className="dropdown-menu" role="menu">
                                        {commsOptions}
									</div>
								</div>
							</td>
						</tr>
						<tr>
							<td>Fleet System:</td>
							<td><SetWaypoint system={this.props.info.system}/></td>
							<td><button className="btn btn-sm btn-danger btn-block" data-toggle="modal" data-target="#fleetActions" accessKey="A"><i className="fas fa-exclamation-triangle"></i> More Actions <i className="fas fa-exclamation-triangle"></i></button></td>
						</tr>
					</tbody>
				</table>
			</div>
        )
    }
}

export default FcFleetInfo;