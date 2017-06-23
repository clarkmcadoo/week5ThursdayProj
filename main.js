const express = require("express");
const mustacheExpress = require("mustache-express");
const app = express();
const port = process.env.PORT || 7000;
const bodyParser = require("body-parser");
const session = require("express-session")

function checkAuth(request, response, next){
    if(!request.session.user){
        return response.redirect("/login");
    }else{
        next();
    }
};

var users = [{username: "a", password: "a"}];

app.engine("mustache", mustacheExpress());
app.set("views","./public");
app.set("view engine", "mustache");

//MIDDLEWARE
app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: "Fancy Rhino Sauce",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 300000}
}));

//ROUTES
app.get("/",checkAuth, function ( request, response){
        response.render("index", {user: request.session.user});

    
})


app.get("/login", function ( request, response){
    response.render("login");
})

app.post("/login", function( request, response){
     if(!request.body || !request.body.username || !request.body.password){
        return response.redirect("login");
    }

    var incomingUser = request.body;
    var userRecord;

    users.forEach(function(item){
        console.log(item);
        if(item.username === incomingUser.username){
            console.log(item);
            userRecord = item;
        }
    });

    console.log(request.session);
    
    if(!userRecord){
        return response.redirect("login");//user not found!
    }

    if(incomingUser.password === userRecord.password){
        request.session.user = userRecord;
        return response.redirect("/");
    }else{
        return response.redirect("login");
    }

})

app.get("/signup", function ( request, response){
    response.render("signup");
})

app.post("/users", function ( request, response){
    if(!request.body || !request.body.username || !request.body.password){
        return response.redirect("login");
    }

    var newUser = {
        username: request.body.username,
        password: request.body.password
    };

    users.push(newUser);
    console.log("users:", users);
    console.log(request.session);
    return response.redirect("login");
})






app.listen(port, function(){
    console.log("Your app/project is running on port: ", port);
})