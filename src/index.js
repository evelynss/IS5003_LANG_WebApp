import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  return <div className="App" />;
}

// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const matRef = dbRef.child("materials");

readmatData();

// --------------------------
// READ
// --------------------------
function readmatData() {
  const matListUI = document.getElementById("mat-list");

  matRef.on("value", snap => {
    matListUI.innerHTML = "";

    snap.forEach(childSnap => {
      let key = childSnap.key,
        value = childSnap.val();

      let $li = document.createElement("li");

      // edit icon
      let editIconUI = document.createElement("span");
      editIconUI.class = "edit-mat";
      editIconUI.innerHTML = " ✎";
      editIconUI.setAttribute("matid", key);
      editIconUI.addEventListener("click", editButtonClicked);

      // delete icon
      let deleteIconUI = document.createElement("span");
      deleteIconUI.class = "delete-mat";
      deleteIconUI.innerHTML = " ☓";
      deleteIconUI.setAttribute("matid", key);
      deleteIconUI.addEventListener("click", deleteButtonClicked);

      $li.innerHTML = value.name;
      $li.append(editIconUI);
      $li.append(deleteIconUI);

      $li.setAttribute("mat-key", key);
      $li.addEventListener("click", matClicked);
      matListUI.append($li);
    });
  });
}

function matClicked(e) {
  var matID = e.target.getAttribute("mat-key");

  const matRef = dbRef.child("materials/" + matID);
  const matDetailUI = document.getElementById("mat-detail");

  matRef.on("value", snap => {
    matDetailUI.innerHTML = "";

    snap.forEach(childSnap => {
      var $p = document.createElement("p");
      $p.innerHTML = childSnap.key + " - " + childSnap.val();
      matDetailUI.append($p);
    });
  });
}

// --------------------------
// ADD
// --------------------------

const addmatBtnUI = document.getElementById("add-mat-btn");
addmatBtnUI.addEventListener("click", addmatBtnClicked);

function addmatBtnClicked() {
  const matRef = dbRef.child("materials");

  const addmatInputsUI = document.getElementsByClassName("mat-input");

  // this object will hold the new mat information
  let newmat = {};

  // loop through View to get the data for the model
  for (let i = 0, len = addmatInputsUI.length; i < len; i++) {
    let key = addmatInputsUI[i].getAttribute("data-key");
    let value = addmatInputsUI[i].value;
    newmat[key] = value;
  }

  matRef.push(newmat);

  //console.log(myPro);
}

// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(e) {
  e.stopPropagation();

  var matID = e.target.getAttribute("matid");

  const matRef = dbRef.child("materials/" + matID);

  matRef.remove();
}

// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {
  document.getElementById("edit-mat-module").style.display = "block";

  //set mat id to the hidden input field
  document.querySelector(".edit-matid").value = e.target.getAttribute("matid");

  const matRef = dbRef.child("materials/" + e.target.getAttribute("matid"));

  // set data to the mat field
  const editmatInputsUI = document.querySelectorAll(".edit-mat-input");

  matRef.on("value", snap => {
    for (var i = 0, len = editmatInputsUI.length; i < len; i++) {
      var key = editmatInputsUI[i].getAttribute("data-key");
      editmatInputsUI[i].value = snap.val()[key];
    }
  });

  const saveBtn = document.querySelector("#edit-mat-btn");
  saveBtn.addEventListener("click", savematBtnClicked);
}

function savematBtnClicked(e) {
  const matID = document.querySelector(".edit-matid").value;
  const matRef = dbRef.child("materials/" + matID);

  var editedmatObject = {};

  const editmatInputsUI = document.querySelectorAll(".edit-mat-input");

  editmatInputsUI.forEach(function(textField) {
    let key = textField.getAttribute("data-key");
    let value = textField.value;
    editedmatObject[textField.getAttribute("data-key")] = textField.value;
  });

  matRef.update(editedmatObject);

  document.getElementById("edit-mat-module").style.display = "none";
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
