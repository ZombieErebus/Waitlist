import React, { Component } from 'react';

class NoFleetIndicator extends Component {
    render() {
        return(
            <i className="fleet-glance-loading fal fa-spinner-third fa-3x fa-spin d-block my-3"></i>
        );
    }
}

export default NoFleetIndicator;