const fs = require("fs");
const formidable = require("formidable");
const scp = require("node-scp")

module.exports.upload = function (req, res, next) {
  return res.render("upload");
};

module.exports.postImage = function (req, res, next) {
  var form = formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
		// create the folder for the student
		var folder = fields.student_id
		fs.mkdir(`./public/uploads/${folder}`, function(err){
			// if err 
			if(err) { throw err ;}

			// if folder created successfully
			// upload all files to that folder
			var fileKey = Object.keys(files);
			fileKey.forEach(function(key){
				var oldpath = files[key].path
				var newpath = `./public/uploads/${folder}/` + fields.student_name + "_" + key + ".jpg"

				fs.rename(oldpath, newpath, function(err){
					if(err) { throw err; }

					// if the file has been uploaded successfully
					// scp the whole folder to the server
				})
			})
		})

		res.send("success");
  });
};
