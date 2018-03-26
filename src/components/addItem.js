import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DataActions from '../actions';

const mapStateToProps = state => ({
    dataCalls: state.dataCalls,
});

const mapDispatchToProps = dispatch => bindActionCreators(DataActions, dispatch);

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phone: '',
            time: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {


    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        if (!this.dataT) {
            this.dataT = [];
        }
        this.props.add(this.state);
        this.setState({
            name: '',
            phone: '',
            time: '',
        });
        event.preventDefault();
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="" >
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="text" name="name" value={this.state.name} onChange={this.handleChange} /></td>
                                <td><input type="text" name="phone" value={this.state.phone} onChange={this.handleChange} /></td>
                                <td><input type="text" name="time" value={this.state.time} onChange={this.handleChange} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="btn btn-default pull-right" type="submit">+Add</button>
                </div>
            </form>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
