const mongoose = require('mongoose');
var schema = mongoose.Schema({
    
    title : String,
    authors : String,
    desc : String,
    edition : String,
    format : String,
    pages : String,
    rating : Number,
    rating_count : Number,
    review_count : Number,
    genres : String,
    img : String
    
}, {
    timestamps: true
}
);

schema.index({ book_id: 1 });
schema.index({ authors: 1 });
schema.index({ title: 1 });
schema.index({ original_title: 1 });

modelSchema = mongoose.model("book", schema);

module.exports = modelSchema;
