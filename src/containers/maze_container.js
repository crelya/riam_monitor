'use strict';

import React, {Component} from 'react';

import {View, Text, Button, StatusBar, PermissionsAndroid, Platform, StyleSheet, ActivityIndicator} from 'react-native';
import * as maze_actions from '../actions/maze_actions';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
      flex: 1
  },
});


class MazeContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }


  componentWillUnmount() {

  }



  render() {

    return (
          <View style={styles.container}>
            <Text>RIAM Monitor</Text>
          </View>
    );
  }
}

function mapStateToProps(state) {
  const {connected} = state.maze_reducer
  return {
    connected: connected
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MazeContainer);
