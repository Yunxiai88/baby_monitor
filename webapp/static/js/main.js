(function () {
    "use strict";

    var page = {

        ready: function () {
            var formdata = {};
            $("#processresultdiv").hide();

            $('#uploadVideo').fileinput({
                uploadUrl: '/uploadvideo',
                theme : 'explorer-fas',
                uploadAsync: false,
                showUpload: false,
                showRemove :true,
                showPreview: true,
                showCancel:true,
                showCaption: true,
                allowedFileExtensions: ['mp4', 'avi', 'dat', '3gp', 'mov', 'rmvb'],
                maxFileSize : 153600,
                maxFileCount : 1,
                browseClass: "btn btn-primary ",
                dropZoneEnabled: true,
                dropZoneTitle: 'Drag file here！'
            });

            // upload button
            $(".btn-upload-3").on("click", function() {
                $("#processresultdiv").hide();
                $("#uploadVideo").fileinput('upload');
            });

            // clear button
            $(".btn-reset-3").on("click", function() {
                $("#uploadVideo").fileinput('clear');
            });

            // call back function for upload file
            $('#uploadVideo').on('filebatchuploadsuccess', function(event, data, previewId, index) {
                // list out all clips
				console.log(data.response.output)
				
				var file_list = list_clips(data.response.output);
				
                $("#uploadFile_processed").html(file_list);
                $("#processresultdiv").show();
            });
			
			function list_clips(data) {
				var file_list = [];
				
				if(data) {
					var filename = data.filename;
					
					for (var key in data.values) {
						filename = filename + "-clip"+key+".wav";
						var btn = '<button type="button" class="btn btn-default btn-sm" click="/static/processed/"'+filename+' /><span class="glyphicon glyphicon-play"></span> Play</button>';
						console.log(btn);
						
						file_list.push("<li>" + data.values[key] + btn + "</li>");
					}
				}
				return file_list;
			}
			
			function display_sound() {
				
			}
        }
    }

    $(document).ready(page.ready);

})();
