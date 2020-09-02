let formState = {},
      form = document.getElementById('form'),
      inputs = document.querySelectorAll('.form__item input'),
      modal = document.querySelector('.modal');

inputs.forEach(input => {
    input.addEventListener('change', () => {
        formState[input.id] = input.value;
        console.log(formState)
        
    })
})

form.addEventListener('submit', e => {
    e.preventDefault();

    formState['i'] = '';
    formState['wo'] = '';
    formState['a'] = '';
    formState['comment'] = '';

    addToLocalStorage(formState)
    renderItem(formState);
    
})

function addToLocalStorage(item){
    const all = getItemsFromLocalStorage();
    all.push(item);
    localStorage.setItem('items',JSON.stringify(all))
}

function getItemsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('items') || '[]')
}


function renderItem(state){
    const listItem = document.createElement('li');
    const parentBlock = document.querySelector('.main__list');

    listItem.classList.add('list__item');

    for(let key in state){
        let listItemBlock = document.createElement('div');
        listItemBlock.classList.add(`list__block`);
        if(key == 'i' || key == 'wo' || key == 'a'){
            listItemBlock.innerHTML = `
                <div class = 'list__block_choose'>
                    <img src ='./assets/img/ok.svg'>
                </div>
           `;
           listItemBlock.classList.add(`${key}`);
           listItemBlock.addEventListener('click', () => {
               listItemBlock.classList.toggle('active');
           });

        }else if(key == 'comment'){
            listItemBlock.classList.add('list__comment');
            listItemBlock.innerHTML = `
                <form class = 'comment__input'>
                    <div>
                        <p class = 'input__text'>Введите ваш комментарий</p>
                        <input type = 'submit' value = ''>
                    </div>
                    <textarea id ='commment-text'></textarea>
                    
                </form>
            `
            const commentForms = document.querySelectorAll('.comment__input');

            commentForms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();

                    let textField = form.querySelector('textarea');
                    let commentBlock = document.querySelector('.list__comment')

                    commentBlock.textContent = textField.value;

                })
            })

            listItemBlock.addEventListener('click', e => {
                e.target.classList.toggle('active')
            })
        }else{
            listItemBlock.textContent = state[key];
            listItemBlock.classList.add('list__search');
        }
        listItem.append(listItemBlock); 
    }
    parentBlock.append(listItem);
    state = {};
    form.reset();
    modal.classList.remove('active');
}

window.addEventListener('load', () => {
    const items = getItemsFromLocalStorage();
    items.forEach(item => {
        renderItem(item)
    })
})