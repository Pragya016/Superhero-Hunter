const returnBtn = document.querySelector('button');
returnBtn?.addEventListener('click', () => {
    setTimeout(() => {
        window.open('../index.html', '_self');
    }, 1000)
})