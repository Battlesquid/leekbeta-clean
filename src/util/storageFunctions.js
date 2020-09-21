const firebase = require('./firebase.js');
const fetch = require('node-fetch');

module.exports = {
    async uploadFile(message, callback = () => { }) {
        try {
            const attachment = message.attachments.first();
            
            //get the attachment and type of attachment; rename the attachment in the format {guild id}{message id}{filetype}
            const type = attachment.url.match(/.*\.(png|jpeg|jpg|mp4|webp|gif)/i);
            if (type === null) return;
            attachment.name = `${message.guild.id}/${message.id}.${type[1]}`;

            //create a file in the storage bucket
            const file = firebase.storage.file(attachment.name);
            const writeStream = file.createWriteStream({ contentType: "auto", public: true });
            const res = await fetch(attachment.proxyURL);
            const upload = res.body.pipe(writeStream);
            upload.on("finish", () => { callback(message, attachment.name) });

        } catch (e) { console.log(e); }
    },
    getFile() {

    }
}