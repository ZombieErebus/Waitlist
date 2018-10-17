import React, { Component } from 'react';
import Skills from 'components/Skills/Skill'

class SkillsTable extends Component {
    constructor(props) {
        super(props)
    }

    getSkills() {
        return this.props.skills;
    }

    render() {
        let skillTable;
        if(!!this.getSkills()) {
            skillTable = this.getSkills().map((skillData, index) => {
                return <Skills skill={skillData} key={index} updateSkillHandler={this.props.updateSkillHandler}/>
            });
        }

        return(
            <div className="table-responsive">
                <table className="table table-striped table-hover table-sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Skill</th>
                            <th>Required</th>
                            <th>Recommended</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {skillTable}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default SkillsTable;