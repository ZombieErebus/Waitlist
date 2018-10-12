import React, { Component } from 'react';
import SkillCategory from 'components/skillCategory';

class SkillCategoryMenu extends Component {
    constructor(props) { 
        super(props)
    }
    
    getSkillNav() {
        return this.props.skillList;
    }

    render() {
        let skillNav;
        if(!!this.getSkillNav()) {
            skillNav = this.getSkillNav().map((skills, index) => {
                return <SkillCategory skill={skills} key={index} onView={this.props.onSetSelected.bind(index)} />
            });
        }

        return(
            <div className="statistic-block block">
                <table class="table table-striped table-hover table-sm table-responsive">
                    <thead class="thead-inverted">
                        <tr>
                            <th>Plan Name</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {skillNav}
                        </tbody>
                </table>
            </div>
        )
    }
}

export default SkillCategoryMenu;