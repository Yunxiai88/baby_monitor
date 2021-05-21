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
                //var url = "/download/"+data.response.filename;
                //$("#downloadbtn").attr("href", url);
                $("#processresultdiv").show();
            });

            //show detected face
            $('body').on('DOMSubtreeModified', '.progress-bar-success', function(data){
                if ($('.progress-bar-success').length>0 && $('.progress-bar-success')[0].outerText =="Done") {
                    var uploadfiles = $('.file-footer-caption');
                    var fileName = $('.file-footer-caption')[uploadfiles.length - 1].title

                    var arr = fileName.split('.')
                    arr[0]=arr[0]+"_face"
                    var processedFileName = arr.join('.')
                    $("#uploadFile_processed").attr("src","/static/processed/"+processedFileName)
                    $("#processresultdiv").show();
                }
            });

            //show proceesed image
          $('body').on('DOMSubtreeModified', '.progress-bar-success', function(data){
              debugger
            if ($('.progress-bar-success').length>0 && $('.progress-bar-success')[0].outerText =="Done") {
                var uploadfiles = $('.file-footer-caption');
                var fileName = $('.file-footer-caption')[uploadfiles.length - 1].title

                var arr = fileName.split('.')
                arr[0]=arr[0]+"_processed"
                var processedFileName = arr.join('.')
                if (['JPG', 'PNG'].indexOf(arr[1].toUpperCase())>=0){
                    $("#uploadImg_processed").attr("src","/static/processed/"+processedFileName)
                    $("#processed_img_wrapper").attr("style","")
                }
                else {
                    $("#processed_img_wrapper").attr("style","display:none;")
                }

                $("#processresultdiv").show();
            }
          });

        }
    }

    $(document).ready(page.ready);

})();
