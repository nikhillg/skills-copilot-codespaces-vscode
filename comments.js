// Create web server
// 1. npm install express
// 2. npm install ejs
// 3. npm install body-parser
// 4. npm install mongoose
// 5. npm install method-override
// 6. npm install express-sanitizer

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");

// App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs"); // Set default template engine to "ejs"
app.use(express.static("public")); // Serve custom stylesheet
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); // Must be after bodyParser

// Mongoose / Model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default:Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTful routes

// INDEX route
app.get("/", function(req, res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){ // Find all blogs
		if(err){
			console.log("ERROR!");
		} else {
			res.render("index", {blogs: blogs}); // Render index.ejs
		}
	});
});

// NEW route
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE route
app.post("/blogs", function(req, res){
	// Create blog
	req.body.blog.body = req.sanitize(req.body.blog.body); // Sanitize user input
	Blog.create(req.body.blog, function(err, newBlog){ // Create new blog
		if(err){
			res.render("new"); // If error, render new.ejs
		} else {
			res.redirect("/blogs"); // Redirect to index
		}
	});
});

// SHOW route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){ // Find blog by id
		if(err){
			res.redirect("/blogs"); // If error, redirect to index
		} else {
			res.render("show", {blog: foundBlog}); // Render show.ejs
		}
	});
});

// EDIT route