import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import axios from 'axios';

import ShopBackofficeBar from './ShopBackofficeBar';
import ShopadmIndex from './ShopadmIndex';
import ShopadmLogin from './ShopadmLogin';

/* ESTE FRAGMENTO DE CODIGO ES REQUERIDO PARA LOS EVENTOS DE TIPO TOUCH O CLICK EN COMPONENTES MATERIAL-UI */
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
/* -------------------------------------------------------------------------------------------------------- */

console.log('Parseando cookie ' + document.cookie);
const cookie = document.cookie || '';
const cookieTokenStr = cookie.split('; ').find(s => s.startsWith('token='));
const cookieToken = cookieTokenStr ? cookieTokenStr.replace('token=', '') : null;

const ShopBackoffice = React.createClass({
    getInitialState() {
        return {
            token: null,
            user: null,
            renderReady: false
        };
    },

    componentDidMount() {
        /* SE CARGAN LAS CANCIONES DESPUES QUE EL COMPONENTE HAYA SIDO MONTADO */
        console.log('ShopBackoffice MONTADA!');
        /* Si se encuentra un token en las cookies entonces se setea el mismo y se obtiene el usuario
        Caso contrario, se marca al componente como listo para renderizar */
        if (cookieToken) this.setToken(cookieToken);
        else this.setState({ renderReady: true });
    },

    setToken(token) {
        token = token.token || token;
        console.log('Seteando token ' + token);

        this.setState({ token, renderReady: true });
    },

    render() {
        console.log('RENDERING ShopBackoffice!');

        //if (!this.state.renderReady) return (<span>Espere...</span>);

        const token = this.state.token;
        if (!token) return <ShopadmLogin onSubmit={this.setToken} />;

        console.log('window.location.hash: ' + window.location.hash);
        if (window.location.hash == '#/') {
            console.log('REPLACING LOCATION');
            window.location.replace('/shopadm#/index');
            //return <span>Redireccionando...</span>;
        }

        /* Si un usuario inicio sesion, renderizo la app normal */
        return (
            <MuiThemeProvider>
                <div>
                    <ShopBackofficeBar onLogout={() => this.logoutForm.submit()} />

                    <Route path="/index" component={ShopadmIndex} />

                    <form
                        action='/shopadm/logout'
                        method='POST'
                        ref={f => this.logoutForm = f}
                        style={{ display: 'hidden' }}>
                    </form>
                </div>
            </MuiThemeProvider>
        );
    }
});

ReactDom.render(
    <HashRouter>
        <ShopBackoffice />
    </HashRouter>,
    document.getElementById('root')
);

