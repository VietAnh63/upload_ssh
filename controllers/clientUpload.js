const fs = require("fs");
const formidable = require("formidable");

module.exports.upload = function (req, res, next) {
  return res.render("upload");
};

module.exports.postImage = function (req, res, next) {
  var form = formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    // Uploading file
    var oldpath = files.img.path;
    var newpath = "./public/uploads/" + fields.student_name + ".jpg";

    console.log(newpath);

    fs.rename(oldpath, newpath, function (err) {
      if (err) {
        throw err;
      }
    });
    res.send("success");
  });
};
