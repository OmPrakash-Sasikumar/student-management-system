window.onload = function(){
    loadStudents();
};

let addBtn = document.getElementById("addStudent");

addBtn.addEventListener("click", function(){

    let name = document.getElementById("name").value;
    let roll = document.getElementById("roll").value;
    let dept = document.getElementById("dept").value;
    let dob = document.getElementById("dob").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let marks = document.getElementById("marks").value;

    if(name === "" || roll === "" || dept === ""){
        alert("Fill all fields!");
        return;
    }

 let editId = addBtn.getAttribute("data-edit-id");

let url = editId ? "update.php" : "insert.php";

let bodyData = "name=" + name +
               "&roll=" + roll +
               "&dept=" + dept +
               "&dob=" + dob +
               "&phone=" + phone +
               "&address=" + address +
               "&marks=" + marks;

if(editId){
    bodyData += "&id=" + editId;
}

fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: bodyData
})
.then(response => response.text())
.then(data => {
    if(data === "success"){
        alert(editId ? "Updated " : "Student Added ");

        addBtn.removeAttribute("data-edit-id");

        document.getElementById("name").value="";
        document.getElementById("roll").value="";
        document.getElementById("dept").value="";
        document.getElementById("dob").value="";
        document.getElementById("phone").value="";
        document.getElementById("address").value="";
        document.getElementById("marks").value="";

        loadStudents();
    } else {
        alert("Error ");
    }
});   

   
});


function loadStudents(){
    fetch("fetch.php")
    .then(res => res.text())
    .then(data => {
        document.getElementById("studentList").innerHTML = data;
        updateCount();
    });
}

function showProfile(li){

    let data = li.getAttribute("data-full").split("|");

    document.getElementById("profileBox").style.display = "block";

    document.getElementById("p_name").innerText = "Name: " + data[0];
    document.getElementById("p_roll").innerText = "Roll: " + data[1];
    document.getElementById("p_dept").innerText = "Dept: " + data[2];
    document.getElementById("p_dob").innerText = "DOB: " + data[3];
    document.getElementById("p_phone").innerText = "Phone: " + data[4];
    document.getElementById("p_address").innerText = "Address: " + data[5];
    document.getElementById("p_marks").innerText = "Marks: " + data[6];

    let gradeText = data[7] ? data[7] : "N/A";
    let gradeEl = document.getElementById("p_grade");

    gradeEl.innerText = "Grade: " + gradeText;

    if(gradeText === "A") gradeEl.style.color = "green";
    else if(gradeText === "B") gradeEl.style.color = "blue";
    else if(gradeText === "C") gradeEl.style.color = "orange";
    else gradeEl.style.color = "red";
    document.getElementById("p_age").innerText = "Age: " + (data[8] ? data[8] : "N/A");
}


function deleteStudent(event, btn){

    event.stopPropagation(); 

    let li = btn.parentElement;
    let id = li.getAttribute("data-id");

    let confirmDelete = confirm("Delete this student?");

    if(!confirmDelete) return;

    fetch("delete.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + id
    })
    .then(res => res.text())
    .then(data => {
        if(data === "success"){
            alert("Deleted ");
            loadStudents();
        } else {
            alert("Error");
        }
    });
}

function editStudent(event, btn){

    event.stopPropagation();

    let li = btn.parentElement;

    let id = li.getAttribute("data-id");
    let data = li.getAttribute("data-full").split("|");

    document.getElementById("name").value = data[0];
    document.getElementById("roll").value = data[1];
    document.getElementById("dept").value = data[2];
    document.getElementById("dob").value = data[3];
    document.getElementById("phone").value = data[4];
    document.getElementById("address").value = data[5];
    document.getElementById("marks").value = data[6];

    document.getElementById("addStudent").setAttribute("data-edit-id", id);
}


let searchBox = document.getElementById("searchBox");

searchBox.addEventListener("keyup", function(){

    let filter = searchBox.value.toLowerCase();
    let students = document.getElementById("studentList").getElementsByTagName("li");

    for(let i=0; i<students.length; i++){

        let text = students[i].innerText.toLowerCase();

        if(text.includes(filter)){
            students[i].style.display = "";
        } else {
            students[i].style.display = "none";
        }
    }
});


function updateCount(){
    let count = document.getElementById("studentList").children.length;
    document.getElementById("count").innerText = "Total Students: " + count;
}

let clearBtn = document.getElementById("clearAll");

clearBtn.addEventListener("click", function(){

    let confirmClear = confirm("Delete ALL students?");

    if(!confirmClear) return;

    fetch("clear.php")
    .then(res => res.text())
    .then(data => {
        if(data === "success"){
            alert("All Students Deleted ");
            loadStudents();
        } else {
            alert("Error");
        }
    });
});

let sortBtn = document.getElementById("sortBtn");

let sortOrder = "ASC";

sortBtn.addEventListener("click", function(){

    fetch("fetch.php?order=" + sortOrder)
    .then(res => res.text())
    .then(data => {
        document.getElementById("studentList").innerHTML = data;

        sortOrder = (sortOrder === "ASC") ? "DESC" : "ASC";

        sortBtn.innerText = sortOrder === "ASC" ? "Sort A-Z" : "Sort Z-A";
    });
});

function logout(){
    window.location.href = "logout.php";
}

function openDashboard(){
    window.location.href = "dashboard.php";
}

function goDashboard(){
    window.location.href = "dashboard.php";
}

function goHome(){
    window.location.href = "index.html";
}

function logout(){
    window.location.href = "logout.php";
}

function exportData(){
    window.location.href = "export.php";
}