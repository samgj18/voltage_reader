import React, { Component } from 'react';
import { Card, Button } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import Icon from 'react-native-vector-icons/FontAwesome';
import FormValidation from '../Utils/Validation';
import { connect } from 'react-redux';
import t from 'tcomb-form-native'
import BackgroundImage from '../Utils/BackgroundImage';
import LoginImage from '../Assets/Images/Register.png'
import * as  actions from '../Stores/Actions/auth'

const Form = t.form.Form;

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                email: '',
                password: '',
                id: ''
            }
        }

        this.name = t.refinement(t.String, (s) => {
            return s !== ""
        })

        this.user = t.struct({
            email: FormValidation.email,
            password: FormValidation.password,
        })
        this.options = {
            fields: {
                email: {
                    label: 'Correo',
                    help: 'Introduce un correo',
                    error: 'Introduce un correo válido',
                    autoCapitalize: 'none',
                },
                password: {
                    label: 'Contraseña',
                    help: 'Introduce una contraseña',
                    error: 'Introduce una contraseña válida',
                    password: true,
                    secureTextEntry: true,
                }
            }
        }
        this.validate = null;
    }

    /* tcomb-form-native is the library that allows us to create forms in a faster way only by setting the structure
    and the options of the form we want to create. In this particular case, we want a login form with Email & Pass */
    static navigationOptions = { title: 'Entrar' };

    gotoUserScreen = () => {
        this.props.navigation.navigate('LandScreen', {
            email: this.state.user.email,
        });
    }
    /* HomeScreen inheritance, no need of createSwitchNavigator or createStackNavigator. */

    async login() {
        if (this.validate) {
            this.props.onAuth(this.validate.email, this.validate.password);
        }
    }
    /* React Native provides the Fetch API for your networking needs. 
    Fetch will seem familiar if you have used XMLHttpRequest or other networking APIs before
    Fetch also takes an optional second argument that allows you to customize the HTTP request.
    You may want to specify additional headers, or make a POST request like the one is done here.  */

    onChange(user) {
        this.setState({ user });
        this.validate = this.refs.form.getValue();
    }

    /* This onChange function is the core of React concept, *states*. 
    There are two types of data that control a component: props and state. props are set by the parent 
    and they are fixed throughout the lifetime of a component. For data that is going to change, we have to use state.
    In general, you should initialize state in the constructor, and then call setState when you want to change it. */

    render() {
        return (
            <BackgroundImage source={LoginImage}>
                <Card
                    wrapperStyle={{ paddingLeft: 10 }}
                    title='Ingresa'
                >
                    <Form
                        ref="form"
                        type={this.user}
                        options={this.options}
                        onChange={(v) => this.onChange(v)}
                        value={this.state.user}
                    />
                    <Button
                        icon={
                            <Icon
                                name='sign-in'
                                size={30}
                                color='rgba(58, 227, 116, 0.7)'
                            />
                        }
                        title="Entrar"
                        onPress={this.login.bind(this)}
                        type='outline'
                        raised
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
                </Card>
            </BackgroundImage>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch(actions.authLogin(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)