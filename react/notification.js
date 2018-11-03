import React from 'react';
import ReactDOM from 'react-dom';
import ReactNotifications from 'react-browser-notifications';

let url = '/poll/'
let title = "Imperium Incursions";
const MaxFailures = 10;

class Notification extends React.Component {
    constructor() {
        super();
        this.showNotifications = this.showNotifications.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            fc: this.getFC(),
            id: $('meta[name=id]').attr("content"),
            failures: 0,    
            backingOff: false,
            notification: {}
        }
    }

    componentDidMount() {
        this.poll();
        //Prompts people for notification access.
        if(window.Notification &&  Notification.permission !== "denied"){
            window.Notification.requestPermission().then(() => {});
        }
    }

    poll() {
        if(this.state.backingOff) {
            let failures = this.state.failures - 1;
            let backingOff = true;

            if(failures <= 0) {
                backingOff = false;
            }

            this.setState({failures: failures, backingOff: backingOff});

            if(backingOff) {
                setTimeout(this.poll.bind(this), 6000);
                return;
            }
        }
        
        $.ajax({
            url: url + this.state.id,
            success: (data) => {
                this.setState({
                    broadcastInfo: `\n~~ Sent to ${data.target} ~~`,
                    invite: data.invite,
                    fc: data.sender,
                    comms: data.comms,                    
                    fleet: data.fleet,
                    minutes: new Date().getMinutes()
                });

                this.showNotifications();
                this.setState({failures: 0});
                this.poll();
            },
            error: (xhr, status, error) => {
                if(this.state.failures >= 10){
                    this.setState({backingOff: true});
                    this.poll();
                    return;
                }

                this.setState({failures: this.state.failures + 1});
                setTimeout(this.poll.bind(this), (this.state.failures) * (5*1000));
            }
        })
    }

    getFC() {
        if(this.props) {
            return this.props.fc;
        } else {
            return "One of our FCs ";
        }
    }

    getID() {
        if(this.state.id){
            return this.state.id;
        }
        return null;
    }

    showNotifications() {       
        if(this.n.supported()) {
            this.n.show();
        }
    }
    
    // Open mumble and close the notification
    handleClick(event) {
        if(this.props.comms.url()) {
            window.focus();
            window.location.assign(this.getCommsUrl(), "_blank");
        }
        
        this.n.close(event.target.tag);
    }
 
  render() {
    let message;
    if(this.state.invite){
        message = `${this.state.fc} in ${this.state.fleet} is trying to invite you to their fleet.\n`
    } else {
        message = `${this.state.fc} in ${this.state.fleet} is trying to get your attention.\n`;
    }

    return (
      <div>
 
        <ReactNotifications
          onRef={ref => (this.n = ref)} // Required
          title={title}
          body={message + this.state.broadcastInfo}
          icon="/includes/img/gsf-bee.png"
          tag={this.state.id + this.state.minutes}
          timeout={30 * 1000}
          onClick={event => this.handleClick(event)}
        />
  
      </div>
    )
  }
}

const reactAttach = document.querySelector('#react-alert-attach');
ReactDOM.render(<Notification />, reactAttach);