import React, { Component } from 'react';
import correctImg from './image/correct.png';
import errorImg from './image/error.png';

const styles = {
    submit_contaienr: {
        width: "50%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        padding: "50px",
        paddingBottom: "20px"
    },
    state_title: {
        fontSize: "20px",
        marginTop: "20px"
    },
    description: {
        fontSize: "15px",
        marginTop: "20px"
    }

}

class SubmitState extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            submit_state: {
                "state": "success"
            }
        }
    }
    render() {
        if (this.state.submit_state) {
            const { description, state_text } = this.props.schema
            const { state } = this.state.submit_state;
            return (
                <div className="submit-state-container" style={styles.submit_contaienr}>
                    {
                        (state === "success") ?
                            <img src={correctImg} style={{ width: "50px", height: "50px" }} />
                            :
                            <img src={errorImg} style={{ width: "50px", height: "50px" }} />
                    }
                    <div className="state-title" style={styles.state_title}>{state_text[state]}</div>
                    <div className="description-text" style={styles.description}>{description[state]}</div>
                </div>
            )
        } else {
            return <div>loading......</div>
        }
    }
}

function warpComponent(schema, props) {
    let nprops = { ...props, schema: schema }
    return <SubmitState {...nprops} />
}

const ComponentModule = {
    warpComponent: warpComponent
};


export default ComponentModule;