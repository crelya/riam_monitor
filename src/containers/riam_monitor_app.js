'use strict';

import React, {Component} from 'react';
import {bindActionCreators} from 'redux';

import {View, Text} from 'react-native';
import { connect } from 'react-redux';

import MazeContainer from './maze_container';
import {Scene, Router} from 'react-native-router-flux';

class RIAMMonitorApp extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }

  render() {

    const { state, actions } = this.props;


    return <Router duration={400}>
      <Scene key="root">
        <Scene key="maze_container" component={MazeContainer} initial={true} hideNavBar title="RIAM Monitor"/>
      </Scene>
    </Router>
  }
}

export default RIAMMonitorApp;
