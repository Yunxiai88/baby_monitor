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
        }
    }

    function listClips(data) {
        var file_list = [];

        if(data) {
            var filename = data.filename;

            for (var key in data.values) {
                var clipname = filename + "-clip"+key;
                var audio = audioElement(clipname);
                var str = tableElement(data.values[key], audio);
                
                console.log(str)
                file_list.push(str);
            }
        }
        return file_list;
    };
    
    function audioElement(filename) {
        var str = '<audio id="'+filename+'" controls>';
        str = str + '<source src="/static/processed/'+filename+'.wav" type="audio/mpeg">';
        str = str + '</audio>';
        return str;
    };
    
    function tableElement(label, audio, play, stop) {
        var str = '<div class="form-group row">';
        str = str + '<div class="col-sm-2">'+label+'</div>';
        str = str + '<div class="col-sm-6">'+audio+'</div>';
        str = str + '</div>';
        return str;
    };

    $(document).ready(page.ready);

})();
