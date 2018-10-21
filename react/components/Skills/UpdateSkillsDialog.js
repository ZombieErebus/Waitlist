import React, { Component } from 'react';
import Dialog from 'components/Dialog';
import TextBox  from 'components/inputs/TextBox';
import NumberBox from 'components/inputs/NumberBox';

class UpdateSkillsDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            skillName: this.getSkillName(),
            required: this.getSkillRequired(),
            recommended: this.getSkillRecommended()
        };
    }

    componentDidUpdate(previousProps) {
        if(this.state.skillName != this.getSkillName()) {
            this.setState({skillName: this.getSkillName()});
        }

        if(this.state.required != this.getSkillRequired()) {
            this.setState({required: this.getSkillRequired()});
        }

        
        if(this.state.recommended != this.getSkillRecommended()) {
            this.setState({recommended: this.getSkillRecommended()});
        }

    }

    deleteSkill() {
        $.ajax({
            method: "patch",
            url: `/internal-api/v2/skills-managment/${this.props.setID._id}`,
            data: {
                skillName: this.state.skillName
            }
        }).done((data) => {

        }).fail((error) => {

        });
    }

    //delete when done
    getSkillInfo() {
        return this.props.skill;
    }

    getSkillName() {
        if(this.props.skill) {
            return this.props.skill.name;
        }
    }

    getSkillRequired() {
        if(this.props.skill) {
            return this.props.skill.required;
        }
    }

    getSkillRecommended() {
        if(this.props.skill) {
            return this.props.skill.recommended;
        }
    }

    onSkillNameChanged(e) {
        this.setState({skillName: e.target.value});
    }

    onSkillRequiredChanged(e)  {
        this.setState({required: e.target.value});
    }

    onSkillRecommendedChanged(e)  {
        this.setState({recommended: e.target.value});
    }

    saveSkill(e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: `/internal-api/v2/skills-managment/${this.props.setID._id}`,
            data: {
                name: this.state.skillName,
                required: this.state.required,
                recommended: this.state.recommended
            }
        }).done(() => {
            $('#updateSkill').modal('hide');
            // this.props.onChange(this);
        }).fail((error) => {
            console.log(error);
        })
    }
    
    render() {
        let skillName;
        if(!!this.getSkillName()) {
            skillName = this.getSkillName();
        }
        
        return(
            <div>
                <Dialog id="updateSkill" title="Skill Management">
                    <span className="font-italic">Update skill.</span>
                    <form className="mt-2" onSubmit={this.saveSkill.bind(this)}>
                        <div className="form-group">
                            <label htmlFor="sName">Skill Name</label>
                            <TextBox id="sName" changeFunction={this.onSkillNameChanged.bind(this)} value={this.state.skillName} placeholder="Amarr Carrier" />
                            <small className="text-muted">Exact match required.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="sRequired">Required Skill Level</label>
                            <NumberBox id="sRequired" changeFunction={this.onSkillRequiredChanged.bind(this)} value={this.state.required} min={0} max={5} />
                            <small className="text-muted">If the pilot does not meet this level they will fail the skill.</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="sRecommended">Recommended Skill Level</label>
                            <NumberBox id="sRecommended" changeFunction={this.onSkillRecommendedChanged.bind(this)} value={this.state.recommended} min={0} max={5} />
                            <small className="text-muted">This is a suggested train and is not required to pass the skill set.</small>
                        </div>
                        <button className="btn btn-success d-block mx-auto">Save</button>
                            <hr />
                        <span className="text-danger text-center">DANGER ZONE - THIS CANNOT BE UNDONE</span>
                        <button className="btn btn-danger d-block mx-auto mt-2" onClick={this.deleteSkill.bind(this)}>Delete this Skill Set</button>          
                    </form>
                </Dialog>  
            </div>
        )
    }
}

export default UpdateSkillsDialog;