if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("/Users/tejas/OneDrive/文件/MAJORPROJECT/models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const { lutimes } = require("fs");
// const wrapAsync = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/utils/wrapAsync") ;
const ExpressError = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/utils/ExpressError") ;
// const {listingSchema , reviewSchema} = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/schema.js");
// const Review = require("/Users/tejas/OneDrive/文件/MAJORPROJECT/models/review");
// const review = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const listings = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/routes/listing.js");
const reviews = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/routes/review.js")
const userRouter = require("C:/Users/tejas/OneDrive/文件/MAJORPROJECT/routes/user")

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const dbUrl = process.env.ATLASDB_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


main().then(()=>{
    console.log("Connected to DB");
})
.catch((err) =>{
    console.log(err);
})


async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"))
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store =MongoStore.create({
    mongoUrl : dbUrl,
    crypto :{
        secret :process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error" , () =>{
    console.log("ERROR in MONGO SESSION STORE" , err)
})
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: true ,
    saveUninitialized : true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 *60 *1000,
        maxAge: 7*24*60*60*1000,
        httpOnly :true,
    }
}

// app.get("/" , (req , res) =>{
//     res.send("Hi iam root");
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req , res) =>{
//     let fakeUser = new User({
//         emial : "student@gmail.com",
//         username :"loneWolf"
//     })
//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// })

app.use("/listings" , listings );
app.use("/listings/:id/reviews" , reviews)
app.use("/" , userRouter);

//Reviews
//Post Review Route

// app.get("/testListing",async (req , res) =>{
//     let sampleTesting  = new Listing({
//         title : "My new Villa",
//         description :"By the beach",
//         price :1200,
//         location : "Calanguate , Goa",
//         country : "India",
//     })
//     await sampleTesting.save();
//     console.log("Sample was saved");
//     res.send("Successfull testing");
// });
app.all("*" , (req , res , next)=>{
    next(new ExpressError(404 , "Page Not Found!"))
})

app.use((err ,req , res , next)=>{
    let{statusCode=500 , message ="Something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
})

app.listen(8080 ,() =>{
    console.log("Server is listening to port 8080");
});