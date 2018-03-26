import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DataActions from '../actions';

const mapStateToProps = state => ({
    dataCalls: state.dataCalls,
});

const mapDispatchToProps = dispatch => bindActionCreators(DataActions, dispatch);

function List(props) {
    const listData = props.data;
    const listItems = listData.map((item, index) =>
        (<tr key={index.toString()}>
            <td>{item.name}</td>
            <td>{item.phone}</td>
            <td>{item.time}</td>
        </tr>),
    );
    return (
        <tbody>
            { listItems }
        </tbody>
    );
}

class Table extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <div className="Table" >
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <List data={this.props.dataCalls} />
                </table>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
