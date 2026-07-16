const mongoose = require("mongoose");
const MovieSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, trim :true, },
        description:{type: String,required: true, },
        poster:{type: String, required: true, },
        duration:{type:Number,required:true},
        languages:{type:[String],required:true},
        releaseDate:{type:Date,required:true},
        genre:{type:[String],required:true},
    
    },{timestamps: true}
);

const Movie = mongoose.model("Movies", MovieSchema);
module.exports=Movie;

