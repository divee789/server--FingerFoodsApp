

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const path = require('path'),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    helmet = require("helmet"),
    compression = require("compression"),
    morgan = require("morgan"),
    fs = require('fs')

//Connecting to Database    

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ujvhg.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true`, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("divine connect error")
    } else {
        console.log("divine connect successful")
    }
})
mongoose.connection.on('error', function (err) {
    console.log("divine error:", err);
});
mongoose.connection.on('connected', function () {
    console.log("divine connection")
});


const streamLog = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" })

//MIDDLEWARE
const enableCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
app.use(helmet())
app.use(compression())
app.use(morgan("combined", { stream: streamLog })) //for logging requests
//compresion is to compress your files
//helmet is to secure our express app
app.use(enableCrossDomain)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cors())
app.options('*', cors())

app.use("/uploads", express.static(path.join(__dirname + "/uploads")))

// require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/api/auth")
const shop = require("./routes/api/market")

app.use("/api", authRoutes)
app.use("/api/market", shop)

const port = process.env.PORT || 9000
const server = app.listen(port, console.log("server started on port " + port))
