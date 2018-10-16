import React, { Component } from 'react';
import classNames from 'classnames';
import Panel from 'components/Panel';
import SkillsTable from 'components/SkillsTable';

class SkillSettings extends Component {
    constructor(props) {
        super(props)
        this.setName = React.createRef();
        this.setHulls = React.createRef();
        this.setFilter = React.createRef();
        this.isPublic = React.createRef();
        this.state = {
            setPublic: false
        }
    }

    deleteSkillSet() {
        $.ajax({
            type: "delete",
            url: `/internal-api/v2/skills-managment/${this.props.set._id}`
        }).done(() => {
            location.reload();
        }).fail((error) => {
            console.log(error);
        });
    }

    getSetName() {
        if(!!this.props.set) {
            return this.props.set.name;
        }
    }

    getSetHulls() {
        if(!!this.props.set && !!this.props.set.ships) {
            return this.props.set.ships;
        }
    }

    getSetHullsAsString() {
        if(!!this.props.set && !!this.props.set.ships) {
            let shipNames = "";
            for(let i = 0; i < this.props.set.ships.length; i++){
                shipNames = shipNames + `${this.props.set.ships[i].name},`;
            }

            return shipNames.slice(0, -1);
        } 
    }

    updateSetPublic() {
        this.setState({setPublic: !this.state.setPublic});
    }

    updateSettings(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: `/internal-api/v2/skills-managment/${this.props.set._id}`,
            data: {
                name: this.setName.current.value,
                hulls: this.setHulls.current.value,
                filter: this.setFilter.current.value,
                isPublic: this.state.setPublic
            }
        }).done((data) => {
            $('#skillSettings').modal('hide');
        }).fail((err) => {
            console.log(err);
        });
    }

    render() {
        return(
            <div className="statistic-block block">   
                <div className="row">
                    <div className="col-lg-8 col-md-6 col-sm-12">
                        <SkillsTable />
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                        <Panel title={this.getSetName() + " - settings"} bgclass="danger">
                            <form onSubmit={this.updateSettings.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="name">Skill Set Name</label>
                                    <input type="text" id="name" className="form-control" ref={this.setName} defaultValue={this.getSetName()} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hulls">Hulls for this skill set</label>
                                    <input type="text" id="hulls" className="form-control" ref={this.setHulls} defaultValue={this.getSetHullsAsString()} required/>
                                    <p className="form-text text-muted">Comma separated for multiple hulls: Vindicator,Nightmare</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="filter">Select the filter type for this skill set.</label>
                                    <select id="filter" className="form-control" ref={this.setFilter}>
                                        <option value="Capitals">Capitals</option>
                                        <option value="DPS">DPS</option>
                                        <option value="Logistics &amp; Support">Logistics and Support</option>
                                        <option value="Snipers">Snipers</option>
                                        <option value="Supers">Super Capitals</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" defaultChecked={this.state.setPublic} onChange={this.updateSetPublic.bind(this)} />
                                        &nbsp; Make this skill set visible for FCs/Pilots
                                    </label>
                                </div>
                                <button className="btn btn-success d-block mx-auto">Update</button>
                            </form>

                                <hr />
                            <span className="text-danger text-center">DANGER ZONE - THIS CANNOT BE UNDONE</span>
                            <button className="btn btn-danger d-block mx-auto mt-2" onClick={this.deleteSkillSet.bind(this)}>Delete this Skill Set</button>                            
                        </Panel>
                    </div>
                </div>
            </div>
        )
    }
}

export default SkillSettings;