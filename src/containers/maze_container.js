'use strict';

import React, {Component} from 'react';

import {
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Modal,
    ActivityIndicator,
    Image
} from 'react-native';
import Toast from '@remobile/react-native-toast'
import BluetoothSerial from 'react-native-bluetooth-serial'
import { Buffer } from 'buffer'
global.Buffer = Buffer
import Base64 from 'js-base64';


import * as maze_actions from '../actions/maze_actions';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        backgroundColor: '#F5FCFF'
    },
    topBar: {
        height: 56,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' ,
        elevation: 6,
        backgroundColor: '#7B1FA2'
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'center',
        color: '#FFFFFF'
    },
    enableInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tab: {
        alignItems: 'center',
        flex: 0.5,
        height: 56,
        justifyContent: 'center',
        borderBottomWidth: 6,
        borderColor: 'transparent'
    },
    connectionInfoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25
    },
    connectionInfo: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 18,
        marginVertical: 10,
        color: '#238923'
    },
    listContainer: {
        borderColor: '#ccc',
        borderTopWidth: 0.5
    },
    listItem: {
        flex: 1,
        height: 48,
        paddingHorizontal: 16,
        borderColor: '#ccc',
        borderBottomWidth: 0.5,
        justifyContent: 'center'
    },
    fixedFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ddd'
    },
    button: {
        height: 36,
        margin: 5,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#7B1FA2',
        fontWeight: 'bold',
        fontSize: 14
    },
    buttonRaised: {
        backgroundColor: '#7B1FA2',
        borderRadius: 2,
        elevation: 2
    }
})

const Button = ({ title, onPress, style, textStyle }) =>
    <TouchableOpacity style={[ styles.button, style ]} onPress={onPress}>
      <Text style={[ styles.buttonText, textStyle ]}>{title.toUpperCase()}</Text>
    </TouchableOpacity>



class MazeContainer extends Component {

  constructor(props) {
    super(props);
      this.state = {
          isEnabled: false,
          discovering: false,
          devices: [],
          unpairedDevices: [],
          connected: false,
          section: 0,
          device: {id: "00:0A:3A:6F:45:91", name: "RIAM1"}
      }
  }

    componentWillMount () {
        Promise.all([
            BluetoothSerial.isEnabled(),
            BluetoothSerial.list()
        ])
            .then((values) => {
                const [ isEnabled, devices ] = values
                this.setState({ isEnabled, devices })
            })

        BluetoothSerial.on('data', (data) => { console.log(data); });


        BluetoothSerial.on('bluetoothEnabled', () => Toast.showShortBottom('Bluetooth enabled'))
        BluetoothSerial.on('bluetoothDisabled', () => Toast.showShortBottom('Bluetooth disabled'))
        BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
        BluetoothSerial.on('connectionLost', () => {
            if (this.state.device) {
                Toast.showShortBottom(`Connection to device ${this.state.device.name} has been lost`)
            }
            this.setState({ connected: false })
        })
    }

    /**
     * [android]
     * request enable of bluetooth from user
     */
    requestEnable () {
        BluetoothSerial.requestEnable()
            .then((res) => this.setState({ isEnabled: true }))
            .catch((err) => Toast.showShortBottom(err.message))
    }

  componentDidMount() {

  }


  componentWillUnmount() {

  }



    /**
     * [android]
     * enable bluetooth on device
     */
    enable () {
        BluetoothSerial.enable()
            .then((res) => this.setState({ isEnabled: true }))
            .catch((err) => Toast.showShortBottom(err.message))
    }

    /**
     * [android]
     * disable bluetooth on device
     */
    disable () {
        BluetoothSerial.disable()
            .then((res) => this.setState({ isEnabled: false }))
            .catch((err) => Toast.showShortBottom(err.message))
    }

    /**
     * [android]
     * toggle bluetooth
     */
    toggleBluetooth (value) {
        if (value === true) {
            this.enable()
        } else {
            this.disable()
        }
    }

    /**
     * [android]
     * Discover unpaired devices, works only in android
     */
    discoverUnpaired () {
        if (this.state.discovering) {
            return false
        } else {
            this.setState({ discovering: true })
            BluetoothSerial.discoverUnpairedDevices()
                .then((unpairedDevices) => {
                    this.setState({ unpairedDevices, discovering: false })
                })
                .catch((err) => Toast.showShortBottom(err.message))
        }
    }

    /**
     * [android]
     * Discover unpaired devices, works only in android
     */
    cancelDiscovery () {
        if (this.state.discovering) {
            BluetoothSerial.cancelDiscovery()
                .then(() => {
                    this.setState({ discovering: false })
                })
                .catch((err) => Toast.showShortBottom(err.message))
        }
    }

