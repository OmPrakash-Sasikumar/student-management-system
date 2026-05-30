let useClient = false;
let addBtn = document.getElementById("addStudent");

window.onload = function(){
    if(document.getElementById('studentList')){
        loadStudents();
    } else if(document.getElementById('totalCount')){
        loadDashboardPage();
    }
};

function getStudentsFromStorage(){
    try{
        return JSON.parse(localStorage.getItem('sms_students') || '[]');
    } catch(e){
        return [];
    }
}

function saveStudentsToStorage(arr){
    localStorage.setItem('sms_students', JSON.stringify(arr));
}

function isClientLoggedIn(){
    return localStorage.getItem('sms_logged_in') === '1';
}

function clientLogin(){
    localStorage.setItem('sms_logged_in', '1');
}

function clientLogout(){
    localStorage.removeItem('sms_logged_in');
}

function renderClientStudents(arr){
    let html = '';
    arr.forEach(row => {
        let marks = Number(row.marks) || 0;
        let grade = 'Fail';
        if(marks >= 90) grade = 'A';
        else if(marks >= 75) grade = 'B';
        else if(marks >= 50) grade = 'C';

        let dob = row.dob || '';
        let age = 'N/A';
        if(dob && dob !== '0000-00-00'){
            let birth = new Date(dob);
            let today = new Date();
            age = today.getFullYear() - birth.getFullYear();
        }

        let dataFull = [row.name, row.roll, row.dept, dob, row.phone||'', row.address||'', row.marks||'', grade, age].join('|');
        html += "<li onclick='showProfile(this)' data-id='" + (row.id || '') + "' data-full='" + dataFull + "'>";
        html += (row.name || '') + " | " + (row.roll || '') + " | " + (row.dept || '') + " | Grade: " + grade;
        html += " <button class='edit-btn' onclick=\"editStudent(event,this)\">Edit</button>";
        html += " <button class='delete-btn' onclick=\"deleteStudent(event,this)\">Delete</button>";
        html += "</li>";
    });
    document.getElementById('studentList').innerHTML = html;
}

function loadStudentsClient(){
    let arr = getStudentsFromStorage();
    renderClientStudents(arr);
    updateCount();
}

function loadDashboardPage(){
    let arr = getStudentsFromStorage();
    let total = arr.length;
    let avg = total ? arr.reduce((sum, s) => sum + Number(s.marks || 0), 0) / total : 0;
    let top = arr.slice().sort((a,b) => Number(b.marks || 0) - Number(a.marks || 0))[0] || null;

    document.getElementById('totalCount').innerText = total;
    document.getElementById('avgMarks').innerText = avg.toFixed(2);
    document.getElementById('topStudent').innerText = top ? top.name + ' (' + top.marks + ')' : 'N/A';

    let names = arr.map(s => s.name || '');
    let marks = arr.map(s => Number(s.marks || 0));

    if(document.getElementById('myChart')){
        let ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: names,
                datasets: [{
                    label: 'Student Marks',
                    data: marks,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            }
        });
    }
}

function genId(){
    let arr = getStudentsFromStorage();
    let max = arr.reduce((m, i) => Math.max(m, Number(i.id) || 0), 0);
    return String(max + 1);
}

if(addBtn){
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
        let bodyData = "name=" + encodeURIComponent(name) +
                       "&roll=" + encodeURIComponent(roll) +
                       "&dept=" + encodeURIComponent(dept) +
                       "&dob=" + encodeURIComponent(dob) +
                       "&phone=" + encodeURIComponent(phone) +
                       "&address=" + encodeURIComponent(address) +
                       "&marks=" + encodeURIComponent(marks);

        if(editId){
            bodyData += "&id=" + encodeURIComponent(editId);
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
                alert(editId ? "Updated" : "Student Added");
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
                useClient = true;
                let arr = getStudentsFromStorage();
                if(editId){
                    for(let i=0;i<arr.length;i++) if(String(arr[i].id)===String(editId)){
                        arr[i].name = name; arr[i].roll = roll; arr[i].dept = dept; arr[i].dob = dob; arr[i].phone = phone; arr[i].address = address; arr[i].marks = marks;
                        break;
                    }
                    alert('Updated (client)');
                } else {
                    let id = genId();
                    arr.push({id:id,name:name,roll:roll,dept:dept,dob:dob,phone:phone,address:address,marks:marks});
                    alert('Student Added (client)');
                }
                saveStudentsToStorage(arr);
                addBtn.removeAttribute('data-edit-id');
                document.getElementById("name").value="";
                document.getElementById("roll").value="";
                document.getElementById("dept").value="";
                document.getElementById("dob").value="";
                document.getElementById("phone").value="";
                document.getElementById("address").value="";
                document.getElementById("marks").value="";
                loadStudents();
            }
        })
        .catch(err => {
            console.warn('Server unavailable, switching to client mode', err);
            useClient = true;
            let arr = getStudentsFromStorage();
            if(editId){
                for(let i=0;i<arr.length;i++) if(String(arr[i].id)===String(editId)){
                    arr[i].name = name; arr[i].roll = roll; arr[i].dept = dept; arr[i].dob = dob; arr[i].phone = phone; arr[i].address = address; arr[i].marks = marks;
                    break;
                }
                alert('Updated (client)');
            } else {
                let id = genId();
                arr.push({id:id,name:name,roll:roll,dept:dept,dob:dob,phone:phone,address:address,marks:marks});
                alert('Student Added (client)');
            }
            saveStudentsToStorage(arr);
            addBtn.removeAttribute('data-edit-id');
            document.getElementById("name").value="";
            document.getElementById("roll").value="";
            document.getElementById("dept").value="";
            document.getElementById("dob").value="";
            document.getElementById("phone").value="";
            document.getElementById("address").value="";
            document.getElementById("marks").value="";
            loadStudents();
        });
    });
}

