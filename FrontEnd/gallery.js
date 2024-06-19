// Récupération des travaux depuis le backend
async function fetchWorks() {
    try {
      const response = await fetch('http://localhost:5678/api/works');
      const works = await response.json();
      return works;
    } catch (error) {
      console.error('Erreur lors de la récupération des travaux :', error);
    }
  }
  
  // Récupération des catégories depuis le backend
  async function fetchCategories() {
    try {
      const response = await fetch('http://localhost:5678/api/categories');
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories :', error);
    }
  }
  
  // Affichage des travaux dans la galerie
  function displayWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Suppression du contenu statique
  
    works.forEach(work => {
      const workElement = document.createElement('div');
      workElement.classList.add('work');
  
      const imageElement = document.createElement('img');
      imageElement.src = work.imageUrl;
      imageElement.alt = work.title;
      workElement.appendChild(imageElement);
  
      const titleElement = document.createElement('h3');
      titleElement.textContent = work.title;
      workElement.appendChild(titleElement);
  
      gallery.appendChild(workElement);
    });
  }
  
  // Génération du menu de catégories
  function generateCategoryMenu(categories) {
    const categoryMenu = document.createElement('div');
    categoryMenu.classList.add('filter-list');

    function removeActivatedClass(){
      const activatedButtonCat = document.getElementsByClassName('activated-button')[0];
      activatedButtonCat.classList.remove('activated-button');
    }
  
    const allCategoriesButton = document.createElement('button');
    allCategoriesButton.textContent = 'Tous';
    allCategoriesButton.classList.add('filter-button');
    allCategoriesButton.classList.add('activated-button');
    allCategoriesButton.addEventListener('click', () => {
      displayWorks(works);
      removeActivatedClass();
      allCategoriesButton.classList.add('activated-button');
    });
    categoryMenu.appendChild(allCategoriesButton);
  
    categories.forEach(category => {
      const categoryButton = document.createElement('button');
      categoryButton.textContent = category.name;
      categoryButton.classList.add('filter-button');
      categoryButton.addEventListener('click', () => {
        filterWorksByCategory(category.id);
        removeActivatedClass();
        categoryButton.classList.add('activated-button');
      });
      categoryMenu.appendChild(categoryButton);
    });
  
    const filterContainer = document.getElementById('filter-container');
    filterContainer.appendChild(categoryMenu);
  }
  
  // Filtrage des travaux par catégorie
  function filterWorksByCategory(categoryId) {
    const filteredWorks = works.filter(work => work.categoryId === categoryId);
    displayWorks(filteredWorks);
  }
  
  // Fonction d'initialisation
  function init() {
    fetchWorks()
      .then(fetchedWorks => {
        works = fetchedWorks;
        displayWorks(works);
        return fetchCategories();
      })
      .then(fetchedCategories => {
        categories = fetchedCategories;
        generateCategoryMenu(categories);
      })
      .catch(error => console.error(error));
  }
  
  // Appel de la fonction d'initialisation lors du chargement de la page
  document.addEventListener('DOMContentLoaded', init);