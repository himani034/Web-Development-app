if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema , reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");


main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderbnb");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})
// const validateListing = (req , res , next) => {
//     let {error} = listingSchema.validate(req.body);
//     // console.log(result);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400 , errMsg);
//     }
//     else {
//         next();
//     }
// }

// const validateReview= (req , res , next) => {
//     let {error} = reviewSchema.validate(req.body);
//     // console.log(result);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400 , errMsg);
//     }
//     else {
//         next();
//     }
// }

// app.get("/demouser" , async (req , res)=> {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

// index route
// app.get("/listings", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// }));

// // new route
// app.get("/listings/new", (req, res) => {
//     res.render("listings/new.ejs");
// });

// // show route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { listing });
// }));

// // create route
// app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    
//     // if (!req.body.listing) {
//     //     throw new ExpressError(400, "Send valid data for listing");
//     // }
//     // let {title , description , image , price , location , country} = req.body;
//     // a shorter form exists of it in new.ejs make key value pair as listing[title]
//     // let listing = req.body.listing;
//     const newListing = new Listing(req.body.listing);

//     // if (!newListing.title) {
//     //     throw new ExpressError(400, "Title is missing!");
//     // }
//     // if (!newListing.description) {
//     //     throw new ExpressError(400, "Description is missing!");
//     // }
//     // if(!newListing.location) {
//     //     throw new ExpressError(400 , "Location is missing!");
//     // }
//     await newListing.save();
//     // console.log(listing);
//     res.redirect("/listings");
// })
// );
// // edit route
// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// }));

// // update route
// app.put("/listings/:id", validateListing , wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// }));

// // delete route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));

// // Reviews
// // post route(Reviews)
// app.post("listings/:id/reviews" , validateReview , wrapAsync(async(req , res)=> {
//    let listing = await Listing.findById(req.params.id);
//    let newReview = new Review(req.body.review);
//    listing.reviews.push(newReview);

//    await newReview.save();
//    await listing.save();

// //    console.log("new review saved");
// //    res.send("new review saved");

//    res.redirect(`/listings/${listing._id}`);
// }));

// // delete route(Reviews)
// app.delete("/listings/:id/reviews/review:Id" , wrapAsync(async(req , res) => {
//     let {id , reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id , {$pull: {reviews : reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));
// app.get("/testListing" , async (req , res)=> {
//     let sampleListing = new Listing( {
//         title: "My Villa",
//         description: "Near the beach",
//         price: 1200,
//         location: "Calangute , Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // res.send("Something went wrong");
    res.status(statusCode).render("edit.ejs", { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});