function loadStudents(){
    fetch("fetch.php")
    .then(res => res.text())
    .then(data => {
        let trimmed = data ? data.trim() : '';
        if(trimmed && trimmed.indexOf('<?php') === -1 && /<li[\s>]/i.test(trimmed)){
            document.getElementById("studentList").innerHTML = data;
            updateCount();
        } else {
            useClient = true;
            loadStudentsClient();
        }
    })
    .catch(err => {
        console.warn('Fetch failed, using client fallback', err);
        useClient = true;
        loadStudentsClient();
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

    if(useClient){
        let arr = getStudentsFromStorage();
        arr = arr.filter(s => String(s.id) !== String(id));
        saveStudentsToStorage(arr);
        alert('Deleted');
        loadStudents();
        return;
    }

    fetch("delete.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "id=" + encodeURIComponent(id)
    })
    .then(res => res.text())
    .then(data => {
        if(data === "success"){
            alert("Deleted");
            loadStudents();
        } else {
            useClient = true;
            let arr = getStudentsFromStorage();
            arr = arr.filter(s => String(s.id) !== String(id));
            saveStudentsToStorage(arr);
            alert('Deleted (client)');
            loadStudents();
        }
    })
    .catch(err => {
        useClient = true;
        let arr = getStudentsFromStorage();
        arr = arr.filter(s => String(s.id) !== String(id));
        saveStudentsToStorage(arr);
        alert('Deleted (client)');
        loadStudents();
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
if(searchBox){
    searchBox.addEventListener("keyup", function(){
        let filter = searchBox.value.toLowerCase();
        let students = document.getElementById("studentList").getElementsByTagName("li");
        for(let i=0; i<students.length; i++){
            let text = students[i].innerText.toLowerCase();
            students[i].style.display = text.includes(filter) ? "" : "none";
        }
    });
}

function updateCount(){
    let count = document.getElementById("studentList").children.length;
    document.getElementById("count").innerText = "Total Students: " + count;
}

let clearBtn = document.getElementById("clearAll");
if(clearBtn){
    clearBtn.addEventListener("click", function(){
        let confirmClear = confirm("Delete ALL students?");
        if(!confirmClear) return;

        if(useClient){
            saveStudentsToStorage([]);
            alert('All Students Deleted');
            loadStudents();
            return;
        }

        fetch("clear.php")
        .then(res => res.text())
        .then(data => {
            if(data === "success"){
                alert("All Students Deleted");
                loadStudents();
            } else {
                useClient = true;
                saveStudentsToStorage([]);
                alert('All Students Deleted (client)');
                loadStudents();
            }
        })
        .catch(err => {
            useClient = true;
            saveStudentsToStorage([]);
            alert('All Students Deleted (client)');
            loadStudents();
        });
    });
}

let sortBtn = document.getElementById("sortBtn");
let sortOrder = "ASC";
if(sortBtn){
    sortBtn.addEventListener("click", function(){
        if(useClient){
            let arr = getStudentsFromStorage();
            arr.sort((a,b)=> sortOrder==='ASC' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
            renderClientStudents(arr);
            sortOrder = (sortOrder === "ASC") ? "DESC" : "ASC";
            sortBtn.innerText = sortOrder === "ASC" ? "Sort A-Z" : "Sort Z-A";
            return;
        }

        fetch("fetch.php?order=" + sortOrder)
        .then(res => res.text())
        .then(data => {
            document.getElementById("studentList").innerHTML = data;
            sortOrder = (sortOrder === "ASC") ? "DESC" : "ASC";
            sortBtn.innerText = sortOrder === "ASC" ? "Sort A-Z" : "Sort Z-A";
        })
        .catch(err => {
            useClient = true;
            let arr = getStudentsFromStorage();
            arr.sort((a,b)=> sortOrder==='ASC' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
            renderClientStudents(arr);
            sortOrder = (sortOrder === "ASC") ? "DESC" : "ASC";
            sortBtn.innerText = sortOrder === "ASC" ? "Sort A-Z" : "Sort Z-A";
        });
    });
}

function logout(){
    if(useClient){
        clientLogout();
        window.location.href = 'login.html';
        return;
    }
    window.location.href = "logout.php";
}

function goDashboard(){
    if(useClient){
        window.location.href = "dashboard.html";
        return;
    }
    window.location.href = "dashboard.php";
}

function goHome(){
    if(useClient){
        window.location.href = "index.html";
        return;
    }
    window.location.href = "index.php";
}

function exportData(){
    if(useClient){
        let arr = getStudentsFromStorage();
        if(!arr.length){ alert('No data to export'); return; }
        let csv = 'Name,Roll,Dept,DOB,Phone,Address,Marks\\n';
        arr.forEach(r => {
            csv += '"'+(r.name||'')+'","'+(r.roll||'')+'","'+(r.dept||'')+'","'+(r.dob||'')+'","'+(r.phone||'')+'","'+(r.address||'')+'","'+(r.marks||'')+'"\\n';
        });
        let blob = new Blob([csv], {type: 'text/csv'});
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url; a.download = 'students.csv'; document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        return;
    }

    window.location.href = "export.php";
}
