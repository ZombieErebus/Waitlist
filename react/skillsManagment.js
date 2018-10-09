import React from 'react';
import SkillSets from './components/skillSets';
import SkillSettings from './components/skillSettings';
import ReactDOM from 'react-dom';

const skillManagmentEndpoint = "/internal-api/v2/skills-managment"
const MaxFailures = 10;

class SkillsManagment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            failures: 0,    
            backingOff: false,
            waitlistData: {}
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <section className="no-padding-top no-padding-bottom container-fluid">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <SkillSets />
                        </div>
                        <div className="col-lg-8 col-md-6 col-sm-12">
                            <SkillSettings />
                        </div>
                    </div>
                </section>
                

            </div>
        );
    }

}

console.log("Attaching to dom!");
const reactAttach = document.querySelector('#react-skillsManagement-attach')
ReactDOM.render(<SkillsManagment />, reactAttach);
