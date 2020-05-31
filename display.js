var save = false;
var readings = {
  exercise: "",
  reps: "",
  time: [],
  acc: { x: [], y: [], z: [] },
  gyro: { x: [], y: [], z: [] },
  linear: { x: [], y: [], z: [] },
};
var acc = { x: "", y: "", z: "" };
var gyr = { x: "", y: "", z: "" };
var linearAcc = { x: "", y: "", z: "" };
var timeInMs = Date.now();

let acl = new Accelerometer();
let gyro = new Gyroscope();
let lin = new LinearAccelerationSensor();

let accelerometer = document.getElementById("accelerometer");
acl.addEventListener("reading", (e) => {
  accelerometer.innerHTML =
    "<h3>Accelerometer</h3><ul><li>x: " +
    e.target.x +
    "</li><li> y: " +
    e.target.y +
    "</li><li>  z: " +
    e.target.z +
    "</li></ul>";
  acc.x = e.target.x;
  acc.y = e.target.y;
  acc.z = e.target.z;
  timeInMs = Date.now();
  recording();
});

let gyroscope = document.getElementById("gyroscope");
gyro.addEventListener("reading", (e) => {
  gyroscope.innerHTML =
    "<h3>Gyroscope</h3><ul><li>x: " +
    e.target.x +
    "</li><li> y: " +
    e.target.y +
    "</li><li>  z: " +
    e.target.z +
    "</li></ul>";
  gyr.x = e.target.x;
  gyr.y = e.target.y;
  gyr.z = e.target.z;
});

let linear = document.getElementById("linear");
lin.addEventListener("reading", (e) => {
  linear.innerHTML =
    "<h3>Linear Acceleration</h3><ul><li>x: " +
    e.target.x +
    "</li><li> y: " +
    e.target.y +
    "</li><li>  z: " +
    e.target.z +
    "</li></ul>";
  linearAcc.x = e.target.x;
  linearAcc.y = e.target.y;
  linearAcc.z = e.target.z;
});

acl.start();
gyro.start();
linear.start();

function start() {
  var exercise = document.forms["form1"]["exercise"].value;
  var reps = document.forms["form1"]["reps"].value;
  if (reps == "" || exercise == "") {
    alert("Must complete Excercise & Reps");
    return false;
  }
  var input = document.getElementById("form1");
  readings.exercise = input.elements[0].value;
  readings.reps = input.elements[1].value;
  save = !save;
  var stop = document.getElementById("stop");
  stop.style.display = "block";
  input.style.display = "none";
}

async function stop() {
  let result = document.getElementById("result");
  save = !save;
  const resp = await putReading();
  result.innerHTML = `<a href="${resp}" target="_blank">Show File</a><br>
  <br><a href="">Go again...</a>`;
}

function recording() {
  if (save === true) {
    readings.acc.x.push(acc.x);
    readings.acc.y.push(acc.y);
    readings.acc.z.push(acc.z);

    readings.gyro.x.push(gyr.x);
    readings.gyro.y.push(gyr.y);
    readings.gyro.z.push(gyr.z);

    readings.linear.x.push(linearAcc.x);
    readings.linear.y.push(linearAcc.y);
    readings.linear.z.push(linearAcc.z);

    readings.time.push(timeInMs);
    console.log(readings);
    let record = document.getElementById("record");
    record.innerHTML = "Recording Data";
    record.style.color = "red";
  }
}

// api
async function putReading() {
  try {
    let res = await axios({
      url: "https://gbuz6kdwq7.execute-api.eu-west-1.amazonaws.com/dev",
      method: "put",
      timeout: 8000,
      data: readings,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      console.log(res.data);
    }
    return res.data;
  } catch (err) {
    console.error(err);
    return "Error - File not uploaded";
  }
}