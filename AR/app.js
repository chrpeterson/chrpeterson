function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

var DEVICES = [];
var final = null;
navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {

        var arrayLength = devices.length;
        for (var i = 0; i < arrayLength; i++)
        {
            var tempDevice = devices[i];
            //FOR EACH DEVICE, PUSH TO DEVICES LIST THOSE OF KIND VIDEOINPUT (cameras)
            //AND IF THE CAMERA HAS THE RIGHT FACEMODE ASSING IT TO "final"
            if (tempDevice.kind == "videoinput")
            {
                DEVICES.push(tempDevice);
                if(tempDevice.facingMode == "environment" ||tempDevice.label.indexOf("facing back")>=0 )
                    {final = tempDevice;}
            }
        }

        var totalCameras = DEVICES.length;
        //If couldnt find a suitable camera, pick the last one... you can change to what works for you
        if(final == null)
        {
            //console.log("no suitable camera, getting the last one");
            final = DEVICES[totalCameras-1];
        };

        //Set the constraints and call getUserMedia
        var constraints = {
        audio: false, 
        video: {
            deviceId: {exact: final.deviceId}
            }
        };

        navigator.mediaDevices.getUserMedia(constraints).
        then(handleSuccess).catch(handleError);

    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message);
});
