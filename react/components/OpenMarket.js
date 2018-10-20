import React, { Component } from 'react';

class OpenMarket extends Component {
    esiOpenMarket(){
        $.ajax({
            type: "POST",
            url: "/internal-api/v2/esi-ui/market/",
            data: {
                itemID: this.props.item.id 
            }
        });
    }

    render(){
        return(
            <a href="#" onClick={this.esiOpenMarket.bind(this)}>{this.props.item.name}</a>
        );
    }
}

export default OpenMarket;