import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import axios from 'axios';

import AdminBackofficeBar from './AdminBackofficeBar';
import AdminIndex from './AdminIndex';
import AdminLogin from './AdminLogin';
import Users from './Users';
import Servers from './Servers';
import ServerCreator from './ServerCreator';
import CreateUserForm from './CreateUserForm';
import Rules from './Rules';
import RuleCreator from './RuleCreator';

/* ESTE FRAGMENTO DE CODIGO ES REQUERIDO PARA LOS EVENTOS DE TIPO TOUCH O CLICK EN COMPONENTES MATERIAL-UI */
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
/* -------------------------------------------------------------------------------------------------------- */

console.log('Parseando cookie ' + document.cookie);
const cookie = document.cookie || '';
const cookieTokenStr = cookie.split('; ').find(s => s.startsWith('token='));
const cookieToken = cookieTokenStr ? cookieTokenStr.replace('token=', '') : null;

const AdminBackoffice = React.createClass({
    getInitialState: function () {
        return {
            token: null,
            user: null,
            renderReady: false
        };
    },

    componentDidMount: function () {
        /* SE CARGAN LAS CANCIONES DESPUES QUE EL COMPONENTE HAYA SIDO MONTADO */
        console.log('AdminBackoffice MONTADA!');
        /* Si se encuentra un token en las cookies entonces se setea el mismo y se obtiene el usuario
        Caso contrario, se marca al componente como listo para renderizar */
        if (cookieToken) this.setToken(cookieToken);
        else this.setState({ renderReady: true });
    },

    setToken: function (token) {
        token = token.token || token;
        console.log('Seteando token: ' + token);
        this.setState({ token,  renderReady: true });
        
    },

    render: function () {
        console.log('RENDERING AdminBackoffice!');

        //if (!this.state.renderReady) return (<span>Espere...</span>);

        const token = this.state.token;
        if (!token) return <AdminLogin onSubmit={this.setToken} />;

        console.log('window.location.hash: ' + window.location.hash);
        if (window.location.hash == '#/') {
            console.log('REPLACING LOCATION');
            window.location.replace('/admin#/index');
            //return <span>Redireccionando...</span>;
        }

        /* Si un usuario inicio sesion, renderizo la app normal */
        return (
            <MuiThemeProvider>
                <div>
                    <AdminBackofficeBar onLogout={() => this.logoutForm.submit()} />

                    <Route path="/index" component={AdminIndex} />

                    <Route path="/users/list" component={() => <Users token={token} />} />
                    <Route path="/users/create" component={() => <CreateUserForm token={token} />} />
                    
                    <Route path="/servers/list" component={() => <Servers token={token} />} />

                    <Route path="/rules/create" component={() => <RuleCreator token={token} />} />

                    <form
                        action='/admin/logout'
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
        <AdminBackoffice />
    </HashRouter>,
    document.getElementById('root')
);

