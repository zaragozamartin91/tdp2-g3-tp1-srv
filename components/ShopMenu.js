import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';

import ActionHeader from './ActionHeader';

function ShopMenu(props) {
    const menu = props.menu;

    const menuCards = menu.map(item => {
        const dish = item.dish;
        return (
            <Card style={{ backgroundColor: "rgba(255,255,255,0.7)" }} >
                <CardHeader
                    title={`Plato ${dish.id}`}
                    subtitle={dish.name} />
                <CardText expandable={false}>
                    <p><strong>Descripcion:</strong> {dish.description} </p>
                    <p><strong>Costo:</strong> {dish.cost} </p>
                </CardText>
            </Card>
        );
    });

    return <div>
        <ActionHeader onClick={props.goBack} />
        {menuCards}
    </div>;
}

export default ShopMenu;