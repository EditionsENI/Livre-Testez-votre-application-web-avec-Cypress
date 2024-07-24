
function postComment() {
    var userComment = document.getElementById('userComment').value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/post-comment", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('latest-posts').innerHTML += `<p>${userComment}</p>`;
            document.getElementById('userComment').value = '';
        }
    };

    var data = JSON.stringify({"comment": userComment});
    xhr.send(data);
    showSnackbar();
}


fetch('https://example.com/articles')
    .then(response => response.json())
    .then(data => {
        data.forEach(article => {
            document.getElementById('latest-posts').innerHTML += `<h3>${article.title}</h3><p>${article.content}</p>`;
        });
    });

function showSnackbar() {
        var snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}
