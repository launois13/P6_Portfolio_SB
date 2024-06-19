function openModal(){
    const buttonOpen = document.getElementById('open-modal');
    const buttonClose = document.getElementById('close-modal');
    const modal = document.getElementById('modal');

    buttonOpen.addEventListener('click', () => {
        document.body.style.overflowY = "hidden"; // retire les barres de scrolls
        modal.classList.add('open-modal');
        window.scrollTo(0, 0); //scroll en haut de la page
    });

    buttonClose.addEventListener('click', () => {
        document.body.style.overflowY = "scroll"; // remet les barres de scrolls
        modal.classList.remove('open-modal');
    });
}

openModal();