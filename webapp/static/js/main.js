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

                $("#uploadFile_processed").html(file_list);
                $("#processresultdiv").show();

                // display chart
                displayChart(data)

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

    function displayChart(data) {
      
        // var data =
        // {
        // 'audio': {
        //     '0-5': "crying_baby",
        //     '5-10': "crying_baby",
        //     '10-15': "crying_baby"
        // },
        // 'video': [
        //     {
        //       id: "1",
        //       name: "Climb",
        //       periods: [
        //         {id:"1_1", start: "2018-01-02T00:00:00.000Z", end: "2018-01-02T00:00:05.000Z"},
        //         {id:"1_2", start: "2018-01-02T00:00:15.000Z", end: "2018-01-02T00:00:20.000Z"},
        //         {id:"1_3", start: "2018-01-02T00:00:20.000Z", end: "2018-01-02T00:00:25.000Z"}
        //     ]},
        //     {
        //       id: "2",
        //       name: "Crawl",
        //       periods: [
        //         {id: "2_1", start: "2018-01-02T00:00:05.000Z", end: "2018-01-02T00:00:10.000Z"},
        //         {id: "2_2", start: "2018-01-02T00:00:25.000Z", end: "2018-01-02T00:00:30.000Z"}
        //     ]},
        //     {
        //       id: "3",
        //       name: "Roll",
        //       periods: [
        //         {id: "3_1", start: "2018-01-02T00:00:10.000Z", end: "2018-01-02T00:00:15.000Z"}
        //     ]},
        //     {
        //        id: "4",
        //        name: "Walk",
        //        periods: [
        //          {id: "3_1", start: "2018-01-02T00:00:30.000Z", end: "2018-01-02T00:00:35.000Z"}
        //     ]}
        //   ]
        // }

        // var treeData = anychart.data.tree(data.video, "as-table");
        // var chart = anychart.ganttResource(); 
        // chart.data(treeData);

        // var marker__nocry_1 = chart.getTimeline().rangeMarker(0);
        // var marker__nocry_2 = chart.getTimeline().rangeMarker(1);
        // var marker__nocry_3 = chart.getTimeline().rangeMarker(2);
        // var marker__nocry_4 = chart.getTimeline().rangeMarker(3);
        // var marker__nocry_5 = chart.getTimeline().rangeMarker(4);
        // var marker_cry_1 = chart.getTimeline().rangeMarker(5);
        // var text__cry_1 = chart.getTimeline().textMarker(0);
        // var text__cry_2 = chart.getTimeline().textMarker(1);
        // var text__nocry_1 = chart.getTimeline().textMarker(2);


        // marker__nocry_1.from("2018-01-02T00:00:00.000Z");
        // marker__nocry_1.to("2018-01-02T00:00:05.000Z");
        // marker__nocry_1.fill("#a4cbad 0.2");

        // marker__nocry_2.from("2018-01-02T00:00:05.000Z");
        // marker__nocry_2.to("2018-01-02T00:00:10.000Z");
        // marker__nocry_2.fill("#a4cbad 0.2");

        // marker__nocry_3.from("2018-01-02T00:00:10.000Z");
        // marker__nocry_3.to("2018-01-02T00:00:15.000Z");
        // marker__nocry_3.fill("#a4cbad 0.2");

        // marker__nocry_4.from("2018-01-02T00:00:15.000Z");
        // marker__nocry_4.to("2018-01-02T00:00:20.000Z");
        // marker__nocry_4.fill("#a4cbad 0.2");

        // marker__nocry_5.from("2018-01-02T00:00:25.000Z");
        // marker__nocry_5.to("2018-01-02T00:00:30.000Z");
        // marker__nocry_5.fill("#a4cbad 0.2");


        // marker_cry_1.from("2018-01-02T00:00:20.000Z");
        // marker_cry_1.to("2018-01-02T00:00:25.000Z");
        // marker_cry_1.fill("#dd2c00 0.2");


        // text__cry_1.value("2018-01-02T00:00:23.000Z");
        // text__cry_1.text("Crying");
        // text__cry_1.fontWeight(600);
        // text__cry_1.offsetX(-10);


        // text__cry_2.value("2018-01-02T00:00:08.000Z");
        // text__cry_2.text("Crying");
        // text__cry_2.fontWeight(600);
        // text__cry_2.offsetX(-10);     
        
        // text__nocry_1.value("2018-01-02T00:00:13.000Z");
        // text__nocry_1.text("not Crying");
        // text__nocry_1.fontWeight(600);
        // text__nocry_1.offsetX(-10);    
        


        var data2 = {
            'audio': {
                '0-5': "crying_baby",
                '5-10': "crying_baby",
                '10-15': "other",
                '15-20': "other",
                '20-25': "other",
                '25-30': "crying_baby",
                '30-35': "crying_baby"
            },
            'video':[
                {
                  id: "1",
                  name: "Climb",
                  periods: [
                    {id:"1_1", start: "0", end: "5"},
                    {id:"1_2", start: "15", end: "20"},
                    {id:"1_3", start: "20", end: "25"}
                ]},
                {
                  id: "2",
                  name: "Crawl",
                  periods: [
                    {id: "2_1", start: "05", end: "10"},
                    {id: "2_2", start: "25", end: "30"}
                ]},
                {
                  id: "3",
                  name: "Roll",
                  periods: [
                    {id: "3_1", start: "10", end: "15"}
                ]},
                {
                   id: "4",
                   name: "Walk",
                   periods: [
                     {id: "3_1", start: "30", end: "35"}
                ]}
              ]
        }
        var chartData = data2.video.map(label=>{
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
        for (var session in data2.audio){
            var sessionStart = session.split('-')[0]
            var sessionEnd = session.split('-')[1]
            if (data2.audio[session]=='crying_baby') {
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


        chart.container("chart_display");
        chart.draw();
        chart.fitAll();
    }

    function formatTime(s){
        var baseTime = moment().hour(0).minute(0).second(0);
        var time = baseTime.add(parseInt(s), 'seconds')
        return time.format()
       
    }

    $(document).ready(page.ready);

})();
