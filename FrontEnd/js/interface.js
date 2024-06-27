document.getElementById("login-link").addEventListener("click", () => { 
    let logLink = document.getElementById('login-link');

    if(logLink.innerText === 'logout'){
        sessionStorage.clear();
    }
  });

function updateInterface() {
    const token = sessionStorage.getItem("token");
    let modifyBtn = document.getElementById("open-modal");
    let editMode = document.getElementById("edit-mode");
    let logLink = document.getElementById('login-link');
    
    if(token){
        modifyBtn.style.display = 'flex';
        editMode.style.display = 'flex';
        logLink.innerText = 'logout';
        logLink.style.fontWeight = 'bold';
    }else{
        modifyBtn.style.display = 'none';
        editMode.style.display = 'none';
        logLink.innerText = 'login';
        logLink.style.fontWeight = 'normal';
    }
}

updateInterface();