'use strict';

// Handler for customized form submission
function submitInBackground(formSelector, submitURL, successCallback, extraData = []) {
    $(formSelector).submit(function (e) {

        // Prevent the form from clearing
        e.preventDefault();

        // Get form data
        let formData = $(this).serializeArray();

        // Testing
        console.log(formData);

        // Add extra data fields to the form
        extraData.forEach((item) => {
            formData.push(item);
        });

        // Submit the form asynchronously
        $.ajax({
            method: "post",
            url: submitURL,
            data: formData,
            dataType: "json",
            success: function (responseData, textStatus, jqXHR) {
                successCallback(responseData);
            }
        });
    })
}


function submitWithGeo(formSelector, submitURL, successCallback) {
    $(formSelector).on("submit", function (e) {

        // Prevent the form from clearing
        e.preventDefault();

        // Post the form data to the server
        function sendForm(extraData = []) {

            let formData = $(formSelector).serializeArray();

            extraData.forEach((item) => {
                formData.push(item);
            });

            $.ajax({
                method: "post",
                url: submitURL,
                data: formData,
                dataType: "json",
                success: function (responseData, textStatus, jqXHR) {

                    successCallback(responseData);
                }
            });
        }

        // Options for the GeoLocation lookup
        let options = {
            "maximumAge": 10 * 1000
        };

        // Callback when user position is obtained
        function geoSuccess(position) {

            const extraData = [
                {name: "longitude", value: position.coords.longitude},
                {name: "latitude", value: position.coords.latitude}
            ];

            sendForm(extraData);
        }

        // Callback when user position cannot be obtained
        function geoFailure(error) {

            console.log("Failed to acquire user position");

            sendForm();
        }

        // Get the user's location at time of submission
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure, options);
    });
}