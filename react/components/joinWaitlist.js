import React, { Component } from 'react';
import classNames from 'classnames'; 


class JoinWaitlist extends Component {
    constructor(props) {
        super(props);

        this.shipInputs = {}
        this.state = {};
        this.selectRef = React.createRef();
        this.ship = React.createRef();
    }

    getPilotSelect() {
        for(let i = 0; i < this.props.pilots.other; i++){
            
        }
    }

    joinAsAlt(pilotID) {
        let ship = this.shipInputs[pilotID].value;
        let updateCallback = this.props.onForceUpdate;

        $.ajax({
            type: "POST",
            url: "/join/alt",
            data: {
                pilot: pilotID,
                ship: ship
            }
        }).done(function(){
            updateCallback();
        }).fail(function(error){
            console.log(error);
        })
    }

    removeAlt(pilotID) {
        let updateCallback = this.props.onForceUpdate;

        $.ajax({
            type: "POST",
            url: "/remove/character/" + pilotID
        }).done(() => {
            updateCallback();
        }).fail((error) => {
            console.log(error);
        })
    }

    joinAsMain(e) {
        e.preventDefault();

        let updateCallback = this.props.onForceUpdate;

        $.ajax({
            type: "POST",
            url: "/join/main",
            data: {
                pilot: this.selectRef.current.value,
                ship: this.ship.current.value
            }
        }).done(function() {
            updateCallback();
        }).fail(function(error){
            console.log(error);
        });
    }

    onShipRef(element, characterID) {
        this.shipInputs[characterID] = element;
    }

    render() {
        let pilots = this.props.pilots.other.map((pilot, index) => {
            return <option value={pilot.characterID} key={index}>{pilot.name}</option>;
        });
        
        let pilotsOther = this.props.pilots.other.map((pilot, index) => {          
            if(!pilot.onWaitlist) {
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
                            <button className="btn btn-success btn-sm" onClick={this.joinAsAlt.bind(this, pilot.characterID)}><i className="fas fa-check-circle"></i></button>
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr>
                        <td>
                            <img src={`https://image.eveonline.com/Character/${pilot.characterID}_32.jpg`} />
                        </td>
                        <td>
                            {pilot.name}
                        </td>
                        <td>
                            <input type="text" className="form-control" name="pilot" disabled/>
                        </td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={this.removeAlt.bind(this, pilot.characterID)}><i className="fas fa-check-circle"></i></button>
                        </td>
                    </tr>
                );
            }
        });

        let selectMain;
        let selectAlts;
        if(!this.props.waitlistMain || $.isEmptyObject(this.props.waitlistMain)) {
            let defaultValue = this.state.selectedMain || this.props.pilots.other[0].characterID;
            selectMain = 
            <form onSubmit={this.joinAsMain.bind(this)}>
                <div class="form-group">
                    <label for="selectMain">Select your main</label>
                    <select id="selectMain" defaultValue={defaultValue} ref={this.selectRef} className="form-control mb-0" name="pilot">
                        {pilots}
                    </select>
                    <small className="text-muted">This is the name the FC will see you as.</small>
                </div>
                <div class="form-group">
                    <label for="selectShip">What ships can you bring?</label>
                    <input id="selectShip" ref={this.ship} className="form-control mb-0" name="ship" maxLength="50" required/>
                    <small className="text-muted">Temporary system, list hull names separated by a comma.</small>
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
        
        let noAlts;
        if(this.props.pilots.other.length <= 0) {
            noAlts =
                <p>Looks like you don't have any alts.
                <a href="/my-settings">You can add some here</a>.</p>
        }

        return (
            <div>
                <div id="queueInfo" class="statistic-block block noselect">
                    <div class="title"><strong>Waitlist for Fleet</strong></div>
                    {noAlts}
                    {selectMain}
                    {selectAlts}
                    
                </div>
            </div>
        );
    }
} 

export default JoinWaitlist;