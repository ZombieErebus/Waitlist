import React from 'react';
import Header from 'components/header';
import Alert from 'components/alert';
import ReactDOM from 'react-dom';

class Waitlist extends React.Component {
    render() {
        return(
            <div className="page-content">
                <Header />
                <Alert />
            </div>
        );
    }
}

console.log("Attaching to dom!");
const reactAttach = document.querySelector('#react-fleet-attach')
ReactDOM.render(<Waitlist />, reactAttach);
