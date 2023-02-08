const toggleButtons = document.querySelectorAll('[data-toggle]')
toggleButtons.forEach(toggleButton => {
    toggleButton.addEventListener('click', function(){
        const id = toggleButton.dataset.toggle
        const element = document.querySelector(id)
        if(element.style.display === 'none'){
            element.style.display = 'block'
        }else{
            element.style.display = 'none'
        }
    })
})