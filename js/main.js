
$(function() {

      // function console.log(message) {
      //   console.log('%c' + message, 'background-color: red; padding: 4px; line-height: 1.6');
      // }
 
      //make sure our image doesn't get too big. Downsize to max dimension of 1600px
      //expects an imageUrl as obtained from the HTML5 fileAPI
      //logic from http://stackoverflow.com/questions/10333971/html5-pre-resize-images-before-uploading
      function limitImageSize(imageUrl,callback) {
          var img = document.createElement("img");
          canvas = document.createElement("canvas");
          img.onload = function() {
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            var MAX_WIDTH = 1024;
            var MAX_HEIGHT = 1024;
            var width = img.width;
            var height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height *= MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            var dataurl = canvas.toDataURL("image/jpeg");

            callback(dataurl);
          }
          img.src = imageUrl;
      }

      function getOptions(cropData,imgSrc,classNameCompare,callback) {
        //let's figure out the native dimensions.
        var imageOrig = new Image();
        var data = cropData;
        imageOrig.src = imgSrc;
        imageOrig.onload = function() {
          var nativeWidth, nativeHeight, scaledWidth, scaledHeight;
          nativeWidth = imageOrig.width;
          nativeHeight = imageOrig.height;
          scaledWidth = $(classNameCompare).width();
          scaledHeight = $(classNameCompare).height();
          console.log("original width: " + nativeWidth + "\noriginal height: " + nativeHeight);
          console.log("scaled width: " + scaledWidth + "\nscaled height: " + scaledHeight);
          var returnObj; //we will return an array containing two possible croppings.

          if (((scaledHeight > scaledWidth) && (nativeHeight > nativeWidth))
              || ((scaledWidth > scaledHeight) && (nativeWidth > nativeHeight))) {
            console.log("match");
            //proportions match. just deal with a flipped case.
            var xScale = nativeWidth/scaledWidth;
            var yScale = nativeHeight/scaledHeight; 
            //if proportions match, scale factor is easy.
            var first = { //everything is perfect. Yeah, right.
              'x' : data.x * xScale,
              'y' : data.y * yScale,
              'w' : data.w * xScale,
              'h' : data.h * yScale
            };
            var second = {//it's flipped. Oops.
              'x' : nativeWidth - xScale * (data.x + data.w),
              'y' : nativeHeight - yScale * (data.y + data.h),
              'w' : data.w * xScale,
              'h' : data.h * yScale
            };
          } else {
            console.log("doesn't match!");
            //proportions DO NOT MATCH. The image has been rotated either left or right.
            xScale = nativeWidth/scaledHeight;
            yScale = nativeHeight/scaledWidth; 
            //hope that scale factor was right. Fifty-fifty shot I guess...
            first = { //rotated clockwise
              'x' : nativeWidth - xScale * (data.y + data.h),
              'y' : data.x * yScale,
              'w' : data.h * xScale,
              'h' : data.w * yScale
            };
            second = {//rotated counter clockwise
              'x' : data.y * xScale,
              'y' : nativeHeight - yScale * (data.x + data.w),
              'w' : data.h * xScale,
              'h' : data.w * yScale
            };
          }
          returnObj = [first,second];
          callback(returnObj); //call the callback. You better give one [please].
        } //don't do anything else outside onload.
      }

      function confirmCrop(cropData,callback) {
        var formString = "<div class='confirm-crop'><h2>Because of the way some mobile devices handle rotation of images, we require additional verification.<br>Is this your intended crop?</h2><form id='confirm-crop'><button value='yes'>Yes</button><button value='no'>No</button></form></div>";
        $("body").append(formString);
        $("#confirm-crop button").click(function(e){
          e.preventDefault();
          var result = $(this).val();
          var callbackObj;
          if(result === 'yes') {
            callbackObj = {'adj':false};
          } else {
            callbackObj = {
              'adj': true,
              'x' : cropData[1].x,
              'y' : cropData[1].y,
              'w' : cropData[1].w,
              'h' : cropData[1].h
            };
          }
          $('.confirm-crop').remove();
          callback(callbackObj);
        });
      }

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
      //this is the callback function for each worker.
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
      //get the workers
      var DecodeWorker = new Worker("/js/vendor/DecoderWorker.js");
      var RightWorker = new Worker("/js/vendor/DecoderWorker.js");
      var LeftWorker = new Worker("/js/vendor/DecoderWorker.js");
      var FlipWorker = new Worker("/js/vendor/DecoderWorker.js");
      DecodeWorker.onmessage = receiveMessage;
      RightWorker.onmessage = receiveMessage;
      LeftWorker.onmessage = receiveMessage;
      FlipWorker.onmessage = receiveMessage;
      //make sure they both exist
      if(takePicture && showPicture) {
        //event handler for form change.
        takePicture.onchange = function (event) {
          var files = event.target.files
          if (files && files.length > 0) {
            file = files[0];
            try {
              var URL = window.URL || window.webkitURL;
              var imgURL = URL.createObjectURL(file);
              limitImageSize(imgURL,function(smallUrl) {
                showPicture.src = smallUrl;
                //Now we wait
                $("#barcode").Jcrop({
                    onSelect: showCoords
                });

                //process the data after making a selection
                function showCoords(data) {
                  //check against the original.
                    // URL.revokeObjectURL(imgURL);
                    getOptions(data,smallUrl,'.jcrop-holder',DecodeBar);
                }
              });
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
        console.log(cropDimensions);
        // console.log("bar code analyzer called");
        Result.innerHTML ="";
        var calcX, calcY, calcWidth, calcHeight;
        calcX = cropDimensions[0].x;
        calcY = cropDimensions[0].y;
        calcWidth = cropDimensions[0].w;
        calcHeight = cropDimensions[0].h;
        ctx.drawImage(showPicture,calcX,calcY,calcWidth,calcHeight,0,0,Canvas.width,Canvas.height);
        $("body").append(Canvas);
        confirmCrop(cropDimensions,function(data){
          if(data.adj === true) {
            console.log("switching crop!");
            calcX = data.x;
            calcY = data.y;
            calcWidth = data.w;
            calcHeight = data.h;
            ctx.drawImage(showPicture,calcX,calcY,calcWidth,calcHeight,0,0,Canvas.width,Canvas.height);
            $("canvas").remove();
            $("body").append(Canvas);
          }
          resultArray = [];
          workerCount = 4;
          DecodeWorker.postMessage({pixels: ctx.getImageData(0,0,Canvas.width,Canvas.height).data, cmd: "normal"});
          RightWorker.postMessage({pixels: ctx.getImageData(0,0,Canvas.width,Canvas.height).data, cmd: "right"});
          LeftWorker.postMessage({pixels: ctx.getImageData(0,0,Canvas.width,Canvas.height).data, cmd: "left"});
          FlipWorker.postMessage({pixels: ctx.getImageData(0,0,Canvas.width,Canvas.height).data, cmd: "flip"});
          
        });
      }
    
  /**END BARCODE SCANNER**/
});