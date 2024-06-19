function openModal(){
    const buttonOpen = document.getElementById('open-modal');
    const buttonClose = document.getElementById('close-modal');
    const modal = document.getElementById('modal');

    buttonOpen.addEventListener('click', () => {
        modal.classList.add('open-modal');
    });

    buttonClose.addEventListener('click', () => {
        modal.classList.remove('open-modal');
    });
}

openModal();