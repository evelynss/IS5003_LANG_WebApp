import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  return <div className="App" />;
}

var bigOne = document.getElementById("bigOne");
var dbref = firebase
  .database()
  .ref()
  .child("text");
dbref.on("value", snap => (bigOne.innerText = snap.val()));

//get elements
const preObject = document.getElementById("object");
const ulList = document.getElementById("list");
//create reference
const dbRefObject = firebase
  .database()
  .ref()
  .child("object");

//sync object changes
dbRefObject.on("value", snap => {
  preObject.innerText = JSON.stringify(snap.val(), null, 3);
});
//sync child add
const dbRefList = dbRefObject.child("Hobbies");
dbRefList.on("child_added", snap => {
  const li = document.createElement("li");
  li.innerText = snap.val();
  ulList.appendChild(li);
});
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
