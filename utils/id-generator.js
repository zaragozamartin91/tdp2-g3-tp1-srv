//const defaultPrefix = 'ID';

/**
 * Genera un id pseudoaleatorio (ej: martin-12343).
 * @param {string} prefix Prefijo del id.
 * @return {string} Id generado.
 */
function generateId(prefix) {
    return prefix.replace(/ +/g, '').toLowerCase();
}
//function generateId(prefix, limit = 100000) {
//    prefix = prefix || defaultPrefix;
//    prefix = prefix.replace(/ +/g, '');
//    return `${prefix}-${Math.floor(Math.random() * limit).toString()}`;
//}

function generateApplicationUserId(applicationOwner, username) {
    return `${applicationOwner}-${generateId(username)}`;
}

exports.generateId = generateId;
exports.generateApplicationUserId = generateApplicationUserId;
//exports.defaultPrefix = defaultPrefix;