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

    function displayChart(data) {
        // var data2 = [{
        //     id: "1",
        //     name: "Baby Activity Sequence Breakdown",
        //     actualStart: "2018-01-02T00:00:00.000Z",
        //     actualEnd: "2018-01-02T00:00:05.000Z",
        //     children: [{
        //         id: "1_1",
        //         name: "Climb",
        //         actualStart: "2018-01-02T00:00:05.000Z",
        //         actualEnd: "2018-01-02T00:00:10.000Z",
        //         connectTo: "1_2",
        //         connectorType: "finish-start"
        //     },
        //     {
        //         id: "1_2",
        //         name: "Crawl",
        //         actualStart: "2018-01-02T00:00:10.000Z",
        //         actualEnd: "2018-01-02T00:00:15.000Z",
        //         connectTo: "1_3",
        //         connectorType: "finish-start"
        //     },
        //     {
        //         id: "1_3",
        //         name: "Roll",
        //         actualStart: "2018-01-02T00:00:15.000Z",
        //         actualEnd: "2018-01-02T00:00:20.000Z",
        //         connectTo: "1_4",
        //         connectorType: "finish-start"
        //     },
        //     {
        //         id: "1_4",
        //         name: "Walk",
        //         actualStart: "2018-01-02T00:00:20.000Z",
        //         actualEnd: "2018-01-02T00:00:25.000Z"
        //     }]
        // }];
        
        data2 = [
            {
              id: "1",
              name: "Climb",
              periods: [
                {id:"1_1", start: "2018-01-02T00:00:00.000Z", end: "2018-01-02T00:00:05.000Z"},
                {id:"1_2", start: "2018-01-02T00:00:15.000Z", end: "2018-01-02T00:00:20.000Z"},
                {id:"1_3", start: "2018-01-02T00:00:20.000Z", end: "2018-01-02T00:00:25.000Z"}
            ]},
            {
              id: "2",
              name: "Crawl",
              periods: [
                {id: "2_1", start: "2018-01-02T00:00:05.000Z", end: "2018-01-02T00:00:10.000Z"},
                {id: "2_2", start: "2018-01-02T00:00:25.000Z", end: "2018-01-02T00:00:30.000Z"}
            ]},
            {
              id: "3",
              name: "Roll",
              periods: [
                {id: "3_1", start: "2018-01-02T00:00:10.000Z", end: "2018-01-02T00:00:15.000Z"}
            ]},
            {
               id: "4",
               name: "Walk",
               periods: [
                 {id: "3_1", start: "2018-01-02T00:00:10.000Z", end: "2018-01-02T00:00:15.000Z"}
            ]}
          ];



        // var treeData = anychart.data.tree(data2, "as-tree");
        var treeData = anychart.data.tree(data2, "as-table");
        // var chart = anychart.ganttProject();
        var chart = anychart.ganttResource(); 
        chart.data(treeData);
        // chart.getTimeline().scale().maximum("2018-06-30");

        // create two range markers
        var marker__nocry_1 = chart.getTimeline().rangeMarker(0);
        var marker__nocry_2 = chart.getTimeline().rangeMarker(1);
        var marker__nocry_3 = chart.getTimeline().rangeMarker(2);
        var marker__nocry_4 = chart.getTimeline().rangeMarker(3);
        var marker__nocry_5 = chart.getTimeline().rangeMarker(4);
        var marker_cry_1 = chart.getTimeline().rangeMarker(5);
        var text__cry_1 = chart.getTimeline().textMarker(0);

        marker__nocry_1.from("2018-01-02T00:00:00.000Z");
        marker__nocry_1.to("2018-01-02T00:00:05.000Z");
        marker__nocry_1.fill("#a4cbad 0.2");

        marker__nocry_2.from("2018-01-02T00:00:05.000Z");
        marker__nocry_2.to("2018-01-02T00:00:10.000Z");
        marker__nocry_2.fill("#a4cbad 0.2");

        marker__nocry_3.from("2018-01-02T00:00:10.000Z");
        marker__nocry_3.to("2018-01-02T00:00:15.000Z");
        marker__nocry_3.fill("#a4cbad 0.2");

        marker__nocry_4.from("2018-01-02T00:00:15.000Z");
        marker__nocry_4.to("2018-01-02T00:00:20.000Z");
        marker__nocry_4.fill("#a4cbad 0.2");

        marker__nocry_5.from("2018-01-02T00:00:25.000Z");
        marker__nocry_5.to("2018-01-02T00:00:30.000Z");
        marker__nocry_5.fill("#a4cbad 0.2");


        marker_cry_1.from("2018-01-02T00:00:20.000Z");
        marker_cry_1.to("2018-01-02T00:00:25.000Z");
        marker_cry_1.fill("#dd2c00 0.2");


        text__cry_1.value("2018-01-02T00:00:23.000Z");
        text__cry_1.text("Crying");
        text__cry_1.fontWeight(600);
        text__cry_1.offsetX(-10);


        chart.container("chart_display");
        chart.draw();
        chart.fitAll();
    }

    $(document).ready(page.ready);

})();
