(function () {


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

                // $("#uploadFile_processed").html(file_list);
                $("#processresultdiv").show();

                $(".text-success").text("Uploaded, Please note only certain videos are displayed")

                // display chart
                displayGanttChart(data.response.output)
                displayBarChartAction(data.response.output)
                displayBarChartAudio(data.response.output)

            });
        }
    }

    function listClips(data) {
        var file_list = [];

        if(data) {
            var filename = data.filename;

            for (var key in data.audio) {
                var clipname = filename + "-clip"+key;
                var sound = audioElement(clipname);
                var str = tableElement(data.audio[key], sound);
                
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
    
    function tableElement(label, sound, play, stop) {
        var str = '<div class="form-group row">';
        str = str + '<div class="col-sm-2">'+label+'</div>';
        str = str + '<div class="col-sm-6">'+sound+'</div>';
        str = str + '</div>';
        return str;
    };

    function displayGanttChart(data) {
        

        var chartData = data.video.map(label=>{
            var newLabel = {...label}
            var newPeriods = label.periods.map(session=>{
                var newSession = {...session}
                newSession.start = formatTime(session.start)
                newSession.end = formatTime(session.end)
                return newSession
            })
            newLabel.periods = newPeriods
            return newLabel
        })

        var treeData = anychart.data.tree(chartData, "as-table");
        var chart = anychart.ganttResource(); 
        chart.data(treeData);
        var markerCounter = 0;
        var textCounter = 0

        //create markers, for audio
        for (var session in data.audio){
            var sessionStart = session.split('-')[0]
            var sessionEnd = session.split('-')[1]
            if (data.audio[session]=='crying_baby') {
                var cryMarker = chart.getTimeline().rangeMarker(markerCounter)
                cryMarker.from(formatTime(sessionStart));
                cryMarker.to(formatTime(sessionEnd));
                cryMarker.fill("#dd2c00 0.2");

                // var cryText = chart.getTimeline().textMarker(textCounter);
                // cryText.value(formatTime(parseInt(sessionStart+3))); //make the text display in the middle od the window
                // cryText.text("Crying");
                // cryText.fontWeight(600);
                // cryText.offsetX(-10);

            }
            else {
                var noCryMarker = chart.getTimeline().rangeMarker(markerCounter)
                noCryMarker.from(formatTime(sessionStart));
                noCryMarker.to(formatTime(sessionEnd));
                noCryMarker.fill("#a4cbad 0.2");

                // var noCryText = chart.getTimeline().textMarker(textCounter);
                // noCryText.value(formatTime(parseInt(sessionStart+3))); //make the text display in the middle od the window
                // noCryText.text("Not Crying");
                // noCryText.fontWeight(600);
                // noCryText.offsetX(-10);

            }

            markerCounter = markerCounter +1
            // textCounter = textCounter +1
        }


        chart.container("ganttChart_display");
        chart.draw();
        chart.fitAll();
    }

    function displayBarChartAction(data){        
        var actions = data.video;
        var chartData = actions.map(x=>{
            var item = [];
            item.push(x.name)
            item.push(x.periods.length)
            return item
        })
        console.log(chartData);
          chart = anychart.column();
          var series = chart.column(chartData);
          chart.container("columnChart_display_action");
          chart.draw();

    }

    function displayBarChartAudio(data){
        
          var audio = data.audio
          var cryCount = 0
          var noCryCount = 0
          for (var session in audio){
            if (audio[session]=='crying_baby') cryCount = cryCount +1
            else noCryCount = noCryCount +1
          }
          var chartData = [
              ["Crying", cryCount],
              ["Not crying", noCryCount]
          ]

            
          chart = anychart.column();
          var series = chart.column(chartData);
          chart.container("columnChart_display_audio");
          chart.draw();
    }

    function formatTime(s){
        var baseTime = moment().hour(0).minute(0).second(0);
        var time = baseTime.add(parseInt(s), 'seconds')
        return time.format()
       
    }

    $(document).ready(page.ready);

})();
