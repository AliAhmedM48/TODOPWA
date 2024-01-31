// ~ variables
const notifyBtn = document.getElementById('notifyBtn');

if ("Notification" in window) {
    Notification.requestPermission(status => {
        //#region 
        console.log('Notification Permission ', status);
        //#endregion
    });
    // * check Notification.permission
    if (Notification.permission === 'denied' || Notification.permission === 'default') {
        notifyBtn.style.display = 'inline-block';
    } else {
        notifyBtn.style.display = 'none';
    }

    // ~ functions
    function displayNotification() {

        //#region 
        // * check Notification.permission
        if (Notification.permission === 'denied' || Notification.permission === 'default') {
            notifyBtn.style.display = 'inline-block';
            Notification.requestPermission(status => {
                //#region 
                console.log('Notification Permission ', status);
                //#endregion
            });
        } else {
            notifyBtn.style.display = 'none';
        }
        //#endregion
    }

    // ~ events
}
notifyBtn.addEventListener('click', displayNotification);



// ^ Register Service Worker
//#region 
if ('serviceWorker' in navigator) {

    window.addEventListener('load',
        function () {
            navigator.serviceWorker.register('serviceWorker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                })
        }
    )
}
//#endregion

// ^ Function to generate options for days, months, and years
//#region 

function generateOptions(start, end, elementId) {
    var selectElement = document.getElementById(elementId);

    for (var i = start; i <= end; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        selectElement.add(option);
    }
}

// ^ Generate options for days (1-31) ===================== day
generateOptions(1, 31, "day");

// ^ Generate options for years (2024 to 2026) =========== year
generateOptions(2024, 2026, "year");


// ^ Generate options for months (January to December)
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
for (var i = 0; i < months.length; i++) {
    var option = document.createElement("option");
    option.value = i + 1; // Months are 1-indexed
    option.text = months[i];
    document.getElementById("month").add(option);
}
//#endregion


// ! =============================================
