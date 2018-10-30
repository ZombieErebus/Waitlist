import React, { Component } from 'react';

class ShowInfo extends Component {
    constructor(props) {
        super(props)
    }

    esiShowInfo(){
        $.ajax({
            type: "POST",
            url: "/esi/ui/info/" + this.props.entity.characterID
          });
    }

    render(){
        return(
            <a href="#" onClick={this.esiShowInfo.bind(this)}>{this.props.entity.name}</a>
        );
    }
}

export default ShowInfo;