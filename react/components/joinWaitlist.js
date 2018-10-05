import React, { Component } from 'react';
import classNames from 'classnames'; 


class JoinWaitlist extends Component {
    constructor(props) {
        super(props);

        this.shipInputs = {}
        this.state = {};
        this.selectRef = React.createRef();
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
            // pilotState(pilotID);
        }).fail(function(error){
            console.log(error);
        })
    }

    joinAsMain(e) {
        e.preventDefault();

        let ship = "test";

        $.ajax({
            type: "POST",
            url: "/join/main",
            data: {
                pilot: this.selectRef.current.value,
                ship: ship
            }
        }).done(function() {

        }).fail(function(error){
            console.log(error);
        });
    }

    onMainSelectionChanged(e) {
        this.setState({ selectedMain: e.target.value });
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
        if(!this.props.waitlistMain || $.isEmptyObject(this.props.waitlistMain)) {
            let defaultValue = this.state.selectedMain || this.props.pilots.other[0].characterID;
        
            console.log(defaultValue);
            selectMain = 
            <form onSubmit={this.joinAsMain.bind(this)}>
                <div class="form-group">
                    <label for="selectMain">Select your main</label>
                    <select defaultValue={defaultValue} onChange={this.onMainSelectionChanged} ref={this.selectRef} className="form-control mb-0" name="pilot">
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