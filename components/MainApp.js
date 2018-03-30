import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import axios from 'axios';

import MainAppBar from './MainAppBar';
import Index from './Index';
import Login from './Login';
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

const MainApp = React.createClass({
    getInitialState: function () {
        return {
            token: null,
            user: null,
            renderReady: false
        };
    },

    componentDidMount: function () {
        /* SE CARGAN LAS CANCIONES DESPUES QUE EL COMPONENTE HAYA SIDO MONTADO */
        console.log('MainApp MONTADA!');
        /* Si se encuentra un token en las cookies entonces se setea el mismo y se obtiene el usuario
        Caso contrario, se marca al componente como listo para renderizar */
        if (cookieToken) this.setToken(cookieToken);
        else this.setState({ renderReady: true });
    },

    setToken: function (token) {
        token = token.token || token;
        console.log('Seteando token: ' + token);
        axios.get(`/api/v1/business-users/me?token=${token}`)
            .then(contents => {
                console.log(contents.data.businessUser);
                this.setState({ token, user: contents.data.businessUser, renderReady: true });
            })
            .catch(cause => {
                console.error(cause);
            });
    },

    render: function () {
        console.log('RENDERING MainApp!');

        if (!this.state.renderReady) return <span>Espere...</span>;

        const token = this.state.token;
        if (!token) return <Login onSubmit={this.setToken} />;

        const user = this.state.user;

        console.log('window.location.hash: ' + window.location.hash);
        if (window.location.hash == '#/') {
            console.log('REPLACING LOCATION');
            window.location.replace('/main#/index');
            //return <span>Redireccionando...</span>;
        }

        /* Si un usuario inicio sesion, renderizo la app normal */
        return (
            <MuiThemeProvider>
                <div>
                    <MainAppBar onLogout={() => this.logoutForm.submit()} />

                    <Route path="/users/list" component={() => <Users token={token} />} />
                    <Route path="/users/create" component={() => <CreateUserForm token={token} />} />
                    
                    <Route path="/servers/list" component={() => <Servers token={token} />} />
                    <Route path="/servers/create" component={() => <ServerCreator token={token} user={user} />} />
                    
                    <Route path="/index" component={Index} />

                    <Route path="/rules/list" component={() => <Rules token={token} user={user} />} />
                    <Route path="/rules/create" component={() => <RuleCreator token={token} />} />

                    <form
                        action='/logout'
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
        <MainApp />
    </HashRouter>,
    document.getElementById('root')
);

