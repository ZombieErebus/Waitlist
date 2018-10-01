import React, { Component } from 'react';
import classNames from 'classnames'; 

class Alert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            bannerText: "Woohoo react is kind of pretty cool",
            adminName: "Samuel the Terrible",
            bannerClass: "banner-info",
            userAdminNumeric: 1
        };
    }

    isUserAdmin() {
        return this.state.userAdminNumeric > 0;
    }

    hasBannerMessage() {
        return this.state.bannerText;
    }

    render() {
        let adminDeleteElement;
        if(this.isUserAdmin()) {
            adminDeleteElement = <span>| <a href="#" class="font-weight-bold" onclick="hideBanner('{{banner._id}}')">admin delete</a></span>;
        }

        let alertBanner;
        if(this.hasBannerMessage()) {
            const classes = classNames("alert alert-primary noselect mb-4", this.state.bannerClass);
            alertBanner = <div id="topbanner" role="alert" className={classes}>
                <strong><i className="fas fa-info-circle"></i></strong> {this.state.bannerText}
                <p className="mt-0 mb-0">Message set by: {this.state.adminName} {adminDeleteElement} </p>
            </div>
        }

        return(
            <section>
                <div id="alertarea">
                    {alertBanner}
                    <div id="noFleetBanner" role="alert" className="alert alert-primary global-banner-inactive noselect hide">
                        <strong>Waitlist Inactive:</strong> There is either no fleets, or the waitlist is not being used. Check our in-game channel for more information!
                    </div>
                </div>
            </section>
        );
    }
}

export default Alert;