import React from 'react';

/** Componente indice de administracion de HOY COMO */
const AdminIndex = React.createClass({
    render: function () {
        return (
            <div className="with-margin index">
                <h1>Administracion de HOY COMO</h1>
                <h2>Configuracion y estadisticas</h2>
                <p>Desde aqui es posible monitorear a los usuarios registrados y comercios 
                    asociados a la aplicacion.
                </p>
            </div>
        );
    }
});

export default AdminIndex;