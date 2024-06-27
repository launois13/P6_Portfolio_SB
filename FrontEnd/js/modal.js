import { fetchWorks } from "./gallery.js";

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
    const modal = document.getElementById('modal');

    buttonOpen.addEventListener('click', () => {
        document.body.style.overflowY = "hidden";
        modal.classList.add('open-modal');
        window.scrollTo(0, 0);
        getWorks(); // Assurez-vous que cette ligne est présente
        renderPage('gallery'); // Afficher la page de la galerie par défaut
    });

    buttonClose.addEventListener('click', () => {
        document.body.style.overflowY = "scroll";
        modal.classList.remove('open-modal');
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
            "Authorization": `Baerer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            console.log(`Work with id ${workId} deleted`);
            getWorks(); // Refresh the gallery after deletion
        } else {
            console.error('Failed to delete work');
        }
    })
    .catch(error => console.error('Error:', error));
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

// Assurez-vous que le script s'exécute après le chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de la modale
    openModal();

    // Ajouter les événements pour naviguer entre les pages de la modale
    document.getElementById('nav-gallery').addEventListener('click', () => renderPage('gallery'));
    document.getElementById('nav-add-photo').addEventListener('click', () => renderPage('add-photo'));
});
