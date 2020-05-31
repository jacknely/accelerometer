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
  timeInMs = Date.now();
  recording();
});
sensor.start();

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
  result.innerHTML = `<a href="${resp}" target="_blank">Show File</a>`;
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
