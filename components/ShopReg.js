import React from 'react';
import ReactDom from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import axios from 'axios';

import Header from './Header';
//import mainConfig from '../config/main-config';

/* FIN DE IMPORTS -------------------------------------------------------------------------------------- */

const EMPTY_CALLBACK = () => { };

const ShopReg = React.createClass({
    getInitialState: function () {
        return {
            username: '',
            password: '',
            errMsg: null,
        };
    },

    getDefaultProps: function () {
        return { onSubmit: EMPTY_CALLBACK };
    },

    submitForm: function () {
        const username = this.state.username;
        const password = this.state.password;

        //hago encoding base64 para pasar las credenciales
        const encoded = btoa(username + ':' + password);

        axios({
            method: 'post', //you can set what request you want to be
            url: '/api/v1/admin/login',
            headers: { Authorization: 'Basic ' + encoded }
        })
            .then(contents => {
                console.log('Contenido:');
                console.log(contents.data);
                this.props.onSubmit(contents.data.token);
            })
            .catch(cause => {
                console.error('Error');
                this.setState({ errMsg: 'Credenciales invalidas' });
            });
    },

    handleKeyPress: function (event) {
        if (event.key == 'Enter') this.submitForm();
    },

    render: function () {
        console.log('RENDERING SHOPREG');
        let msgElem = this.state.errMsg ? <p style={{ color: 'red' }} >{this.state.errMsg}</p> : <div />;

        return (
            <div onKeyPress={this.handleKeyPress}>
                <Header title="Registro de comercio" />
                {msgElem}
                <MuiThemeProvider>
                    <Card>
                        <CardHeader
                            title="Validar registro"
                            subtitle='Ingrese credenciales' />;

                        <CardText expandable={false}>
                            <TextField
                                name="username"
                                hint="username"
                                floatingLabelText="username"
                                value={this.state.username}
                                onChange={e => this.setState({ username: e.target.value })} /><br />

                            <TextField
                                name="password"
                                hintText="Password"
                                floatingLabelText="Password"
                                type="password"
                                value={this.state.password}
                                onChange={e => this.setState({ password: e.target.value })} /><br />
                        </CardText>

                        <CardActions>
                            <FlatButton label="Iniciar sesion" onClick={this.submitForm} />
                        </CardActions>
                    </Card>

                </MuiThemeProvider >
            </div>
        );
    }
});

ReactDom.render(
    <ShopReg />,
    document.getElementById('root')
);