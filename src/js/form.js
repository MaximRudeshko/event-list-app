let formState = {},
      form = document.getElementById('form'),
      inputs = document.querySelectorAll('.form__item input'),
      infopackInputs = document.querySelectorAll('.i-form__item input'),
      infopackForm = document.querySelector('.i-form'),
      modal = document.querySelector('.modal'),
      IModal = document.querySelector('.i-modal')
let itemId;



/* Отрисовка и  добавление данных в localStorage */

form.addEventListener('submit', e => {
    e.preventDefault();


    formState['dateChange'] = false;
    formState['rzn'] = false;
    formState['validContract'] = false;
    formState['invalidContract'] = false;
    formState['i'] = {
        'departureDate': null,
        'dateOfReceiving': null,
        'pages':false,
        'questionnaire': false,
        'agreement': false,
        'contactInfo': false,
        'passportInfo': false,
        'bankInfo': false,
        'personalData': false,
        'signature': false
    };
    formState['wo'] = false;
    formState['contract'] = false;
    formState['payment'] = false;
    formState['lecture'] = false;
    formState['a'] = false;    
    formState['comment'] = false;

    

    formState['id'] = itemId;

    renderItem(formState, itemId);
    addToLocalStorage(formState);
    addMaxIdToLocalStorage(itemId);
    bindComment();

    itemId++;
   
})

infopackForm.addEventListener('submit', e => {
    e.preventDefault();

    const items = getItemsFromLocalStorage();
    const index = IModal.getAttribute('data-index');

      

    for(let key in formState){
        items[index]['i'][key] = formState[key]
    } 


    console.log(items)
    localStorage.setItem('items', JSON.stringify(items))

    formState = {};

})

function addToLocalStorage(item){
    const all = getItemsFromLocalStorage();
    all.push(item);
    localStorage.setItem('items',JSON.stringify(all)); 
}

function addMaxIdToLocalStorage(id){
    localStorage.setItem('maxId', id)
}

function getItemsFromLocalStorage(){
    return JSON.parse(localStorage.getItem('items') || '[]')
}
function getMaxIdFromLocalStorage(){
    return JSON.parse(localStorage.getItem('maxId') || '0');
}

function renderItem(state, id){

    const listItem = document.createElement('li');
    const parentBlock = document.querySelector('.main__list');

    listItem.classList.add('list__item');
    listItem.setAttribute('data-id', id)

    for(let key in state){
        let listItemBlock = document.createElement('div');
        listItemBlock.classList.add(`list__block`);
        if( key == 'wo' || key == 'a' || key == 'dateChange' || key == 'rzn' || key == 'validContract' || key == 'invalidContract' || key == 'contract' || key == 'payment' || key == 'lecture'){
            listItemBlock.innerHTML = `
                <div class = 'list__block_choose'>
                    <img src ='./assets/img/ok.svg'>
                </div>
           `;
           listItemBlock.classList.add(`${key}`);
           
           state[key] ? listItemBlock.classList.add('active') : listItemBlock.classList.remove('active')
           listItemBlock.addEventListener('click', (e) => {
               
            const arrOfItems = getItemsFromLocalStorage();
               const index = arrOfItems.findIndex(item => item['id'] == e.target.closest('.list__item').getAttribute('data-id'));

               arrOfItems[index][key] = !arrOfItems[index][key];

               listItemBlock.classList.toggle('active')

               localStorage.setItem('items', JSON.stringify(arrOfItems))
               
           });
        }else if(key == 'i'){
            listItemBlock.innerHTML = `
            <div class = 'list__block_choose'>
                <img src ='./assets/img/ok.svg'>
            </div>
            `;
            listItemBlock.classList.add(`${key}`);
            listItemBlock.addEventListener('click', e => {
                IModal.classList.add('active');
                IModal.setAttribute('data-index', e.target.closest('.list__item').getAttribute('data-id'))
                infopackFormSubmit(e.target.closest('.list__item'));
    
            })
        }
        else if(key == 'comment'){
            listItemBlock.classList.add('list__comment');
            listItemBlock.innerHTML = `
                <div class = 'comment__text'>${state[key] ? state[key] : ''}</div>
                <form class = 'comment__form'>
                    <div>
                        <p class = 'input__text'>Введите ваш комментарий</p>
                        <input type = 'submit' value = ''>
                    </div>
                    <textarea id ='commment-text'></textarea>
                </form>
            `

            listItemBlock.addEventListener('click', e => {
                e.target.classList.toggle('active')
            })

        }else if(key == 'id'){
            continue;
        }else{
            listItemBlock.textContent = state[key];
            listItemBlock.classList.add('list__search');
        }

        listItem.append(listItemBlock); 
    }

    const close = document.createElement('div');
    close.innerHTML = `<span></span><span></span>`
    close.classList.add('list__block');
    close.classList.add('list__close');
    close.addEventListener('click', (e) => {
        const arrOfItems = getItemsFromLocalStorage();
        const index = arrOfItems.findIndex(item => item['id'] == e.target.closest('.list__item').getAttribute('data-id'))

        const newArr = [...arrOfItems.slice(0, index), ...arrOfItems.slice(index + 1)];

        localStorage.setItem('items', JSON.stringify(newArr));

        e.target.closest('.list__item').style.display = 'none'
    })
    listItem.append(close);

    parentBlock.append(listItem);
    state = {};
    console.log(state)
    form.reset();
    modal.classList.remove('active');
}

function bindComment(){

    const commentForms = document.querySelectorAll('.comment__form');

    commentForms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            const textarea = e.target.querySelector('textarea');

            e.target.previousElementSibling.textContent = textarea.value;
            e.target.closest('.list__comment').classList.remove('active');

            const arrOfItems = getItemsFromLocalStorage();

            const index = arrOfItems.findIndex(item => item['id'] == e.target.closest('.list__item').getAttribute('data-id'));

            arrOfItems[index]['comment'] = textarea.value;

            localStorage.setItem('items', JSON.stringify(arrOfItems))
        })
    })   
}

function infopackFormSubmit(idx){
    const items = getItemsFromLocalStorage();
    const index = items.findIndex(item => item.id == idx.getAttribute('data-id'))
    

}


window.addEventListener('load', () => {
    const items = getItemsFromLocalStorage();

    items.forEach(item => {
        renderItem(item, item['id'])
    })

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            formState[input.id] = input.value;
        })
    });

    infopackInputs.forEach(input => {
        input.addEventListener('input', () => {
            formState[input.id] = input.value;
            console.log(formState)
        })
    })



    itemId = getMaxIdFromLocalStorage();

    bindComment();

});
