const http = require('http');
const https = require('https');
const Stream = require('stream').Transform;
const Jimp = require('jimp');

const WIDTH = 640;
const HEIGHT = 480;

async function crop(data) {
    const image = await Jimp.read(data);

    return image.contain(WIDTH, HEIGHT);
}

function passImage(url) {
    const client = url.toString().indexOf("https") === 0 ? https : http;

    return new Promise((resolve,reject) => {
        const request = client.request(url, (response) => {
            const data = new Stream();

            response.on('data', (chunk) => {
                data.push(chunk);
            });

            response.on('end', () => {
                try {
                    const image = crop(data.read());
                    resolve(image);
                } catch (e) {
                    console.log(e);
                    reject(e);
                }
            });
        }).end();

        request.on('error', (e) => {
            console.log(e);
            reject(e);
        })
    })
}

module.exports = passImage