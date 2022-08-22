const express = require("express")
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("express-flash")
const db = require("./db/db")
const dbFunctions = require("./db/DbFunctions")(db)
const routes = require("./routes")(dbFunctions)
const app = express()

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}))
app.set("view engine", "handlebars")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
    secret: "nimdakeyboard",
    saveUninitialized: true,
    resave: false
}))
app.use(flash())

app.get("/", routes.indexGet)

app.post("/", routes.indexPost)

app.get("/days", routes.getDays)

app.get("/days/:day", routes.viewDay)

app.get("/waiters/:username", routes.getWaiter)

app.post("/waiters", routes.postWaiter)

app.post("/clear", routes.clearWaiters)

app.post("/clear/:day", routes.clearDay)

app.post("/remove/:username", routes.removeUser)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`App running on PORT: ${PORT}`))