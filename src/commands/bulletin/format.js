const { Permissions } = require('discord.js');

module.exports.fn = (message, args) => args.join('_');
module.exports.options = {}
// module.exports = {
//     action(message, args) {

//     },
//     permission_level: Permissions.FLAGS.MANAGE_GUILD
// }