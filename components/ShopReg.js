import React from 'react';
import ReactDom from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import axios from 'axios';

import Header from './Header';

/* ESTE FRAGMENTO DE CODIGO ES REQUERIDO PARA LOS EVENTOS DE TIPO TOUCH O CLICK EN COMPONENTES MATERIAL-UI */
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


/* FIN DE IMPORTS -------------------------------------------------------------------------------------- */

const token = document.querySelector('#token').innerHTML;

const EMPTY_CALLBACK = () => { };

const ShopReg = React.createClass({
    getInitialState: function () {
        return {
            msgSnackbarOpen: false,
            snackbarMessage: '',
            myShop: {},
            myShopReady: false,
            weekstart: new Date(),
            weekfinish: new Date(),
            weekendstart: new Date(),
            weekendfinish: new Date(),
            foodtypes: null, // tipos de comida disponibles
            foodtype: 0 // id de tipo de comida
        };
    },

    componentDidMount() {
        console.log('token: ' + token);
        let myShop;
        axios.get(`/api/v1/shopadm/myshop?token=${token}`)
            .then(response => {
                console.log(`response.data.shop: ${JSON.stringify(response.data.shop)}`);
                myShop = response.data.shop;
                return axios.get('/api/v1/foodtypes');
            }).then(response => {
                console.log(`response.data.foodTypes: ${JSON.stringify(response.data.foodTypes)}`);
                this.setState({ myShop, myShopReady: true, foodtypes: response.data.foodTypes });
            })
            .catch(cause => {
                console.error(cause);
                this.openSnackbar('Error al cargar los datos del comercio');
            });
    },

    openSnackbar(msg) {
        console.log('Abriendo snack bar');
        this.setState({ msgSnackbarOpen: true, snackbarMessage: msg });
    },


    validateShop() {
        const foodtype = this.state.foodtypes.find(ft => ft.id == this.state.foodtype);
        axios.post(`/api/v1/shopadm/verify?token=${token}`).then(response => {
            this.openSnackbar('exito');
        }).catch(cause => console.error(cause));
    },

    render: function () {
        if (!this.state.foodtypes) return <span>Espere...</span>;

        const foodtypeItems = [<MenuItem value={0} primaryText='Tipo de comida' />];
        this.state.foodtypes.forEach(ft =>
            foodtypeItems.push(<MenuItem value={ft.id} primaryText={ft.foodtype} />));

        return (
            <MuiThemeProvider>
                <div style={{ paddingBottom: 10, backgroundColor: 'rgba(255,255,255,0.7)' }}>

                    <div style={{ margin: 20 }}>
                        <h1>Validacion de alta de comercio</h1>
                        <hr />

                        <h2>Datos basicos</h2>

                        <TextField
                            name="Nombre"
                            hint="Nombre"
                            floatingLabelText="Nombre"
                            value={this.state.myShop.name}
                            disabled={true} /><br />

                        <TextField
                            name="Direccion"
                            hint="Direccion"
                            floatingLabelText="Direccion"
                            value={this.state.myShop.address}
                            disabled={true} /><br />

                        <TextField
                            name="Latitud"
                            hint="Latitud"
                            floatingLabelText="Latitud"
                            value={this.state.myShop.lat}
                            disabled={true}
                            style={{ marginRight: 10 }} />

                        <TextField
                            name="Longitud"
                            hint="Longitud"
                            floatingLabelText="Longitud"
                            value={this.state.myShop.long}
                            disabled={true} /><br />

                        <TextField
                            name="Telefono"
                            hint="Telefono sin guion ni espacios"
                            floatingLabelText="Telefono"
                            value={this.state.myShop.phone}
                            disabled={true} /><br />

                        <hr />

                        <h2>Datos del menu</h2>

                        <DropDownMenu
                            value={this.state.foodtype}
                            onChange={(e, i, value) => this.setState({ foodtype: value })}
                            openImmediately={false}
                            style={{ width: 200, padding: 0 }}>
                            {foodtypeItems}
                        </DropDownMenu> <br />

                        <h3>Horario de dia de semana</h3>

                        <TimePicker
                            format="24hr"
                            hintText="Hora de apertura"
                            onChange={(e, d) => this.setState({ weekstart: d })}
                            autoOk={true} />

                        <TimePicker
                            format="24hr"
                            hintText="Hora de cierre"
                            onChange={(e, d) => this.setState({ weekfinish: d })}
                            autoOk={true} />

                        <br />

                        <h3>Horario de fines de semana</h3>

                        <TimePicker
                            format="24hr"
                            hintText="Hora de apertura"
                            onChange={(e, d) => this.setState({ weekendstart: d })}
                            autoOk={true} />

                        <TimePicker
                            format="24hr"
                            hintText="Hora de cierre"
                            onChange={(e, d) => this.setState({ weekendfinish: d })}
                            autoOk={true} />

                        <hr />

                        <h2>Credenciales del administrador</h2>

                        <TextField
                            name="Email"
                            hint="Email"
                            floatingLabelText="Email"
                            value={this.state.adminEmail}
                            onChange={e => this.setState({ adminEmail: e.target.value })} /><br />

                        <TextField
                            name="Password"
                            hint="Password"
                            floatingLabelText="Password"
                            value={this.state.adminPassword}
                            onChange={e => this.setState({ adminPassword: e.target.value })}
                            type='password' /><br />


                        <RaisedButton
                            style={{ marginTop: 20 }}
                            label="Todo bien"
                            onClick={this.validateShop}
                            secondary={true}
                            style={{ marginRight: 10 }}
                            disabled={!this.state.myShopReady} />
                        <RaisedButton
                            style={{ marginTop: 20 }}
                            label="Algo esta mal"
                            disabled={!this.state.myShopReady} />

                    </div>

                    <Snackbar
                        open={this.state.msgSnackbarOpen}
                        message={this.state.snackbarMessage}
                        autoHideDuration={3000}
                        onRequestClose={this.handleSnackbarRequestClose} />
                </div>

            </MuiThemeProvider >
        );
    }
});

ReactDom.render(
    <ShopReg />,
    document.getElementById('root')
);