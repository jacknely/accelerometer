var save = false;
var readings = { exercise: "", reps: "", x: [], y: [], z: [] };
let status = document.getElementById("status");
if ("Accelerometer" in window) {
  let sensor = new Accelerometer();
  sensor.addEventListener("reading", function (e) {
    status.innerHTML =
      "<ul><li>x: " +
      e.target.x +
      "</li><li> y: " +
      e.target.y +
      "</li><li>  z: " +
      e.target.z +
      "</li></ul>";
    recording(e);
  });
  sensor.start();
} else status.innerHTML = "Accelerometer not supported";

function start() {
  var input = document.getElementById("form1");
  readings.exercise = input.elements[0].value;
  readings.reps = input.elements[1].value;
  save = !save;
}

function stop() {
  let result = document.getElementById("result");
  save = !save;
  putReading();
  result.innerHTML = JSON.stringify(readings);
}

function recording(e) {
  if (save === true) {
    readings.x.push(e.target.x);
    readings.y.push(e.target.y);
    readings.z.push(e.target.z);
    console.log(readings);
    let record = document.getElementById("record");
    record.innerHTML = "Recording Data";
    record.style.color = "red";
  }
}

// api
putReading = () => {
  const BASE_URL = "https://postman-echo.com/put";
  axios
    .put(`${BASE_URL}`, readings)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
