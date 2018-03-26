import 'rc-time-picker/assets/index.css';
import $ from 'jquery';
import React, { Component } from 'react';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DataActions from './actions';

import './App.css';

const mapStateToProps = state => ({
    dataCalls: state.dataCalls,
});

const mapDispatchToProps = dispatch => bindActionCreators(DataActions, dispatch);

function List(props) {
    const listData = props.data;
    const listItems = listData.map((item, index) =>
        (<tr key={index.toString()} className={(moment(item.time) < moment()) ? 'bg-danger' : 'bg-success '}>
            <td>{item.name}</td>
            <td>{item.phone}</td>
            <td>{moment(item.time).format('HH:mm')}</td>
            <td><button className="btn btn-default btn-danger" data-name={item.name} onClick={props.deleteTicket}>Delete</button></td>
            <td><input type="checkbox" checked={(moment(item.time) < moment())} /></td>
        </tr>),
    );
    return (
        <tbody>
            { listItems }
        </tbody>
    );
}


class App extends Component {
    constructor(props) {
        super(props);
        this.time = moment();
        this.sortNameWay = true;
        this.sortTimeWay = true;
        this.state = {
            name: '',
            phone: '',
            time: moment().format('YYYY-MM-DDTHH:mm:ss.sssZ'),
            dataTable: this.props.dataCalls.sort((a, b) => moment(a.time) > moment(b.time)),
            phoneBag: false,
            next_name: '',
            next_phone: '',
            next_time: '',
            hasName: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.deleteTicket = this.deleteTicket.bind(this);
        this.sortAll = this.sortAll.bind(this);
        this.sortNext = this.sortNext.bind(this);
        this.sortEnd = this.sortEnd.bind(this);
        this.validPhone = this.validPhone.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.sortByTime = this.sortByTime.bind(this);
        this.findNextCall = this.findNextCall.bind(this);
        this.checkRepeatName = this.checkRepeatName.bind(this);
    }
    componentWillMount() {
        if (!localStorage.myDat) {
            localStorage.myDat = '[]';
        }
    }
    componentDidMount() {
        /* $('.dataTable').DataTable({
            dom: '<"top">rt<"bottom"><"clear">',
            order: [[2, 'asc']],
        }); */
        setInterval(() => this.findNextCall(), 1000);
    }
    findNextCall() {
        const data = this.props.dataCalls.slice();
        this.setState({
            next_name: '',
        });
        data.sort((a, b) => moment(a.time) > moment(b.time));
        for (let i = 0; i < data.length; i += 1) {
            if (moment() < moment(data[i].time)) {
                this.setState({
                    next_name: data[i].name,
                    next_phone: data[i].phone,
                    next_time: data[i].time,
                });
                break;
            }
        }
    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
        if (name === 'phone') {
            this.validPhone(value);
        }
        if (name === 'name') {
            this.checkRepeatName(value);
        }
    }
    handleChangeTime(value) {
        this.setState({ time: value.format('YYYY-MM-DDTHH:mm:ss.sssZ') });
    }
    handleSubmit(event) {
        const obj = {
            name: this.state.name,
            phone: this.state.phone,
            time: this.state.time,
        };
        this.props.actionTable(obj, 'add');
        this.setState({
            name: '',
            phone: '',
            phoneBag: false,
        });
        event.preventDefault();
    }
    deleteTicket(event) {
        const name = $(event.target).attr('data-name');
        this.props.actionTable(name, 'del');
        event.preventDefault();
        this.setState({ dataTable: this.props.dataCalls });
    }
    sortAll() {
        this.setState({ dataTable: this.props.dataCalls });
    }
    sortNext() {
        this.setState({ dataTable: this.props.dataCalls.filter(item => moment(item.time) > moment()) });
    }
    sortEnd() {
        this.setState({ dataTable: this.props.dataCalls.filter(item => moment(item.time) < moment()) });
    }
    sortByName() {
        if (this.sortNameWay) {
            this.setState({ dataTable: this.props.dataCalls.sort((a, b) => a.name < b.name) });
        } else {
            this.setState({ dataTable: this.props.dataCalls.sort((a, b) => a.name > b.name) });
        }
        this.sortNameWay = !this.sortNameWay;
    }
    sortByTime() {
        if (this.sortTimeWay) {
            this.setState({ dataTable: this.props.dataCalls.sort((a, b) => moment(a.time) < moment(b.time)) });
        } else {
            this.setState({ dataTable: this.props.dataCalls.sort((a, b) => moment(a.time) > moment(b.time)) });
        }
        this.sortTimeWay = !this.sortTimeWay;
    }
    validPhone(value) {
        const success = /^(\+|00)(\(\d{3}\)[-]|\d{3}|\(\d{3}\)\s)(\d{3}\s\d{3}\s\d{3}|\d{9})$/.test(value);
        this.setState({ phoneBag: !success });
        if (success) {
            return true;
        }
        return false;
    }
    checkRepeatName(value) {
        const data = this.props.dataCalls;
        this.setState({ hasName: false });
        for (let i = 0; i < data.length; i += 1) {
            if (data[i].name === value) {
                this.setState({ hasName: true });
                break;
            }
        }
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="next-call row" >
                            <div className="col-xs-12">
                                <h2>
                                    Next Call
                                </h2>
                            </div>
                            <div className={`row${this.state.next_name ? ' hidden' : ''}`}>
                                <div className="col-xs-12">
                                    <div className="alert alert-success" role="alert"> <strong>No more calls!</strong></div>
                                </div>
                            </div>
                            <div className={`row${!this.state.next_name ? ' hidden' : ''}`}>
                                <div className="col-xs-4">{this.state.next_name}</div>
                                <div className="col-xs-4">{this.state.next_phone}</div>
                                <div className="col-xs-4">{moment(this.state.next_time).format('HH:mm')}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="clearfix">
                            <form onSubmit={this.handleSubmit}>
                                <div className={!this.state.hasName ? 'hidden alert alert-danger clearfix' : 'alert alert-danger clearfix'} role="alert">
                                    Sorry, but this name is already registered!
                                </div>
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
                                                <td>
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" minLength="2" maxLength="10" name="name" value={this.state.name} onChange={this.handleChange} required />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={this.state.phoneBag ? 'form-group has-error' : 'form-group'}>
                                                        <input type="text" className="form-control" name="phone" id="phone" value={this.state.phone} onChange={this.handleChange} required />
                                                        <label className={this.state.phoneBag ? 'control-label' : 'control-label hidden'} htmlFor="phone">
                                                        Please enter number in the format:
                                                            <br />+(420) 111 222 333
                                                            <br /> or +(420)-111222333
                                                            <br />or +420111222333
                                                            <br />or 00420111222333
                                                        </label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <TimePicker
                                                        showSecond={false}
                                                        defaultValue={this.time}
                                                        name="time"
                                                        onChange={this.handleChangeTime} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className={(this.state.phoneBag || this.state.hasName) ? 'hidden' : 'btn btn-default pull-right'} type="submit">+Add</button>
                                </div>
                            </form>
                        </div>
                        <div className="Table" >
                            <table className="table dataTable">
                                <thead>
                                    <tr>
                                        <th><button onClick={this.sortByName}>SORT</button></th>
                                        <th />
                                        <th><button onClick={this.sortByTime}>SORT</button></th>
                                        <th />
                                        <th />
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Time</th>
                                        <th />
                                        <th />
                                    </tr>
                                </thead>
                                <List data={this.state.dataTable} deleteTicket={this.deleteTicket} />
                            </table>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <button
                                    className="btn btn-default pull-right"
                                    onClick={this.sortAll}>ALL</button>
                            </div>
                            <div className="col-md-4 text-center">
                                <button
                                    className="btn btn-default"
                                    onClick={this.sortNext}>Next</button>
                            </div>
                            <div className="col-md-4">
                                <button
                                    className="pull-left btn btn-default"
                                    onClick={this.sortEnd}>Finished</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
