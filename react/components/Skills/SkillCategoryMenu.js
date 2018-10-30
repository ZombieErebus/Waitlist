import React, { Component } from 'react';
import SkillCategory from 'components/Skills/SkillCategory';

class SkillCategoryMenu extends Component {
    constructor(props) { 
        super(props)
    }
    
    getSkillNav() {
        return this.props.skillList;
    }

    onViewSelected(index) {
        this.props.onSetSelected(index)
    }

    render() {
        let skillNav;
        if(!!this.getSkillNav()) {
            skillNav = this.getSkillNav().map((skills, index) => {
                return <SkillCategory skill={skills} key={index} onView={this.onViewSelected.bind(this, index)} />
            });
        }

        return(
            <div className="statistic-block block">
                <table className="table table-striped table-hover table-sm table-responsive">
                    <thead className="thead-inverted">
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