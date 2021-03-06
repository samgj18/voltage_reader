import React, { Component } from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast'
import PreLoader from '../Components/PreLoader'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Icon } from 'react-native-elements'
import { AreaChart, XAxis, YAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'

import { fetchDataFromServer, calculateLifeExpansionBatery } from '../BleModule/BleUtils'

class Batery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDateTimePickerVisible: false,
            isTimePickerVisible: false,
            initialTimePicked: '',
            endTimePicked: '',
            initialDatePicked: '',
            endDatePicked: '',
            completeDate: '',
            header: 'Selecciona la fecha inicial',
            bateryExtension: null,
            bateryEnergy: null
        }
        this.counter = 0
    }
    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    showTimePicker = () => {
        this.setState({ isTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    hideTimePicker = () => {
        this.setState({ isTimePickerVisible: false });
    };

    handleDateRange = (date) => {
        if (this.counter === 0) {
            this.setState({
                initialDatePicked: date,
                header: 'Selecciona la fecha final'
            }, () => {
                console.log(this.state.initialDatePicked)
                this.counter = this.counter + 1
                this.showDateTimePicker()
                this.refs.toast.show('Selecciona fecha final', DURATION.LENGTH_SHORT)
            })
        } else {
            this.setState({
                endDatePicked: date,
                header: '¡Selecciona la hora con el botón de al lado!'
            }, () => {
                console.log(this.state.endDatePicked)
                console.log(this.counter)
                this.counter = 0
            })
        }
    }

    handleDatePicked = (datetime) => {
        let curr_date = datetime.getDate();
        let curr_month = datetime.getMonth() + 1;
        let curr_year = datetime.getFullYear();
        let mydatestr = curr_year + ',' +
            curr_month + ',' +
            curr_date
        this.setState({
            header: 'Seleccione la fecha inicial'
        }, () => {
            this.hideDateTimePicker()
            this.handleDateRange(mydatestr)
        })
    }


    handleTimeRange = (time) => {
        if (this.counter === 0) {
            this.setState({
                initialTimePicked: time,
                header: 'Selecciona la hora final'
            }, () => {
                console.log(this.state.initialTimePicked)
                this.counter = this.counter + 1
                this.showTimePicker()
                this.refs.toast.show('Selecciona hora final', DURATION.LENGTH_SHORT)
            })
        } else {
            this.setState({
                endTimePicked: time,
                header: '¡Realiza la consulta con el botón de abajo!'
            }, () => {
                console.log(this.state.endTimePicked)
                this.hideTimePicker()
                this.counter = 0
                this.setState({
                    completeDate: `${this.state.initialDatePicked},${this.state.initialTimePicked}-${this.state.endDatePicked},${this.state.endTimePicked}`
                }, () => {
                    console.log(this.state.completeDate)
                })
            })
        }
    }

    handleTimePicked = (datetime) => {
        let curr_hour = datetime.getHours();
        let curr_min = datetime.getMinutes();
        let curr_sec = datetime.getSeconds();
        let mydatestr = curr_hour + ',' +
            curr_min + ',' +
            curr_sec
        this.setState({
            header: 'Seleccione la hora inicial'
        }, () => {
            this.hideTimePicker()
            this.handleTimeRange(mydatestr)
        })
    }

    handleDataFetch = async (completeDate) => {
        if (completeDate != '') {
            const response = await fetchDataFromServer(this.props.token,
                `http://72.14.177.247/voltages/current-user/?q=${completeDate}`)
            const bateryLifeExtension = calculateLifeExpansionBatery(response[0], response[1])
            console.log(bateryLifeExtension)
            this.setState({
                bateryExtension: bateryLifeExtension[0] / 1000000,
                bateryEnergy: bateryLifeExtension[1] / 1000000
            }, () => {
                if (this.state.bateryExtension != null) {
                    this.refs.toast.show('Datos obtenidos exitosamente', DURATION.LENGTH_SHORT)
                } else {
                    this.refs.toast.show('No pudimos obtener los datos', DURATION.LENGTH_SHORT)
                }
            })
        }
        this.refs.toast.show('Seleccione un fecha válida', DURATION.LENGTH_SHORT)
    }




    render() {

        const { completeDate } = this.state
        if (this.props.loading) {
            return (
                <PreLoader />
            )
        } else {
            return (
                <View style={styles.MainContainer}>
                    <View style={styles.Historics}>
                        <Text h3
                            style={{ textAlign: 'center' }}
                        >Extensión vida útil de la batería</Text>
                        <Text> {this.state.header} </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon
                                reverse
                                name='calendar'
                                type='font-awesome'
                                color='#1C1612'
                                onPress={this.showDateTimePicker}
                            />
                            <Icon
                                reverse
                                name='clock-o'
                                type='font-awesome'
                                color='#1C1612'
                                onPress={this.showTimePicker}
                            />
                        </View>
                    </View>
                    <View style={styles.Consulta}>
                        {this.state.bateryExtension != null ? (
                            <Text h4
                                style={{ textAlign: 'center' }}>La extensión de la vida útil de
                            la batería fue de {this.state.bateryExtension} segundos.</Text>
                        ) : null}
                        {this.state.bateryEnergy != null ? (
                            <Text h4
                                style={{ textAlign: 'center', paddingTop: 20 }}>La energía entregada
                            la batería fue de {this.state.bateryEnergy} Jules.</Text>
                        ) : null}
                        <Icon
                            reverse
                            name='send'
                            type='font-awesome'
                            color='#1C1612'
                            onPress={() => this.handleDataFetch(completeDate)} />
                    </View>

                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this.handleDatePicked}
                        onCancel={this.hideDateTimePicker}
                    />
                    <DateTimePicker
                        mode='time'
                        isVisible={this.state.isTimePickerVisible}
                        onConfirm={this.handleTimePicked}
                        onCancel={this.hideTimePicker}
                    />

                    <Toast
                        ref="toast"
                        style={{ backgroundColor: 'transparent' }}
                        position='top'
                        positionValue={200}
                        fadeInDuration={750}
                        fadeOutDuration={1000}
                        opacity={0.8}
                        textStyle={{ color: 'black' }}
                    />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 11
    },
    Historics: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50
    },
    Consulta: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    Charts: {
        flex: 1,
    }
});

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        id: state.auth.id,
        loading: state.auth.loading
    }
}


export default connect(mapStateToProps, null)(Batery)