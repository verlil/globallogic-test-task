let books = [];
let keys = ["name", "author", "year", "genre", "pages", "price", "amount", "publisher"];
let currentBookId;
let bookList = document.getElementById("book-list").tBodies[0];
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://global-logic-test-task.firebaseio.com/books.json', true);
xhr.send();

let firstLoad = new Promise((resolve, reject) => {
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
            reject(xhr.statusText);
        } else {
            let data = JSON.parse(this.responseText);
            books = data;
            // console.log(data);
            // for (let key in data) {
            //     if (data.hasOwnProperty(key)) {
            //         books = (data[key]);
            //     }
            // }
            // console.log(books);
            resolve();
        }
    }
})

firstLoad.then(
    result => {
        updateTable();
    },
    error => console.log(error)
);

let confirmDeleteButton = document.getElementById("delete-book");
confirmDeleteButton.addEventListener("click", () => {
    books.splice(currentBookId, 1);
    console.log(books);
    document.getElementById("delete-book-popup").classList.add("hide");
    document.getElementById("shade").classList.add("hide");
    updateTable();
    updateDb();
})

function showEditBookPopup() {
    let id = this.name;
    document.getElementById("edit-book-form").bookId = id;

    document.getElementById("edit-book-popup").classList.remove("hide");
    document.getElementById("shade").classList.remove("hide");

    document.getElementById("edit-name").value = books[id].name;
    document.getElementById("edit-author").value = books[id].author;
    document.getElementById("edit-year").value = books[id].year;
    document.getElementById("edit-genre").value = books[id].genre;
    document.getElementById("edit-pages").value = books[id].pages;
    document.getElementById("edit-price").value = books[id].price;
    document.getElementById("edit-amount").value = books[id].amount;
    document.getElementById("edit-publisher").value = books[id].publisher;
}

function showAddBookPopup() {
    let popup = document.getElementById("add-book-popup");
    let shade = document.getElementById("shade");
    popup.classList.remove("hide");
    shade.classList.remove("hide");

}

function hidePopup(popup) {
    popup.parentElement.classList.add("hide");
    document.getElementById("shade").classList.add("hide");
}

function updateDb() {
    let xhttp = new XMLHttpRequest();
    let targetUrl = "https://global-logic-test-task.firebaseio.com/books.json";

    xhttp.onreadystatechange = function () {
        if (xhr.readyState != 4) return;

        if (xhr.status == 200) {
            console.log(this.responseText);
        } else {
            console.log(this.status, ":", this.responseText);
        }
    };

    xhttp.open("PUT", targetUrl, true);
    xhttp.send(JSON.stringify(books));
}

function updateTable() {
    let newList = document.createElement('tbody');
    books.forEach((book, i) => {
        let tr = document.createElement("tr");
        keys.forEach((key) =>{
            let td = document.createElement("td");
            let txt = document.createTextNode(book[key]);
            td.appendChild(txt);
            tr.appendChild(td);
        })
        let del = document.createElement("BUTTON");
        let edit = document.createElement("BUTTON");
        let delText = document.createTextNode("Delete");
        let editText = document.createTextNode("Edit");
        del.appendChild(delText);
        edit.appendChild(editText);
        del.setAttribute("name", `${i}`);
        edit.setAttribute("name", `${i}`);
        del.addEventListener("click", deleteBook);
        edit.addEventListener("click", showEditBookPopup);
        let td = document.createElement("td");
        td.appendChild(del);
        td.appendChild(edit);
        tr.appendChild(td);
        newList.appendChild(tr);
    });
    bookList.parentNode.replaceChild(newList, bookList);
    bookList = document.getElementById("book-list").tBodies[0]
}

function addBook(form) {
    let name = form.elements["name"].value;
    let author = form.elements["author"].value;
    let year = form.elements["year"].value;
    let genre = form.elements["genre"].value;
    let pages = form.elements["pages"].value;
    let price = form.elements["price"].value;
    let amount = form.elements["amount"].value;
    let publisher = form.elements["publisher"].value;

    books.push({
        "name": name,
        "author": author,
        "year": year,
        "genre": genre,
        "pages": pages,
        "price": price,
        "amount": amount,
        "publisher": publisher});

    form.parentElement.classList.add("hide");
    document.getElementById("shade").classList.add("hide");
    form.elements["name"].value = "";
    form.elements["author"].value = "";
    form.elements["year"].value = "";
    form.elements["genre"].value = "";
    form.elements["pages"].value = "";
    form.elements["price"].value = "";
    form.elements["amount"].value = "";
    form.elements["publisher"].value = "";
    updateTable();
    updateDb()
}

function saveEditedBook(form) {
    let id = document.getElementById("edit-book-form").bookId;
    books[id].name = form.elements["name"].value;
    books[id].author = form.elements["author"].value;
    books[id].year = form.elements["year"].value;
    books[id].genre = form.elements["genre"].value;
    books[id].pages = form.elements["pages"].value;
    books[id].price = form.elements["price"].value;
    books[id].amount = form.elements["amount"].value;
    books[id].publisher = form.elements["publisher"].value;
    updateTable();
    updateDb();
    document.getElementById("edit-book-popup").classList.add("hide");
    document.getElementById("shade").classList.add("hide");
}

function deleteBook() {
    currentBookId = this.name;
    showConfirmDeletePopup();
}

function showConfirmDeletePopup() {
    let popup = document.getElementById("delete-book-popup");
    let shade = document.getElementById("shade");
    popup.classList.remove("hide");
    shade.classList.remove("hide");
}