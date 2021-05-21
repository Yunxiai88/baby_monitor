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
                //maxFileSize : 153600,
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
				
				var file_list = listClips(data.response.output);
				
                $("#uploadFile_processed").html(file_list);
                $("#processresultdiv").show();
            });
			
			$(document).on('click','.play-clip',function(e){
				e.preventDefault();
				
                var filename = $(this).attr('id');
				var url = "/static/processed/"+filename+".wav";

				//play audio with out html audio tag
				var myAudio = new Audio(url);
				myAudio.play();
            });
        }
    }
	
	function listClips(data) {
		var file_list = [];
		
		if(data) {
			var filename = data.filename;
			
			for (var key in data.values) {
				var clipname = filename + "-clip"+key;
				
				var btn = '<button class="btn btn-default btn-sm play-clip" id="'+clipname+'"><span class="icon-play"></span> Play</button>';
				console.log(btn);
				
				file_list.push("<li>" + data.values[key] + btn + "</li>");
			}
		}
		return file_list;
	};

    $(document).ready(page.ready);

})();
