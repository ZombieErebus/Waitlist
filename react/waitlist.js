import React from 'react';
import Header from 'components/header';
import Banner from 'components/banner';
import FleetInfo from 'components/fleetInfo';
import WaitlistQueue from 'components/queue';
import JoinWaitlist from 'components/joinWaitlist';
import ReactDOM from 'react-dom';


const WaitlistEndpoint = "/internal-api/v2/waitlist"
const MaxFailures = 10;

class Waitlist extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            failures: 0,    
            backingOff: false,
            waitlistData: {}
        }
    }

    waitlistUpdate() {
        if(this.state.backingOff) {
            let failures = this.state.failures - 1;
            let backingOff = true;

            if(failures <= 0) {
                backingOff = false;
            }

            this.setState({failures: failures, backingOff: backingOff});

            if(backingOff) {
                return;
            }
        }

        $.ajax({
            url: WaitlistEndpoint,
            method: 'get'
        }).done((data)=>{
            this.setState({waitlistData: data, failures: 0});
        }).fail((err) => {
            let failures = this.state.failures;
            let backingOff = false;
            if(failures + 1 >= MaxFailures) {
                backingOff = true;
            }

            this.setState({failures: failures + 1, backingOff: backingOff});
        });
    }
    
    componentDidMount() {
        this.waitlistUpdate();
        setInterval(this.waitlistUpdate.bind(this), 5 * 1000);
    }

    getBanner() {
        return this.state.waitlistData.banner;
    }

    getFleets() {
        return this.state.waitlistData.fleets;
    }

    hasFleets() {
        let fleets = this.getFleets();

        return !!fleets && fleets.length;
    }

    getPilots() {
        return this.state.waitlistData.pilots;
    }

    getWaitlistQueue() {
        return this.state.waitlistData.queue;
    }

    getWaitlistMain() {
        return this.state.waitlistData.pilots.main;
    }

    getJoinWaitlist() {
        return this.state.waitlistData.pilots;
    }

    render() {
        let banner;

        if(!!this.getBanner()) {
            banner = <Banner banner={this.getBanner()} hasFleets={this.hasFleets()} />
        }

        let fleets;
        if(!!this.getFleets()) {
            console.log(!!this.getFleets)
            fleets = this.getFleets().map((fleet, index) => {
                return <FleetInfo fleet={fleet} key={index}></FleetInfo >
            });
        }
        
        let waitlistQueue;
        if(!!this.getWaitlistQueue() && this.hasFleets()) {
            waitlistQueue = <WaitlistQueue queue={this.getWaitlistQueue()} main={this.getWaitlistMain()} />
        }

        let joinWaitlist;
        if(!!this.getJoinWaitlist() && this.hasFleets()) {
            joinWaitlist = <JoinWaitlist pilots={this.getPilots()} waitlistMain={this.getWaitlistMain()}/>
        }

        return(
            <div>
                <Header />
                {banner}
                
                <section className="no-padding-top padding-bottom noselect">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-12">
                                {waitlistQueue}
                                {joinWaitlist}
                            </div>
                            <div className="col-lg-8 col-md-6 col-sm-12">
                                <div id="fleetInfoCards" className="row">
                                    {fleets}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

console.log("Attaching to dom!");
const reactAttach = document.querySelector('#react-fleet-attach')
ReactDOM.render(<Waitlist />, reactAttach);
