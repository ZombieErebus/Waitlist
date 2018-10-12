        import React, { Component } from 'react';

class Dialog extends Component {
    render() {
        return(
            <div role="dialog" tabIndex="-1" className="modal fade" id={this.props.id}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{this.props.title}</h4>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dialog;