    /**
     * [android]
     * Pair device
     */
    pairDevice (device) {
        BluetoothSerial.pairDevice(device.id)
            .then((paired) => {
                if (paired) {
                    Toast.showShortBottom(`Device ${device.name} paired successfully`)
                    const devices = this.state.devices
                    devices.push(device)
                    this.setState({ devices, unpairedDevices: this.state.unpairedDevices.filter((d) => d.id !== device.id) })
                } else {
                    Toast.showShortBottom(`Device ${device.name} pairing failed`)
                }
            })
            .catch((err) => Toast.showShortBottom(err.message))
    }

    /**
     * Connect to bluetooth device by id
     * @param  {Object} device
     */
    connect (device) {
        this.setState({ connecting: true })
        BluetoothSerial.connect(device.id)
            .then((res) => {
                Toast.showShortBottom(`Connected to device ${device.name}`)
                this.setState({ device, connected: true, connecting: false })

            })
            .catch((err) => Toast.showShortBottom(err.message))
    }

    execute_command(tag){
        this.write(JSON.stringify({tag: tag, value: 2}));
    }

    /**
     * Disconnect from bluetooth device
     */
    disconnect () {
        BluetoothSerial.disconnect()
            .then(() => this.setState({ connected: false }))
            .catch((err) => Toast.showShortBottom(err.message))
    }

    /**
     * Toggle connection when we have active device
     * @param  {Boolean} value
     */
    toggleConnect (value) {
        if (value === true && this.state.device) {
            this.connect(this.state.device)
        } else {
            this.disconnect()
        }
    }

    /**
     * Write message to device
     * @param  {String} message
     */
    write (message) {
        if (!this.state.connected) {
            Toast.showShortBottom('You must connect to device first')
        }

        BluetoothSerial.write(message)
            .then((res) => {
                Toast.showShortBottom('Successfuly wrote to device')
                this.setState({ connected: true })
            })
            .catch((err) => Toast.showShortBottom(err.message))
    }

    onDevicePress (device) {
        if (this.state.section === 0) {
            this.connect(device)
        } else {
            this.pairDevice(device)
        }
    }

    writePackets (message, packetSize = 64) {
        const toWrite = Base64.encode(message)
        const writePromises = []
        const packetCount = Math.ceil(toWrite.length / packetSize)

        for (var i = 0; i < packetCount; i++) {
            const packet = new Buffer(packetSize)
            packet.fill(' ')
            toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize)
            writePromises.push(BluetoothSerial.write(packet))
        }

        Promise.all(writePromises)
            .then((result) => {
            })
    }

    render () {
        const activeTabStyle = { borderBottomWidth: 6, borderColor: '#009688' }
        return (
            <View style={{ flex: 1 }}>
              <View style={styles.topBar}>
                <Text style={styles.heading}>RIAM Monitor</Text>
                  {Platform.OS === 'android'
                      ? (
                          <View style={styles.enableInfoWrapper}>
                            <Text style={{ fontSize: 12, color: '#FFFFFF' }}>
                                {this.state.isEnabled ? 'disable' : 'enable'}
                            </Text>
                            <Switch
                                onValueChange={this.toggleBluetooth.bind(this)}
                                value={this.state.isEnabled} />
                          </View>
                      ) : null}
              </View>

                {Platform.OS === 'android'
                    ? (
                        <View style={[styles.topBar, { justifyContent: 'center', paddingHorizontal: 0 }]}>
                          <TouchableOpacity style={[styles.tab, this.state.section === 0 && activeTabStyle]} onPress={() => this.setState({ section: 0 })}>
                            <Text style={{ fontSize: 14, color: '#FFFFFF' }}>SETTINGS</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.tab, this.state.section === 1 && activeTabStyle]} onPress={() => this.setState({ section: 1 })}>
                            <Text style={{ fontSize: 14, color: '#FFFFFF' }}>MAZE</Text>
                          </TouchableOpacity>
                        </View>
                    ) : null}



              <View style={{ alignSelf: 'flex-end', flex: 1}}>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.fixedFooter}>
                    {Platform.OS === 'android' && this.state.section === 0
                        ? (
                            <View style={{flex: 1}}>
                                <Button
                                    title={this.state.discovering ? '... Connecting' : 'CONNECT'}
                                    onPress={() => this.connect(this.state.device)} />

                                <Button
                                    title='MOVE FORWARD'
                                    onPress={() => this.execute_command('MOVE_FORWARD')} />

                                <Button
                                    title='MOVE BACKWARDS'
                                    onPress={() => this.execute_command('MOVE_BACKWARDS')} />

                                <Button
                                    title='ACT'
                                    onPress={() => this.execute_command('ACT')} />
                            </View>



                        ) : null}
                    {Platform.OS === 'android' && !this.state.isEnabled
                        ? (
                            <Button
                                title='Request enable'
                                onPress={() => this.requestEnable()} />
                        ) : null}
                </ScrollView>
              </View>
            </View>
        )
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
