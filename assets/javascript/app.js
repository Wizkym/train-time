// Initialize Firebase
var config = {
    apiKey: "AIzaSyB7jgO4A0Xx0moWAdfZicijpLGHdY3Yo5s",
    authDomain: "gt201808-f18f3.firebaseapp.com",
    databaseURL: "https://gt201808-f18f3.firebaseio.com",
    projectId: "gt201808-f18f3",
    storageBucket: "gt201808-f18f3.appspot.com",
    messagingSenderId: "183813187224"
};
firebase.initializeApp(config);
let database = firebase.database();
let trainName, destination, firstTime, frequency;

$('#add').on('click', function () {
    if ($("#train_name").val().trim() === "" ||
        $("#destination").val().trim() === "" ||
        $("#first").val().trim() === "" ||
        $("#frequency").val().trim() === "") {

        alert("Please fill in all details to add new train");
    } else {
        trainName = $('#train_name').val().trim();
        destination = $('#destination').val().trim();
        firstTime = moment($('#first').val().trim(), "HH:mm").format("X"); // Unix timestamp
        frequency = parseInt($('#frequency').val().trim());

        // Log the input values
        console.log (trainName);
        console.log (destination);
        console.log (firstTime + ' is firstTime');
        console.log (frequency + ' is freq');

        // Create local object to store the values
        let newTrain = {
            name: trainName,
            destination: destination,
            initial: firstTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };

        // Upload to Firebase Database
        database.ref('/trains').push(newTrain);

        // Reset the form
        $("#train_name").val("");
        $("#destination").val("");
        $("#first").val("");
        $("#frequency").val("");
    }

    // Prevents page from refreshing
    return false;
});

// Add the trains on to the trains table
database.ref('/trains').on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
        // Store the information inside variables
        let tName = childSnapshot.val().name;
        let tDestination = childSnapshot.val().destination;
        let tInitial = childSnapshot.val().initial;
        let tFrequency = childSnapshot.val().frequency;

        // Compute the nxt arrival time
        let tDifference = moment().diff(moment.unix(tInitial), "minutes");
        let tRemaining = moment().diff(moment.unix(tDifference), "minutes") % tFrequency;
        let tMinus = tFrequency - tRemaining;
        let nextArrival = moment().add(tMinus, "m").format("hh:mm A");

        console.log(tMinus + ' is tMinus');
        console.log(nextArrival + ' is nextArrival');
        console.log(tDifference + ' is tDifference');

        //  Update the DOM
        $('#trains > tbody').append(`
            <tr>
                <td>${tName}</td>
                <td>${tDestination}</td>
                <td>${tFrequency}</td>
                <td>${nextArrival}</td>
                <td>${tMinus}</td>
            </tr>`);

});

setInterval(function() {
    window.location.reload();
}, 60000);
