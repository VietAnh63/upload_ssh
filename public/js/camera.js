$(document).ready(function () {
			// Grab elements, create settings, etc.
			var video = document.getElementById('video');
			var formData = new FormData()
			var images = []

			// Get access to the camera!
			$("#myBtn").click(function(){
				navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
					video.srcObject = stream;
					video.play();
							
					// Now if the user hit close
					// redefine window.onclick
					// instead of just closing the modal, we stop the cam and close
					$("span.close").click(function(){
						// close the modal
						document.getElementById('myModal').style.display = 'none'
						console.log("Stopping")
						video.pause()
						stream.getTracks()[0].stop()
					})
				})
				// Elements for taking the snapshot
				var canvas = document.getElementById('canvas');
				var context = canvas.getContext('2d');
				var video = document.getElementById('video');
				
				// Trigger photo take
				document.getElementById("video").addEventListener("play", function () {
					width = $("#video").width()
					height = $("#video").height()

					draw(video, context, 640, 480)
				});

				document.getElementById("snap").addEventListener('click', function () {
						var array = []
						var canvas = document.getElementById("canvas")
						var dataURL = canvas.toDataURL().split(",")[1]
						var blobBin = atob(dataURL)

						for (var i = 0; i < blobBin.length; i++) {
									array.push(blobBin.charCodeAt(i))
						}

						var blob = new Blob([new Uint8Array(array)], { type: 'img/jpg' })
						images.push(blob)
					
						$("#info").html(`Number of photo taken : ${images.length}`)
				})
			})

			function draw(v, c, w, h) {
						if (v.paused || v.ended) return false;
						c.drawImage(v, 0, 0, w, h);
						setTimeout(draw, 20, v, c, w, h);
			}

			$("#submit").click(function() {
						formData.append("student_name", $("#student_name").val())
						formData.append("student_id", $("#student_id").val())

						for (var i = 0; i < images.length; i++){
							formData.append("img_" + i, images[i])
						}

						$.ajax({
									url: '/process_form',
									type: 'POST',
									async: true,
									data: formData,
									contentType: false,
									processData: false,
									success: function (response) {
												alert("Success!")
									}
						})
			})
})