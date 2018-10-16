import React, { Component } from 'react';
import Panel from 'components/Panel';
import Dialog from 'components/Dialog';
import SkillsTable from 'components/Skills/SkillsTable';

class SkillSettings extends Component {
    constructor(props) {
        super(props)
        this.setName = React.createRef();
        this.setHulls = React.createRef();
        this.setFilter = React.createRef();
        this.isPublic = React.createRef();
        this.newSkillName = React.createRef();
        this.newSkillRequired = React.createRef();
        this.newSkillRecommended = React.createRef();

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
            type: "put",
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

    saveNewSkill(e) {
        e.preventDefault();
        console.log("A")
        $.ajax({
            type: "post",
            url: `/internal-api/v2/skills-managment/${this.props.set._id}`,
            data: {
                name: this.newSkillName.current.value,
                required: this.newSkillRequired.current.value,
                recommended: this.newSkillRecommended.current.value
            }
        }).done((data) => {
            console.log("YEAAAAAAAAAA")
        }).fail((error) => {
            console.log(error);
        })
    }

    render() {
        return(
            <div className="statistic-block block">   
                <div className="row">
                    <div className="col-lg-8 col-md-6 col-sm-12">
                        <button className="btn bg-primary float-right" data-toggle="modal" data-target="#newSingleSkill">Add New Skill</button>
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

                <Dialog id="newSingleSkill" title="Skill Management">
                    <span className="font-italic">Add a new skill.</span>

                    <form className="mt-2" onSubmit={this.saveNewSkill.bind(this)}>
                        <div className="form-group">
                          <label htmlFor="sName">Skill Name</label>
                          <input type="text" id="sName" ref={this.newSkillName} className="form-control" required/>
                          <small id="helpId" className="text-muted">Exact match required.</small>
                        </div>
                        <div className="form-group">
                          <label htmlFor="reqSkillLevel">Required Skill Level</label>
                          <input type="number" id="reqSkillLevel" ref={this.newSkillRequired}className="form-control" min="0" max="5" required/>
                          <small id="helpId" className="text-muted">If the pilot does not meet this level they will fail the skill.</small>
                        </div>
                        <div className="form-group">
                          <label htmlFor="recSkillLevel">Recommended Skill Level</label>
                          <input type="number" id="reqSkillLevel" ref={this.newSkillRecommended} className="form-control" min="0" max="5" required/>
                          <small id="helpId" className="text-muted">This is a suggested train and is not required to pass the skill set.</small>
                        </div>
                        <button className="btn btn-success d-block mx-auto">Save</button>
                    </form>
                </Dialog>
            </div>
        )
    }
}

export default SkillSettings;