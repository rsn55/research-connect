import React, {Component} from 'react';
import axios from 'axios';
import '../ApplicationPage.css';
import * as Utils from '../components/Shared/Utils.js'

class Resume extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resume: <p>Resume is loading...</p>,
            error: false
        };
    }

    componentWillMount() {
        axios.get('/resume/' + this.props.match.params.id)
            .then((response) => {
                this.setState({
                    resume: response.data
                });
            })
            .catch((error) => {
                this.setState({
                    error: error.response.data
                });
                console.log(error);
            });
    }

    render() {
        let message;
        if (this.state.error){
            message = <p style="align: center"> {this.state.error} </p>;
        }
        else {
            message = <embed style={{height: "100%", width: "100%"}} src={"data:application/pdf;base64," + this.state.resume }/>
        }

        return (
            <div style={{height: "100%", width: "100%"}}>
                {message}
            </div>
        );
    }
}

export default Resume;
