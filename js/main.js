
$(function() {
    // $("form").change(function(e) {
    //     var file = e.originalEvent.srcElement.files[0],
    //     reader = new FileReader();

    //     reader.onload = function(e) {
    // //       console.log(e.target);
    //       var srcInfo = e.target.result;
    //       // var urlString = 'url("' + e.target.result + '")';
    // //       // $(".preview").css({'background-image':urlString});
    //       $("#barcode").remove();
    //       var imageTag = $("<img id='barcode'>").attr('src',srcInfo);
    //       $('body').append(imageTag);
    //       decodeBarCode("barcode",function(result){
    //         var resultHead = $('<h1 class="result-info">').text(result.data);
    //         $('body').append(resultHead);
    //       });

    //     }
    //     // console.log(file);
    //     reader.readAsDataURL(file);
    //     // console.log(getBarcodeFromImage("barcode"));
    //     // $(this).submit();

    // });
  


   
  /* --------------------------------------------------
    Javascript Only Barcode_Reader V1.0 by Eddie Larsson <https://github.com/EddieLa/BarcodeReader>
    Source code below this comment block modified slightly for use in this project. Worker code used as previously written.

    This software is provided under the MIT license, http://opensource.org/licenses/MIT.
    All use of this software must include this
    text, including the reference to the creator of the original source code. The
    originator accepts no responsibility of any kind pertaining to
    use of this software.

    Copyright (c) 2013 Eddie Larsson

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

  ------------------------ */
    
      var takePicture = document.querySelector("#img-src"),
      showPicture = document.querySelector("#barcode");
      Result = document.querySelector("#results");
      Canvas = document.createElement("canvas");
      Canvas.width=640;
      Canvas.height=480;
      var resultArray = [];
      ctx = Canvas.getContext("2d");
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
          Result.innerHTML=resultArray.join("<br />");
        }else{
          if(resultArray.length === 0 && workerCount === 0) {
            Result.innerHTML="Decoding failed.";
          }
        }
      }
      var DecodeWorker = new Worker("/js/vendor/DecoderWorker.js");
      var RightWorker = new Worker("/js/vendor/DecoderWorker.js");
      var LeftWorker = new Worker("/js/vendor/DecoderWorker.js");
      var FlipWorker = new Worker("/js/vendor/DecoderWorker.js");
      DecodeWorker.onmessage = receiveMessage;
      RightWorker.onmessage = receiveMessage;
      LeftWorker.onmessage = receiveMessage;
      FlipWorker.onmessage = receiveMessage;
      if(takePicture && showPicture) {
        takePicture.onchange = function (event) {
          var files = event.target.files
          if (files && files.length > 0) {
            file = files[0];
            try {
              var URL = window.URL || window.webkitURL;
              var imgURL = URL.createObjectURL(file);
              showPicture.src = imgURL;
              //Now we wait
              $("#barcode").Jcrop({
                  onSelect: showCoords
              });

              function showCoords(data) {
                // console.log(data);
                var imageOrig = new Image();
                imageOrig.src = imgURL;
                var ow = imageOrig.width;
                var oh = imageOrig.height;
                var sw = $('.jcrop-holder').width();
                var sh = $('.jcrop-holder').height();
                var cropInfo = {
                  'x': data.x,
                  'y': data.y,
                  'w': data.w,
                  'h': data.h,
                  'ow':ow,
                  'oh':oh,
                  'sw':sw,
                  'sh':sh
                }
                // URL.revokeObjectURL(imgURL);
                DecodeBar(cropInfo);
              }
              //no idea why the following code was necessary, but it was breaking Jcrop.
            }
            catch (e) {
              try {
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                  showPicture.src = event.target.result;
                };
                fileReader.readAsDataURL(file);
                DecodeBar()
              }
              catch (e) {
                Result.innerHTML = "Neither createObjectURL or FileReader are supported";
              }
            }
          }
        };
      }
      function DecodeBar(cropDimensions){
        console.log("bar code analyzer called");
        Result.innerHTML="";
        var c = cropDimensions;
        var xConv = c.sw/c.ow;//calc proportions for x & y based on original and scaled dimensions
        var yConv = c.sh/c.oh;
        var calcWidth = Math.round(c.w / xConv);
        var calcHeight = Math.round(c.h / yConv);
        var calcX = Math.round(c.x/xConv);
        var calcY = Math.round(c.y/yConv);
        //we're going to miss the below event handler since we are delaying execution of this function until after crop.
        //just run it whenever the function is called.
        // showPicture.onload = function(){
          ctx.drawImage(showPicture,calcX,calcY,calcWidth,calcHeight,0,0,Canvas.width,Canvas.height);

          // ctx.drawImage(showPicture,0,0,Canvas.width,Canvas.height,c.x,c.y,c.w,c.h);
          $("body").append(Canvas);
          resultArray = [];
          workerCount = 4;
          DecodeWorker.postMessage({pixels: ctx.getImageData(0,0,Canvas.width,Canvas.height).data, cmd: "normal"});
          RightWorker.postMessage({pixels: ctx.getImageData(0,0,Canvas.width,Canvas.height).data, cmd: "right"});
          LeftWorker.postMessage({pixels: ctx.getImageData(0,0,Canvas.width,Canvas.height).data, cmd: "left"});
          FlipWorker.postMessage({pixels: ctx.getImageData(0,0,Canvas.width,Canvas.height).data, cmd: "flip"});
        // }
      }
    
  /**END BARCODE SCANNER**/
});