const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("express-flash")

const app = express()

app.engine("handlebars", exphbs.engine({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
    secret: "nimdakeyboard",
    saveUninitialized: true,
    resave: false
}))
app.use(flash())

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/", (req, res) => {
    const {username} = req.body
    res.redirect(`/waiters/${username}`)
})

app.get("/days", (req, res) => {
    res.render("days")
})

app.get("/waiters/:username", (req, res) => {
    const {username} = req.params
    res.render("waiters", {
        username
    })
})

app.post("/waiters/:username", (req, res) => {
    const {weekdays} = req.body
    res.redirect("/days")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App running on PORT: ${PORT}`))