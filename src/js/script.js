window.addEventListener('DOMContentLoaded', () => {

    //Открытие/закрытие модального окна

    const btn = document.getElementById('add'),
        modal = document.querySelector('.modal'),
        close = document.getElementById('close');

    btn.addEventListener('click', () => {
        modal.classList.add('active')
    })

    close.addEventListener('click', () => {
        modal.classList.remove('active');
    })
    
})


