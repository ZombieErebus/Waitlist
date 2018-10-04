import React, { Component } from 'react';
import classNames from 'classnames'; 
import ShowInfo from 'components/showInfo';

class Queue extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return(
            <div id="queueInfo" class="statistic-block block noselect">
                <div class="title"><strong>Waitlist Queue</strong></div>
                <table class="table table-striped table-sm noselect">
                    <tbody>
                        <tr>
                            <td class="tw60per"><i class="fas fa-info-circle" data-toggle="tooltip" data-title="This indicator does not include alts."></i> Your Position:</td>
                            <td>{this.props.queue.mainPos}</td>
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
            </div>
        );
    }
}

export default Queue;