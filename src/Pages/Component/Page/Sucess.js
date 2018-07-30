import React, { Component } from 'react';
import './success.scss';
import correctImg from './correct.png';

export class Sucess extends Component {
    constructor(props) {
        super(props);
    }

    render() {
            return (
                <div className="success-page">
                    <div>
                        <img className="correct-img" src={correctImg} />
                        <p className="success-title">{this.props.title}</p>
                        <p className="success-description">{this.props.description}</p>
                    </div>
                </div>
            )
    }
}

export default Sucess;
