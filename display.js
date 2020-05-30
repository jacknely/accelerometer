var save = false;
var readings = {
  exercise: "",
  reps: "",
  time: [],
  acc: { x: [], y: [], z: [] },
};
var acc = { x: "", y: "", z: "" };
var timeInMs = Date.now();
let status = document.getElementById("status");

if ("Accelerometer" in window) {
  let sensor = new Accelerometer();
  sensor.addEventListener("reading", (e) => {
    status.innerHTML =
      "<ul><li>x: " +
      e.target.x +
      "</li><li> y: " +
      e.target.y +
      "</li><li>  z: " +
      e.target.z +
      "</li></ul>";
    acc.x = e.target.x;
    acc.y = e.target.y;
    acc.z = e.target.z;
    recording();
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

function recording() {
  if (save === true) {
    readings.acc.x.push(acc.x);
    readings.acc.y.push(acc.y);
    readings.acc.z.push(acc.z);
    readings.time.push(timeInMs);
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
