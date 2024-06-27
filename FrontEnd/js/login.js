
function submitLogin(){
    const form = document.getElementById('form-login');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("FORM SUBMIT")
        const email = form.elements[0];
        const password = form.elements[1];
        console.log("▶︎ Email: ", email.value);
        console.log("▶︎ Password: ", password.value);
        let errorDiv = document.getElementById("error-message");
        let inputs = document.getElementsByClassName('inputs-login');

        if(email.value && password.value){
            // les deux valeurs sont OK ✅
            console.info('les deux valeurs sont OK ✅')
            //TODO: si fetch OK alors redirect (push) sinon afficher erreur msg
            try {
                //fetch(URL, OPTIONS);
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "email": email.value,
                        "password": password.value
                    })
                });
                const loginData = await response.json();

                if(response.status === 200){
                    // enregistrer le token dans le sessionStorage
                    sessionStorage.setItem("token", loginData.token);
                    // redirection vers la page d'accueil
                    window.location.href = "/FrontEnd/index.html";
                } else if (response.status === 404) {
                    errorDiv.style.display = "block";
                    errorDiv.innerText = "Aucun utilisateur n'a été trouvé avec cette adresse email.";
                    inputs[0].style.border = "1px solid red";
                    inputs[1].style.border = "1px solid red";
                    console.error('Erreur lors de la connexion :', loginData.message);
                } else if (response.status === 401) {
                    errorDiv.style.display = "block";
                    errorDiv.innerText = "Veuillez entrer un mot de passe corrects.";
                    inputs[0].style.border = "1px solid red";
                    inputs[1].style.border = "1px solid red";
                    console.error('Erreur lors de la connexion :', loginData.error);
                }
              } catch (error) {
                errorDiv.style.display = "block";
                errorDiv.innerText = "Veuillez entrer une adresse email et un mot de passe corrects.";
                inputs[0].style.border = "1px solid red";
                inputs[1].style.border = "1px solid red";
                console.error('Erreur lors de la connexion :', error);
              }
        } else {
            errorDiv.style.display = "block";
            errorDiv.innerText = "Le mot de passe ne peut etre vide.";
            inputs[0].style.border = "1px solid red";
            inputs[1].style.border = "1px solid red";
        }
    });

}

submitLogin();