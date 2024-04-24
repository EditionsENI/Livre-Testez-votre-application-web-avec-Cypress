var users = [
    { username: "user1", password: "pass1" },
    { username: "user2", password: "pass2" }
];

var expectedTOTP = "123456";

function authenticate(username, password) {
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('totpForm').style.display = 'block';

        fetch('/mfa/send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.email }), 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi du code MFA');
            }
            console.log('Code MFA envoyé avec succès');
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    } else {
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
}


function validateTOTP(mfaCode) {
    if (mfaCode === expectedTOTP) {
        window.location.href = './index.html';
    } else {
        var x = document.getElementById("snackbar-mfa");
        document.getElementById("snackbar-mfa").style.display = 'block'
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
}
