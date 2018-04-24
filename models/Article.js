const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({
	title: {
		type: String,
		unique: true
	},
	summary: {
		type: String
	},
	link: {
		type: String
	},
	photo: {
		type: String
	},
	date: {
		type: String
	}
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;