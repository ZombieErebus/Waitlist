import React from 'react';
import Header from 'components/header';
import Banner from 'components/banner';
import FleetInfo from 'components/fleetInfo';
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

    render() {
        let banner;

        if(!!this.getBanner()) {
            banner = <Banner banner={this.getBanner()} />
        }

        // let fleets;

        // if(!!this.getFleetInfo()) {
        //     fleets = <FleetInfo fleetInfo={this.getFleetInfo()} />
        // }

        let fleets;
        if(!!this.getFleets()) {
            fleets = this.getFleets().map((fleet, index) => {
                return <FleetInfo fleet={fleet} key={index}></FleetInfo >
            });
        }

        return(
            <div>
                <Header />
                {banner}

                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-12">
                        {fleets}
                    </div>
                </div>
            </div>
        );
    }
}

console.log("Attaching to dom!");
const reactAttach = document.querySelector('#react-fleet-attach')
ReactDOM.render(<Waitlist />, reactAttach);
