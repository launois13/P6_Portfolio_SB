import { fetchWorks, init } from "./gallery.js";

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
        createWork();
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

// Fonction de création d'un travail
function createWork(){
    const form = document.getElementById('form-create-work');
    const inputFile = document.getElementById('file');

    inputFile.addEventListener('change', (e)=>{
        const previewImg = document.getElementById('image-preview');
        const uploadSetup = document.getElementById('upload-file');
        previewImg.src = URL.createObjectURL(form.elements[0].files[0])
        previewImg.style.display = 'block';
        uploadSetup.style.display = 'none';
    }, true)

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const image = form.elements[0];
        const title = form.elements[1];
        const categoryId = form.elements[2];

        //TODO: Vérifier le titre, l'image et la categorie...

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
            console.info(response);
            getWorks(); // Refresh the gallery after deletion
            init();
        })
        .catch(error => console.error('Error:', error));
    })
}

// Fonction de rendu pour les deux pages
function renderPage(page) {
    const galleryPage = document.getElementById('gallery-page');
    const addPhotoPage = document.getElementById('add-photo-page');

    if (page === 'gallery') {
        galleryPage.classList.add('active');
        addPhotoPage.classList.remove('active');
    } else if (page === 'add-photo') {
        galleryPage.classList.remove('active');
        addPhotoPage.classList.add('active');
    }
}

// Vérifier que le script s'exécute après le chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de la modale
    openModal();

    // Ajouter les événements pour naviguer entre les pages de la modale
    document.getElementById('nav-gallery').addEventListener('click', () => renderPage('gallery'));
    document.getElementById('nav-add-photo').addEventListener('click', () => renderPage('add-photo'));
});
