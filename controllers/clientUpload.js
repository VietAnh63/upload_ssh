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
		var success = true;
		fs.mkdir(`./public/uploads/${folder}`, function(err){
			console.log("[INFO] Making directory in home server")
			// if err 
			if(err) { 
				console.log( err );
				console.log('[ERROR] Student ID already exists')
				success = false
				res.send("id_exist")
			}

			// if folder created successfully
			// upload all files to that folder
			var fileKey = Object.keys(files);
			fileKey.forEach(async function(key){
				var oldpath = files[key].path
				var newpath = `./public/uploads/${folder}/` + fields.student_name + "_" + key + ".jpg"

				console.log('[INFO] Push files from /tmp to uploads directory at home server')
				await fs.rename(oldpath, newpath, async function(err){
					if(err) { 
						console.log('[INFO] Cannot upload files ... ')
						success = false
						res.send('upload_failed')
						console.log(err); 
					}

					// if the file has been uploaded successfully
					// scp the whole folder to the server
				
					console.log("[INFO] SCP to file server")
					var server_upload_dir = '/home/anhpv/hauiface/folder_image' // upload location at the file server
					await scp({
						host : '103.140.38.24', // change with your server's ip
						port : 2112,
						username : 'anhpv', // change with your server's username
						password : 'chienthang1984' // change with the server's password
					}).then(client => {
						client.uploadDir(`./public/uploads/${folder}`, `${server_upload_dir}/${folder}`)
							.then(response => {
								client.close() // important, always close client ssh tunnel
						}).catch(err => {
								console.log('[INFO] Cannot upload files ...')
								success = false
								res.send("upload_failed")
						})
					})
				})
			})
	
			if(success)
				res.send("success")
		})
  });
};
