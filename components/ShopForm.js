import React from 'react';

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

import axios from 'axios';

import Header from './Header';

/* FIN DE IMPORTS -------------------------------------------------------------------------------------- */

const ShopForm = React.createClass({
    getDefaultProps() {
        return { token: '' };
    },

    getInitialState() {
        return {
            msgSnackbarOpen: false,
            name: '',
            address: '',
            phone: '',
            zone: 1,
            districts: null
        };
    },

    componentDidMount() {
        console.log('token: ' + this.props.token);
        axios.get('/api/v1/districts')
            .then(response => this.setState({ districts: response.data.districts }));
    },

    openSnackbar(msg) {
        console.log('Abriendo snack bar');
        this.setState({ msgSnackbarOpen: true, snackbarMessage: msg });
    },

    handleSnackbarRequestClose() {
        this.setState({ msgSnackbarOpen: false });
    },

    handleShopCreateSuccess(data) {
        const shopId = data.shop.id;
        this.openSnackbar(`Comercio ${shopId} creado`);
    },

    handleShopCreateError(cause) {
        this.openSnackbar(cause.response.data.message);
    },

    checkFields() {
        const { name, address, phone, zone } = this.state;
        if (!name || !address || !phone || !zone) return { ok: false, msg: 'Parametros incompletos' };
        else return { ok: true };
    },

    createShop() {
        const fieldsCheck = this.checkFields();
        if (!fieldsCheck.ok) return this.openSnackbar(fieldsCheck.msg);

        const { name, address, phone, zone } = this.state;
        const zoneObj = this.state.districts.find(d => d.id == zone);
        /* TODO : POR AHORA SE GUARDA LA ZONA COMO UN VARCHAR. LA MISMA DEBERIA GUARDARSE COMO UN ID DE DISTRITO */
        const body = { name, address, phone, zone: zoneObj.name };
        const config = { headers: { 'Authorization': `Bearer ${this.props.token}` } };
        axios.post('/api/v1/shops', body, config)
            .then(contents => {
                console.log(contents.data);
                this.handleShopCreateSuccess(contents.data);
            }).catch(cause => {
                console.error(cause);
                this.handleShopCreateError(cause);
            });
    },

    handleZoneChange(event, index, value) {
        this.setState({ zone: value });
    },

    render() {
        // si los distritos no fueron cargados, entonces se indica al usuario que debe esperar
        if (!this.state.districts) return <span>Espere...</span>;

        const districtMenuItems = [];
        this.state.districts.forEach(district => districtMenuItems.push(
            <MenuItem value={district.id} primaryText={district.name} />
        ));

        return (
            <div style={{ paddingBottom: 10, backgroundColor: 'rgba(255,255,255,0.7)' }}>
                <div style={{ margin: 20 }}>
                    <h1>Nuevo comercio</h1>
                    <hr />

                    <h2>Datos del comercio</h2>

                    <TextField
                        name="Nombre"
                        hint="Nombre"
                        floatingLabelText="Nombre"
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })} /><br />

                    <TextField
                        name="Direccion"
                        hint="Direccion"
                        floatingLabelText="Direccion"
                        value={this.state.address}
                        onChange={e => this.setState({ address: e.target.value })} /><br />

                    <DropDownMenu
                        value={this.state.zone}
                        onChange={this.handleZoneChange}
                        openImmediately={false}
                        style={{ width: 200, padding: 0 }}>
                        {districtMenuItems}
                    </DropDownMenu> <br />

                    <TextField
                        name="Telefono"
                        hint="Telefono sin guion ni espacios"
                        floatingLabelText="Telefono"
                        value={this.state.phone}
                        onChange={e => this.setState({ phone: e.target.value })}
                        type='number' /><br />

                    <hr />

                    <h2>Datos del administrador del comercio</h2>

                    <TextField
                        name="Nombre"
                        hint="Nombre"
                        floatingLabelText="Nombre"
                        value={this.state.adminName}
                        onChange={e => this.setState({ adminName: e.target.value })} /><br />

                    <TextField
                        name="Email"
                        hint="Email"
                        floatingLabelText="Email"
                        value={this.state.adminEmail}
                        onChange={e => this.setState({ adminEmail: e.target.value })} /><br />

                    <RaisedButton style={{ marginTop: 20 }} label="Crear comercio" onClick={this.createShop} secondary={true} />

                </div>

                <Snackbar
                    open={this.state.msgSnackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={3000}
                    onRequestClose={this.handleSnackbarRequestClose} />
            </div>
        );
    }
});

export default ShopForm;