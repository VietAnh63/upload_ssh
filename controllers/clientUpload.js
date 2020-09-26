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
		fs.mkdir(`./public/uploads/${folder}`, async function(err){
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
			await fileKey.forEach(async function(key){
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
				})
			})

			// If all files has been renamed, start SCP the whole folder
			console.log("[INFO] SCP to file server")
			var server_upload_dir = '/home/pi/Desktop/Hieu/files' // upload location at the file server
			try{
				await scp({
					host : '192.168.86.26', // change with your server's ip
					port : 22,
					username : 'pi', // change with your server's username
					password : 'raspberry' // change with the server's password
				}).then(client => {
					client.uploadDir(`./public/uploads/${folder}`, `${server_upload_dir}/${folder}`)
						.then(response => {
							client.close() // important, always close client ssh tunnel
					}).catch(err => {
							console.log(err)
							console.log('[INFO] Cannot upload files ...')
							success = false
							res.send("upload_failed")
					})
				})
			}catch(e){
				console.log("[INFO] File server unreachable")
				success = false
				res.send('server_failed')
			}

			if(success)
				res.send('success')
		})
  });
};
