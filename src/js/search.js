window.addEventListener('load', () => {
    const searchInput = document.getElementById('search-input');

    searchInput.addEventListener('input', () => {
        let val = searchInput.value.trim();

        let rows = document.querySelectorAll('.list__item');

        if (val != '') {
            rows.forEach(row => {
                let blocks = row.querySelectorAll('.list__search');
                let strings = [];
                blocks.forEach(block => {
                    strings.push(block.textContent);

                })
                let str = strings.join(',');
                if (str.search(val) != -1) {
                    row.classList.remove('hide');
                    console.log(str)
                } else {
                    row.classList.add('hide');
                }
            })
        } else {
            rows.forEach(row => {
                row.classList.remove('hide')
            })
        }
    })
})


