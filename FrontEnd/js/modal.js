import { fetchWorks, init } from "./gallery.js";

let isRunning = false;

// Fonction pour afficher toutes les photos avec les corbeilles
function renderAllWorks(works) {
    const galleryContainer = document.querySelector('.gallery-modal');
    if (!galleryContainer) {
        console.error('Gallery container not found');
        return;
    }
    galleryContainer.innerHTML = ''; // Vider la galerie existante

    works.forEach(work => {
        const figure = document.createElement('figure');
        figure.dataset.id = work.id;

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.alt = work.title;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('delete-work');
        deleteBtn.addEventListener('click', () => deleteWork(work.id));

        const deleteIcon = document.createElement('img');
        deleteIcon.src = './assets/icons/trash.svg';
        deleteIcon.alt = 'poubelle';
        deleteIcon.style.width='14px';
        deleteIcon.style.height='14px';

        deleteBtn.appendChild(deleteIcon);

        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        galleryContainer.appendChild(figure);
    });
}

// Fonction pour récupérer les travaux et les afficher
function getWorks() {
    fetchWorks()
    .then(fetchedWorks => {
        console.log('Tous les projets :', fetchedWorks);
        renderAllWorks(fetchedWorks);
    })
    .catch(error => console.error(error));
}

// Fonction pour réinitialiser la modale de prévisualisation
function resetPreviewModal() {
    const previewImg = document.getElementById('image-preview');
    const uploadSetup = document.getElementById('upload-file');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('categories');

    previewImg.src = "./assets/icons/add-image.svg"; // Changer le chemin de l'icône si nécessaire
    previewImg.style.display = 'none';
    uploadSetup.style.display = 'contents';
    titleInput.value = "";
    categorySelect.selectedIndex = 0;
    console.log("pouet")
}

// Fonction pour ouvrir la modale
function openModal() {
    const buttonOpen = document.getElementById('open-modal');
    const buttonClose = document.getElementById('close-modal');
    const buttonBack = document.getElementById('back-modal');
    const modal = document.getElementById('modal');

    buttonOpen.addEventListener('click', () => {
        //document.body.style.overflowY = "hidden"; // Empêcher le défilement de la page
        modal.classList.add('open-modal');
       // window.scrollTo(0, 0); // Remonter en haut de la page
        getWorks(); // Assurez-vous que cette ligne est présente
        renderPage('gallery'); // Afficher la page de la galerie par défaut
    });

    buttonClose.addEventListener('click', () => {
        document.body.style.overflowY = "scroll";
        modal.classList.remove('open-modal');
    });

    buttonBack.addEventListener('click', () => {
        renderPage('gallery');
    });

    modal.addEventListener('click', (e) => {
        if(e.target.id === "modal"){
            document.body.style.overflowY = "scroll";
            modal.classList.remove('open-modal');
        }
    });
}

