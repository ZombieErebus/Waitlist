import React, { Component } from 'react';
import classNames from 'classnames'; 
import ShowInfo from 'components/showInfo';
import LeaveWaitlist from 'components/leaveWaitlist';

class Queue extends Component {
    constructor(props) {
        super(props)
    }

    hasCharactersInWaitlist() {
        if(!$.isEmptyObject(this.props.main)) {
            return true;
        }

        if(!this.props.pilots) {
            return false;
        }

        // Otherwise, we need to loop through the other pilots and see if there is something marked as on the waitlist
        for(let i = 0; i < this.props.pilots.length; i++) { 
            let pilot = this.props.pilots[i];
            if(pilot.onWaitlist) {
                return true;
            }
        }

        return false;
    }

    render() {
        let leaveWaitlist;
        if(this.hasCharactersInWaitlist()) {
            leaveWaitlist = <LeaveWaitlist characterID={this.props.main.characterID} onForceUpdate={this.props.onForceUpdate} />;
        }

        return(
            <div id="queueInfo" class="statistic-block block noselect">
                <div class="title"><strong>Waitlist Queue</strong></div>
                <table class="table table-striped table-sm noselect">
                    <tbody>
                        <tr>
                            <td class="tw60per"><i class="fas fa-info-circle" data-toggle="tooltip" data-title="This indicator does not include alts."></i> Your Position:</td>
                            <td>{this.props.queue.mainPos - 1}</td>
                        </tr>
                        <tr>
                            <td class="tw60per"><i class="fas fa-info-circle" data-toggle="tooltip" data-title="This indicator does not include alts."></i> People Waiting:</td>
                            <td>{this.props.queue.totalMains}</td>
                        </tr>										
                        <tr>
                            <td><i class="fas fa-info-circle" data-toggle="tooltip" data-title="The FC sees you as your first pilot on the waitlist."></i> Your Main:</td>
                            <td><ShowInfo entity={this.props.main}/></td>
                        </tr>
                    </tbody>
                </table>

                {leaveWaitlist}
            </div>
        );
    }
}

export default Queue;