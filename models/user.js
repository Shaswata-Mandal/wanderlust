const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//using passport local mongoose. this creates a username automatically
//it also sets a salt and changes the password into hash automatically
//it also contain some static methods that help in user authenticaiton and authorization
const passportLocalMongoose=require("passport-local-mongoose");


const userSchema= new Schema({
    email: {
        type: String, 
        required: true
    }
});

//passing the passport local mongoose to the schema as a plugin
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;