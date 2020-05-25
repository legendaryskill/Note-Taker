// importing packages
const express = require("express");
const fs =  require("fs");
const app = express();
const path = require("path")
const { v4: uuidv4 } = require('uuid');

// setting up the port
var PORT = process.env.PORT || 8080

const db_path = path.join(__dirname, '/db/db.json')

// static files
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    let html = fs.readFileSync(path.join(__dirname , "/public/index.html"), "utf-8")
    res.send(html)
})

app.get('/notes', (req, res) => {
    // let html = fs.readFileSync(__dirname + "./public/notes.html", "utf-8")
    res.sendFile(path.join(__dirname , "/public/notes.html"))
})

app.get(`/api/notes`, (req, res) => {
    let notes = JSON.parse(fs.readFileSync(db_path))
    console.log(notes);
    res.json(notes)
})

app.post(`/api/notes`, (req, res) => {

    // let obj = {}

    // obj.id = uuidv4();

    // receive a new note (user input via form)
    let newNote = req.body

    newNote.id = uuidv4();
    // add it to the db.json file in object format
    let allNotes = JSON.parse(fs.readFileSync(db_path))
    allNotes.push(newNote)
    // json -- string looks like array/obj
    // stringify allNotes and update db.json file
    let updatedNotes = JSON.stringify(allNotes)
    fs.writeFileSync(db_path, updatedNotes)

    // return the newest note
    res.json(newNote)
})

app.delete(`/api/notes/:id`, (req, res) => {
    // read the allNotes object
    let allNotes = JSON.parse(fs.readFileSync(db_path))
    // identify id of the note that is linked to the trash can button on the html page
    const id = req.params.id;
    // exclude that object from the allNotes array
    let notesToKeep = allNotes.filter(function(note){
        return note.id !== id
    })
    // save the updated array to db.json
    let updatedNotes = JSON.stringify(notesToKeep)
    fs.writeFileSync(db_path, updatedNotes)

    res.json({success: true})
})

app.listen(PORT, function(){
    console.log(`Note Taker app listening at http://localhost:${PORT}`);
});

