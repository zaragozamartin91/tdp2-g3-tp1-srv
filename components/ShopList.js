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

function BanShopDialog(props) {
    function banShop() {
        const shopId = props.shop.id;
        props.shop.enabled = false;
        axios({
            url: `/api/v1/shops/${shopId}`,
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${props.token}` },
            data: props.shop 
        }).then(contents => {
            console.log(contents.data);
            props.onSuccess();
        }).catch(cause => {
            console.error(cause);
            props.onError();
        });
    }

    const actions = [
        <FlatButton
            label="Cancelar"
            primary={true}
            onClick={props.onClose}
        />,
        <FlatButton
            label="Banear"
            primary={true}
            onClick={banShop}
        />,
    ];

    return (
        <Dialog
            title={`Banear comercio ${props.shop.id}`}
            actions={actions}
            modal={true}
            open={props.open}>
            ¿Desea banear el comercio?
        </Dialog>
    );
}

const ShopList = React.createClass({
    getDefaultProps() {
        return { token: '' };
    },

    getInitialState() {
        return {
            shops: [],
            errSnackbarOpen: false,
            banShop: null
        };
    },

    loadShops() {
        axios.get(`/api/v1/shops?token=${this.props.token}`)
            .then(contents => {
                const shops = contents.data.shops;
                console.log('loadShops shops: ' + shops);
                console.log('shops:');
                console.log(shops);
                this.setState({ shops });
            })
            .catch(cause => {
                console.error(cause);
                this.openErrSnackbar('Error al obtener los comercios');
            });
    },

    componentDidMount() {
        console.log('token: ' + this.props.token);
        this.loadShops();
        console.log('ShopList DID MOUNT');
    },

    openErrSnackbar(msg) {
        console.log('Abriendo snack bar');
        this.setState({ errSnackbarOpen: true, errSnackbarMessage: msg });
    },

    handleErrSnackbarRequestClose() {
        this.setState({ errSnackbarOpen: false });
    },

    closeBanDialog(shop) {
        const self = this;
        return function () {
            self.setState({ banShop: null });
        };
    },

    openBanDialog(shop) {
        const self = this;
        return function () {
            const shopId = shop.id || shop;
            self.setState({ banShop: shopId });
        };
    },

    handleShopBanSuccess(shop) {
        const self = this;
        return function () {
            self.closeBanDialog(shop)();
            self.loadShops();
            self.openErrSnackbar('Comercio baneado');
        };
    },

    render() {
        console.log("this.state.shops: " + this.state.shops);

        if (this.state.shops.length == 0) {
            return <div>No hay comercios...</div>;
        }

        let banShopDialog = null;
        if (this.state.banShop) {
            console.log('Creando dialogo de baneo');
            const shop = this.state.shops.find(s => s.id == this.state.banShop);
            banShopDialog = <BanShopDialog
                shop={shop}
                token={this.props.token}
                open={true}
                onSuccess={this.handleShopBanSuccess(shop)}
                onClose={this.closeBanDialog(shop)}
                onError={() => this.openErrSnackbar(`Error al banear el comercio ${shop.id}`)} />;
        }

        const shopCards = this.state.shops.map(shop => {
            const backColors = ['#1A9386', 'rgb(21, 114, 105)', '#134E48'];
            let colIdx = 0;
            
            return (<Card style={{ backgroundColor: "rgba(255,255,255,0.7)" }} >
                <CardHeader
                    title={shop.id}
                    subtitle={shop.name}
                />
                <CardText expandable={false}>
                    Nombre: {shop.name} <br />
                    Direccion: {shop.address} <br />
                    Telefono: {shop.phone} <br />
                </CardText>
                <CardActions>
                    <FlatButton label="Banear" secondary={true} onClick={this.openBanDialog(shop)} />
                </CardActions>
            </Card>);
        });

        const mainElem = banShopDialog || shopCards;

        return (
            <div >
                {mainElem}
                <Snackbar
                    open={this.state.errSnackbarOpen}
                    message={this.state.errSnackbarMessage}
                    autoHideDuration={3000}
                    onRequestClose={this.handleErrSnackbarRequestClose}
                />
            </div >
        );
    },

});

export default ShopList;