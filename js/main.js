$(function() {
    $("form").change(function(e) {
        var file = e.originalEvent.srcElement.files[0],
        reader = new FileReader();

        reader.onload = function(e) {
          console.log(e.target);
          var srcInfo = e.target.result;
          var urlString = 'url("' + e.target.result + '")';
          // $(".preview").css({'background-image':urlString});
          var imageTag = $("<img id='barcode'>").attr('src',srcInfo);
          $('body').append(imageTag);
          decodeBarCode("barcode");

        }
        // console.log(file);
        reader.readAsDataURL(file);
        // console.log(getBarcodeFromImage("barcode"));
        // $(this).submit();

    });
   
    function decodeBarCode(elementID) {
      var c=document.createElement("canvas");
      var ctx=c.getContext("2d");
      var img = document.getElementById(elementID);
      c.height=480;
      c.width=640;
      var workerCount = 0;
      function receiveMessage(e) {
        if(e.data.success === "log") {
          console.log(e.data.result);
          return;
        }
        workerCount--;
        if(e.data.success){
          var tempArray = e.data.result;
          for(var i = 0; i < tempArray.length; i++) {
            if(resultArray.indexOf(tempArray[i]) == -1) {
              resultArray.push(tempArray[i]);
            }
          }
          workerCount = 0;
        }else {
          if(workerCount == 1) {
            FlipWorker.postMessage({pixels: ctx.getImageData(0,0,c.width,c.height).data, cmd: "flip"});
          }
        }
        if(workerCount == 0){
          if(resultArray.length === 0) {
            // ResultOfDecoding.innerHTML="Decoding failed.";
            console.log("failed to decode image");
          }else {
            // ResultOfDecoding.innerHTML=resultArray.join("<br />");
            console.log(resultArray);
          }
        }
      }
      var DecodeWorker = new Worker("/js/vendor/DecoderWorker.js");
      var FlipWorker = new Worker("/js/vendor/DecoderWorker.js");
      DecodeWorker.onmessage = receiveMessage;
      FlipWorker.onmessage = receiveMessage;
      var resultArray = [];
   
      function Decode() {
        if(workerCount > 0) return;
        workerCount = 2;
        // ResultOfDecoding.innerHTML='';
        resultArray = [];
        ctx.drawImage(img,0,0,c.width,c.height);
        DecodeWorker.postMessage({pixels: ctx.getImageData(0,0,c.width,c.height).data, cmd: "normal"});
      }
      Decode();
    }
    


    /**END BARCODE SCANNER**/
    $("form").submit(function(e,data) {
        console.log(data);
        e.preventDefault();
        console.log(e);
        $('form input')

        var file = e.dataTransfer.files[0],
        reader = new FileReader();
        reader.onload = function (event) {
          console.log(event.target);
          holder.style.background = 'url(' + event.target.result + ') no-repeat center';
        };
        console.log(file);
        reader.readAsDataURL(file);

    })

});