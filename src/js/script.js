window.addEventListener('DOMContentLoaded', () => {

    //Открытие/закрытие модального окна

    const btn = document.getElementById('add'),
        modal = document.querySelector('.modal'),
        close = document.querySelectorAll('.close');

    btn.addEventListener('click', () => {
        modal.classList.add('active')
    })

    close.forEach(item => {
        item.addEventListener('click', e => {
            e.target.closest('.modal').classList.remove('active');
        })
    })
    
})


