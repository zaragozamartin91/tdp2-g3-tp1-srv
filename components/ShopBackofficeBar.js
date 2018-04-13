import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


function SubMenu(props) {
    return <IconMenu
        iconButtonElement={
            <IconButton ><MoreVertIcon
                className='submenu-svg'
                style={{ color: 'white', fill: 'white' }} />
            </IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>

        <MenuItem primaryText="Cerrar sesion" onClick={props.onLogout} />
    </IconMenu>;
}

SubMenu.muiName = 'IconMenu';

const ShopBackofficeBar = React.createClass({
    getInitialState() {
        return {
            drawerOpen: false
        };
    },

    getDefaultProps() {
        return {
            onLogout: () => { }
        };
    },

    closeDrawer() {
        this.setState({ drawerOpen: false });
    },

    toggleDrawer() {
        const drawerOpen = !this.state.drawerOpen;
        this.setState({ drawerOpen });
    },

    render() {
        return (
            <div >
                <AppBar
                    onLeftIconButtonTouchTap={this.toggleDrawer}
                    iconElementRight={<SubMenu onLogout={this.props.onLogout} />}
                    title="Administracion comercio" />

                <Drawer open={this.state.drawerOpen} docked={false} onRequestChange={open => this.setState({ drawerOpen: open })} >
                    <Link to="/index" onClick={this.closeDrawer}><MenuItem >Principal</MenuItem></Link>

                </Drawer>
            </div >
        );
    }
});

export default ShopBackofficeBar;