const path = require("path");

const dotEnv = require("dotenv");
const express = require("express");

const fileUpload = require("express-fileupload");


const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/errors");
const { setHeaders } = require("./middlewares/headers");


//* Load Config
dotEnv.config({ path: "./config/config.env" });


//* Database connection
connectDB();

const app = express();

//* BodyPaser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(setHeaders);



//* File Upload Middleware
app.use(fileUpload());


//* Static Folder
app.use(express.static(path.join(__dirname, "public")));


//* Routes

app.use("/", require("./routes/blog"));
app.use("/", require("./routes/statics"));
app.use("/admin", require("./routes/admin"));

// app.use("/users", require("./routes/users"));
// app.use("/dashboard", require("./routes/dashboard"));


//* Error Controller
app.use((req,res)=>{res.send("404! NOT FOUND")});
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
