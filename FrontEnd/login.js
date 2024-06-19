function submitLogin(){
    const form = document.getElementById('form-login');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("FORM SUBMIT")
        const email = form.elements[0];
        const password = form.elements[1];
        console.log("▶︎", "Email: ", email.value);
        console.log("▶︎", "Password: ", password.value);
        //TODO: verifier l'email et le mot de passe (pas vides + format)
        //TODO: puis fetch POST
    });

}

submitLogin();