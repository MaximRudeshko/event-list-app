const _ = require('lodash');

let formState = {},
      iFormState = {},
      itemId;
const form = document.getElementById('form'),
      inputs = document.querySelectorAll('.form__item input'),
      infopackInputs = document.querySelectorAll('.i-form__item input'),
      infopackForm = document.querySelector('.i-form'),
      modal = document.querySelector('.modal'),
      IModal = document.querySelector('.i-modal');


/* Отрисовка и  добавление данных в localStorage */

form.addEventListener('submit', e => {
    e.preventDefault();

    itemId++;
    formState['dateChange'] = false;
    formState['rzn'] = false;
    formState['validContract'] = false;
    formState['invalidContract'] = false;
    formState['i'] = {
        'active': false,
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
    formState['comment'] = '';
    formState['timeLeft'] = null
    
    formState['id'] = itemId;

    renderItem(formState, itemId);
    addToLocalStorage(formState);
    addMaxIdToLocalStorage(itemId);
    bindComment();

    formState = {}
     
})

infopackForm.addEventListener('submit', e => {
    e.preventDefault();

    const items = getItemsFromLocalStorage();
    const index = items.findIndex(item => item['id'] == IModal.getAttribute('data-index'))
    const iBlocks = document.querySelectorAll('.i');


    console.log(index)
    console.log(IModal)
    console.log(items[index])

      

    for(let key in iFormState){
        items[index]['i'][key] = iFormState[key]
    } 

    

    if(items[index]['i']['departureDate'] != null 
        && items[index]['i']['dateOfReceiving'] != null
        && items[index]['i']['pages'] != false
        && items[index]['i']['questionnaire'] != false
        && items[index]['i']['agreement'] != false
        && items[index]['i']['contactInfo'] != false
        && items[index]['i']['passportInfo'] != false
        && items[index]['i']['bankInfo'] != false
        && items[index]['i']['personalData'] != false
        && items[index]['i']['signature'] != false
    ){
        items[index]['i']['active'] = true;
        
        iBlocks.forEach(block => {
            if(block.closest('.list__item').getAttribute('data-id') == items[index]['id']){
                block.classList.add('active')
            }
        })
    }else{
        
    }

    localStorage.setItem('items', JSON.stringify(items))

    iFormState = {};
    infopackForm.reset();
    IModal.classList.remove('active')

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
            if(state['i']['active']){
                listItemBlock.classList.add('active')
            }
            listItemBlock.addEventListener('click', e => {
                const items = getItemsFromLocalStorage();
                const index = items.findIndex(item => item.id == e.target.closest('.list__item').getAttribute('data-id'))

                infopackInputs.forEach(input => {
                    input.checked = false
                })
                
                
                infopackInputs.forEach(input => {
                    console.log(items[index]['i'][input.id])
                        
                        console.log(index)
                    if(items[index]['i'][input.id]){
                        input.checked = true
                    } 
                    
                })
                IModal.classList.add('active');
                IModal.setAttribute('data-index', e.target.closest('.list__item').getAttribute('data-id'))
            })

        }
        else if(key == 'comment'){
            listItemBlock.classList.add('list__comment');
            listItemBlock.innerHTML = `
                <div class = 'comment__text'>${state[key] ? state[key] : ''}</div>
                <div class = 'comment__form'>
                    <form >
                        <div class = 'comment__form-inner'>
                            <p class = 'input__text'>Введите ваш комментарий</p>
                            <input type = 'submit' value = ''>
                        </div>
                        <textarea id ='commment-text'>${state[key]}</textarea>
                    </form>
                </div>
            `

            listItemBlock.addEventListener('click', e => {
                console.log(e.target == listItemBlock)
                if(e.target == listItemBlock || e.target == listItemBlock.querySelector('.comment__text')){
                    listItemBlock.querySelector('.comment__form').classList.toggle('active')
                }
            })

        }else if(key == 'id'){
            continue;
        }else if(key == 'timeLeft'){
            continue
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
    form.reset();
    modal.classList.remove('active');
}

function bindComment(){

    const commentForms = document.querySelectorAll('.comment__form');

    commentForms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();
            const textarea = e.target.querySelector('textarea');

            const commentBlock = e.target.closest('.comment__form')

            commentBlock.previousElementSibling.textContent = textarea.value;

            commentBlock.classList.remove('active');

            const arrOfItems = getItemsFromLocalStorage();

            const index = arrOfItems.findIndex(item => item['id'] == e.target.closest('.list__item').getAttribute('data-id'));

            arrOfItems[index]['comment'] = textarea.value;

            localStorage.setItem('items', JSON.stringify(arrOfItems))
        })
    })   
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
            iFormState[input.id] = input.checked;
            console.log(iFormState)
        })
    })

    itemId = getMaxIdFromLocalStorage() || 0;

    bindComment();
});