// Fonction pour supprimer un travail
function deleteWork(workId) {
    const token = sessionStorage.getItem("token");

    fetch(`http://localhost:5678/api/works/${workId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log(`Work with id ${workId} deleted`);
            getWorks(); // Refresh the gallery after deletion
            init();
        } else {
            console.error('Failed to delete work');
        }
    })
    .catch(error => console.error('Error:', error));
}
const inputFile = document.getElementById('file');
//Fonction de création d'un travail
function createWork(){

    if (isRunning) return;

    isRunning = true;
    console.log("createWork demaree");

    const form = document.getElementById('form-create-work');
    

    inputFile.addEventListener('change', (e)=>{
        const previewImg = document.getElementById('image-preview');
        const uploadSetup = document.getElementById('upload-file');
        previewImg.src = URL.createObjectURL(form.elements[0].files[0])

        previewImg.style.display = 'block'
        uploadSetup.style.display = 'none';
    }, true)

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const image = form.elements[0];
        const title = form.elements[1];
        const categoryId = form.elements[2];



        // Récupération du token
        const token = sessionStorage.getItem("token");

        // Creation du formData
        const formData = new FormData();
        formData.append("image", image.files[0]);
        formData.append("title", title.value);
        formData.append("category", categoryId.value);

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        })
        .then(response => {
            console.log('createWork() response:', response);
            title.value = "";
            document.getElementById('categories').selectedIndex = 0;
            const uploadButton = document.getElementById('upload-file');
            console.info(response);
            getWorks(); // Refresh the gallery after deletion
            init();
            resetPreviewModal();
            const modal = document.getElementById('modal');
            modal.classList.remove('open-modal');
        })
        .catch(error => console.error('Error:', error));
        console.log("ouhlala")
    })
}

// Fonction de rendu pour les deux pages
function renderPage(page) {
    const galleryPage = document.getElementById('gallery-page');
    const addPhotoPage = document.getElementById('add-photo-page');
    const uploadImg = document.getElementById("nav-gallery");

    if (page === 'gallery') {
        galleryPage.classList.add('active');
        addPhotoPage.classList.remove('active');
    } else if (page === 'add-photo') {
        uploadImg.setAttribute("disabled", true);
        galleryPage.classList.remove('active');
        addPhotoPage.classList.add('active');
        createWork();
    }
}


inputFile.addEventListener('change', (e) => {
    const previewImg = document.getElementById('image-preview');
    const uploadSetup = document.getElementById('upload-file');
    const file = e.target.files[0];

    // Vérifiez si un fichier est sélectionné
    if (file) {
        // Vérifiez si le fichier est une image
        if (file.type == "image/png" || file.type == "image/jpeg") {
            previewImg.src = URL.createObjectURL(file);
            previewImg.style.display = 'block';
            uploadSetup.style.display = 'none';
        } else {
            alert('Veuillez sélectionner un fichier image.');
        }
    }
});

// Vérifier que le script s'exécute après le chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de la modale
    openModal();

// img field
const imgUpload = document.getElementById("file");
// title
const title = document.getElementById("title");
// option select
const option = document.getElementById("categories");
// input "valider"
const uploadImg = document.getElementById("nav-gallery");

function checkImageSize() {
    const errorImageSize = 'L’image est trop grande';
    // Check if any file is selected.
    if (imgUpload.files.length > 0) {
        // For each file uploaded
        for (let i = 0; i <= imgUpload.files.length - 1; i++) {
            const fsize = imgUpload.files.item(i).size;
            // If the file is greater than 4MB, it's too big
            if (fsize > 4 * 1024 * 1024) { // 4MB
                // errorMessages.push(errorImageSize);
                console.log('Too big');
                return false;
            }
            // Else it's OK
            else {
                // errorMessages.filter(message => message !== errorImageSize);
                console.log('perfect size');
                return true;
            }
        }
    }
}

function checkTitle() {
    const emptyTitle = 'Le titre est vide';
    if (title.value === "") {
        // errorMessages.push(emptyTitle);
        console.log('Empty title');
        return false;
    } else {
        // errorMessages.filter(message => message !== emptyTitle);
        console.log('perfect title');
        return true;
    }
}

function checkOptions() {
    const emptyCategory = 'La catégorie n’est pas sélectionnée';
    if (option.selectedIndex === 0) {
        // errorMessages.push(emptyCategory);
        console.log('No category selected');
        return false;
    } else {
        // errorMessages.filter(message => message !== emptyCategory);
        console.log('perfect category');
        return true;
    }
}

// Check if all fields are filled before allowing to send
function checkFields() {
    // Check if any file is selected.
    if (checkTitle() && checkOptions() && checkImageSize()) {
        // Empty errorMessages
        // errorMessages = [];
        uploadImg.removeAttribute("disabled");
    } else {
        uploadImg.setAttribute("disabled", true);
    }
}

// Appelle cette fonction au chargement de la page pour réinitialiser la modale de prévisualisation
document.addEventListener('DOMContentLoaded', () => {
    resetPreviewModal();
});

title.addEventListener("input", checkFields);
option.addEventListener("change", checkFields);
imgUpload.addEventListener("change", checkFields);

    // Ajouter les événements pour naviguer entre les pages de la modale
    document.getElementById('nav-gallery').addEventListener('click', () => renderPage('gallery'));
    document.getElementById('nav-add-photo').addEventListener('click', () => renderPage('add-photo'));
});

