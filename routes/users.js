const mongoose = require("mongoose")
var plm = require("passport-local-mongoose");
const { array } = require("./multer");
mongoose.connect("mongodb://127.0.0.1:27017/pinterest");


const userSchema = mongoose.Schema({
  username: String,
  image:String,
  email:{
          type:String,
          required:true,
    
  },
  boards:{
   type:Array,
   default:[]
  },
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'post',
  }],
  datecreate:{
    type:Date,
    default:Date.now()
  },
  password:{
    required:true,
    type:String,
  },
 fullname:{
  required:true,
  type:String,
 }
})

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);