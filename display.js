var save = false;
var readings = {
  exercise: "",
  reps: "",
  time: [],
  acc: { x: [], y: [], z: [] },
  gyro: { x: [], y: [], z: [] },
  linear: { x: [], y: [], z: [] },
  mag: { x: [], y: [], z: [] },
  abs: { w: [], x: [], y: [], z: [] },
  rel: { w: [], x: [], y: [], z: [] },
};
var timeInMs = Date.now();

var magValues = { x: "", y: "", z: "" };
let mag = new Magnetometer();
let magd = document.getElementById("magd");
mag.addEventListener("reading", (e) => {
  magd.innerHTML =
    "<h3>Magnetometer</h3><ul><li>x: " +
    e.target.x +
    "</li><li> y: " +
    e.target.y +
    "</li><li>  z: " +
    e.target.z +
    "</li></ul>";
  magValues.x = e.target.x;
  magValues.y = e.target.y;
  magValues.z = e.target.z;
});
mag.start();

var absValues = { w: "", x: "", y: "", z: "" };
let abs = new AbsoluteOrientationSensor();
let absd = document.getElementById("absd");
abs.addEventListener("reading", (e) => {
  absd.innerHTML =
    "<h3>Absolute Orientation</h3><ul><li>w: " +
    e.target.quaternion[0] +
    "</li><li> x: " +
    e.target.quaternion[1] +
    "</li><li> y: " +
    e.target.quaternion[2] +
    "</li><li>  z: " +
    e.target.quaternion[3] +
    "</li></ul>";
  absValues.w = e.target.quaternion[0];
  absValues.x = e.target.quaternion[1];
  absValues.y = e.target.quaternion[2];
  absValues.z = e.target.quaternion[3];
});
abs.start();

var relValues = { w: "", x: "", y: "", z: "" };
let rel = new RelativeOrientationSensor();
let reld = document.getElementById("reld");
rel.addEventListener("reading", (e) => {
  console.log(e);
  reld.innerHTML =
    "<h3>Relative Orientation</h3><ul><li>w: " +
    e.target.quaternion[0] +
    "</li><li> x: " +
    e.target.quaternion[1] +
    "</li><li> y: " +
    e.target.quaternion[2] +
    "</li><li>  z: " +
    e.target.quaternion[3] +
    "</li></ul>";
  relValues.w = e.target.quaternion[0];
  relValues.x = e.target.quaternion[1];
  relValues.y = e.target.quaternion[2];
  relValues.z = e.target.quaternion[3];
});
rel.start();

var acc = { x: "", y: "", z: "" };
let acl = new Accelerometer();
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
acl.start();

var gyr = { x: "", y: "", z: "" };
let gyro = new Gyroscope();
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
gyro.start();

var linearAcc = { x: "", y: "", z: "" };
let lin = new LinearAccelerationSensor();
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
lin.start();

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

    readings.mag.x.push(magValues.x);
    readings.mag.y.push(magValues.y);
    readings.mag.z.push(magValues.z);

    readings.abs.w.push(absValues.w);
    readings.abs.x.push(absValues.x);
    readings.abs.y.push(absValues.y);
    readings.abs.z.push(absValues.z);

    readings.rel.w.push(relValues.w);
    readings.rel.x.push(relValues.x);
    readings.rel.y.push(relValues.y);
    readings.rel.z.push(relValues.z);

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
