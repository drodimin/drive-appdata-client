const { google } = require('googleapis');

module.exports = class Client {
    constructor(authClient, verbose = false) {
        ``;
        this._verbose = verbose;
        this._drive = google.drive({ version: 'v3', auth: authClient });
    }

    log(...args) {
        if (this._verbose) {
            console.log(...args);
        }
    }

    find(filename) {
        this.log("Find file", filename);
        return new Promise((resolve, reject) => {
            try {
                this._drive.files.list({
                    q: "name='" + filename + "'",
                    spaces: 'appDataFolder',
                    fields: 'nextPageToken, files(id, name)',
                })
                    .then(result => {
                        resolve(result.data.files);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    }

    list() {
        this.log("List all files");
        return new Promise((resolve, reject) => {
            try {
                this._drive.files.list({
                    spaces: 'appDataFolder',
                    fields: 'nextPageToken, files(id, name)',
                    pageSize: 1000
                })
                    .then(result => {
                        resolve(result.data.files);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                reject(error);
            }
        });
    }

    update(fileId, data) {
        this.log("Update file", fileId);
        return new Promise((resolve, reject) => {
            try {
                this._drive.files.update({
                    fileId,
                    media: {
                        mimeType: 'application/json',
                        body: data
                    }
                })
                    .then(file => resolve(file.data))
                    .catch(error => reject(error));
            } catch (error) {
                reject(error);
            }
        });
    }

    delete(fileId) {
        this.log("Delete file", fileId);
        return new Promise((resolve, reject) => {
            try {
                this._drive.files.delete({
                    fileId
                })
                    .then(() => resolve())
                    .catch(error => reject(error));
            } catch (error) {
                reject(error);
            }
        });
    }

    create(fileName, data) {
        this.log("Update file", fileName);
        return new Promise((resolve, reject) => {
            var fileMetadata = {
                'name': fileName,
                'parents': ['appDataFolder']
            };
            var media = {
                mimeType: 'application/json',
                body: data
            };
            try {
                this._drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                })
                    .then(file => resolve(file.data))
                    .catch(error => reject(error));
            } catch (error) {
                reject(error);
            }
        });
    }

    get(fileId) {
        console.log("Getting file", fileId);
        return new Promise((resolve, reject) => {
            try {
                this._drive.files.get({ fileId, alt: 'media' })
                    .then(file => resolve(file.data))
                    .catch(error => reject(error));
            } catch (error) {
                reject(error);
            }
        });
    }
};