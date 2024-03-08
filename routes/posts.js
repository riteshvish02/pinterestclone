const { default: mongoose } = require("mongoose");
const { stringify } = require("uuid");

const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description:{
      type:String,
      required:true,
    },
    image:{
      type:String,
    },
    createdat: {
      type: Date,
      default:Date.now,
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    likes:{
        type:Array,
        default:[],
    }
    // Add other fields as needed
  });
  
  module.exports = mongoose.model('post', postSchema);
  
  