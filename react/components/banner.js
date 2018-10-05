import React, { Component } from 'react';
import classNames from 'classnames'; 

class Alert extends Component {
    constructor(props) {
        super(props)
    }

    isUserAdmin() {
        return !!this.props.banner.isAdmin;
    }

    getBannerMessage() {
        return this.props.banner.text;
    }

    getBannerClass() {
        return this.props.banner.class;
    }

    getBannerAdmin() {
        return this.props.banner.admin.name;
    }

    getBannerId() {
        return this.props.banner._id;
    }

    hideBanner(_id) {
        $.ajax({
            type: "POST",
            url: '/internal-api/banner/:' + _id,
            success: location.reload()
        }).fail(function(err) {
            console.log(err.responseText);
        });
    }

    render() {
        // TOOD: Consider breaking this down more
        let adminDeleteElement;
        if(this.isUserAdmin()) {
            adminDeleteElement = <span>| <a href="#" class="font-weight-bold banner" onClick={this.hideBanner.bind(this, this.getBannerId())}>admin delete</a></span>;
        }

        let alertBanner;
        if(!!this.getBannerMessage()) {
            const classes = classNames("alert alert-primary noselect mb-4", this.getBannerClass());
            alertBanner = <div id="topbanner" role="alert" className={classes}>
                <strong><i className="fas fa-info-circle"></i></strong> {this.getBannerMessage()}
                <p className="mt-0 mb-0">Message set by: {this.getBannerAdmin()} {adminDeleteElement} </p>
            </div>
        }

        let noFleetsBanner;
        if(!this.props.hasFleets) {
            noFleetsBanner = <div id="noFleetBanner" role="alert" className="alert alert-primary global-banner-inactive noselect">
                <strong>Waitlist Inactive:</strong> There is either no fleets, or the waitlist is not being used. Check our in-game channel for more information!
            </div>;
        }

        return(
            <section>
                <div id="alertarea">
                    {alertBanner}
                    {noFleetsBanner}
                </div>
            </section>
        );
    }
}

export default Alert;