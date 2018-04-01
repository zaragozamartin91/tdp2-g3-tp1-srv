import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import axios from 'axios';

import Header from './Header';

/* FIN DE IMPORTS -------------------------------------------------------------------------------------- */

const EMPTY_CALLBACK = () => { };

const ShopForm = React.createClass({
    getDefaultProps() {
        return { token: '' };
    },

    getInitialState() {
        return {
            msgSnackbarOpen: false,
            name: '',
        };
    },

    componentDidMount() {
        console.log('token: ' + this.props.token);
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
        const { name } = this.state;
        if ( !name ) return { ok: false, msg: 'Parametros incompletos' };
        return { ok: true };
    },

    createShop() {
        const fieldsCheck = this.checkFields();
        if (!fieldsCheck.ok) return this.openSnackbar(fieldsCheck.msg);

        const {  name } = this.state;
        const body = {  name };
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

    render() {

        return (
            <div>
                <Card style={{ backgroundColor: "rgba(255,255,255,0.7)" }} >
                    <CardHeader
                        title="Crear comercio"
                        subtitle="Vendedores de alimentos"
                    />
                    <CardText expandable={false}>
                        <TextField
                            name="Nombre"
                            hint="Nombre"
                            floatingLabelText="Nombre"
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })} /><br />
                        
                        <div style={{ margin: '10px' }}>
                        </div>
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Crear comercio" secondary={true} onClick={this.createShop} />
                    </CardActions>
                </Card>

                <Snackbar
                    open={this.state.msgSnackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={3000}
                    onRequestClose={this.handleSnackbarRequestClose}
                />
            </div>
        );
    }
});

export default ShopForm;