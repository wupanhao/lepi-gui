const express = require('express');
const path = require('path');
const fs = require('fs')
const os = require('os')
const uuid = require('uuid');
const ChildProcess = require('child_process');

const decodeBody = (str) => Buffer.from(str, 'base64').toString('utf8');
const decodeImage = (str) => Buffer.from(str, 'base64');

function mkdirIfNotExists(target_dir) {
    if (!fs.existsSync(target_dir)) {
        fs.mkdirSync(target_dir);
    }
}

const dataDir = path.join(os.homedir(), 'Lepi_Data', 'backpack')

mkdirIfNotExists(dataDir)

function saveBackpack(payload) {
    let body = decodeBody(payload.body)
    let image = decodeImage(payload.thumbnail)
    let id = uuid.v5(image, uuid.v5.URL)
    mkdirIfNotExists(path.join(dataDir, id))
    let bodyFile = path.join(id, 'body.json')
    let imageFile = path.join(id, 'thumbnail.jpeg')
    fs.writeFileSync(path.join(dataDir, bodyFile), body)
    fs.writeFileSync(path.join(dataDir, imageFile), image)
    return {
        body: bodyFile,
        id: id,
        mime: payload.mime,
        name: id,
        thumbnail: imageFile,
        type: payload.type
    }
}

function getBackpackList(limit = 20, offset = 0) {
    let list = fs.readdirSync(dataDir)
    return list.map(item => {
        return {
            body: path.join(item, 'body.json'),
            id: item,
            mime: "application/json",
            name: item,
            thumbnail: path.join(item, 'thumbnail.jpeg'),
            type: 'script'
        }
    }).slice(offset, limit + offset)
}

const router = express.Router();

router.use('/', express.static(dataDir))

router.get('/backpack', (req, res) => {
    let query = req.query
    let limit = query.limit ? parseInt(query.limit) : 20
    let offset = query.offset ? parseInt(query.offset) : 0
    res.json(getBackpackList(limit, offset))
})

router.post('/backpack', (req, res) => {
    let payload = req.body
    if (payload.type == "script") {
        res.json(saveBackpack(payload))
    } else {
        res.end()
    }
})
const uuidRegexp = /^\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12})$/i
router.delete('/backpack/:id', (req, res) => {
    let id = req.params.id
    let dir = path.join(dataDir, id)
    console.log(id)
    try {
        ChildProcess.execSync(`rm -rf ${dir}`)
    } catch (error) {
        console.log(error)
    }
    res.json({ "ok": true })
    console.log(`${id} is deleted!`);
})

module.exports = router