import React, { Component } from 'react';
import classNames from 'classnames'; 


class JoinWaitlist extends Component {
    constructor(props) {
        super(props);

        this.shipInputs = {}
    }

    getPilotSelect() {
        for(let i = 0; i < this.props.pilots.other; i++){
            
        }
    }

    joinAsAlt(pilotID) {
        let ship = this.shipInputs[pilotID].value;

        $.ajax({
            type: "POST",
            url: "/join/alt",
            data: {
                pilot: pilotID,
                ship: ship
            }
        }).done(function(){
            pilotState(pilotID);
        }).fail(function(error){
            console.log(error);
        })
    }

    onShipRef(element, characterID) {
        this.shipInputs[characterID] = element;
    }

    render() {
        let pilots = this.props.pilots.other.map((pilot, index) => {
            return <option value={pilot.characterID} key={index}>{pilot.name}</option>;
        });

        let pilotsOther = this.props.pilots.other.map((pilot, index) => {
            return (
                <tr>
                    <td>
                        <img src={`https://image.eveonline.com/Character/${pilot.characterID}_32.jpg`} />
                    </td>
                    <td>
                        {pilot.name}
                    </td>
                    <td>
                        <input type="text" className="form-control" name="pilot" ref={ element => {
                            this.onShipRef(element, pilot.characterID);
                        }} />
                    </td>
                    <td>
                        <button className="btn btn-success btn-sm" onClick={this.joinAsAlt.bind(this, pilot.characterID)}><i className="fas fa-plus"></i></button>
                    </td>
                </tr>
            );
        });

        let selectMain;
        let selectAlts;
        if(!this.props.waitlistMain){
            selectMain = 
            <form method="post" action="/join/main">
                <div class="form-group">
                    <label for="selectMain">Select your main</label>
                    <select className="form-control mb-0" name="pilot" id="selectMain">
                        {pilots}
                    </select>
                    <small className="text-muted">This is the name the FC will see you as.</small>
                </div>

                <button className="btn btn-success btn-block">Sign Up</button>
            </form>
        } else {
            selectAlts =
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Ship</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pilotsOther}
                    </tbody>
                </table>
            </div>
        }

        return (
            <div>
                <div id="queueInfo" class="statistic-block block noselect">
                    <div class="title"><strong>Waitlist for Fleet</strong></div>
                    {selectMain}
                    {selectAlts}
                </div>
            </div>
        );
    }
} 

export default JoinWaitlist;