$(document).ready(function() {
    console.log($('#wrapper').height())
    let options = {
        root: null,
        rootMargin: `${$('#wrapper').height()}px 0px 0px 0px`,
        threshold: 1.0,
    }
    console.log(options)

    let i = 0
    function callback (entries, observer) {
        $(`#info1, #info2, #info3`).removeClass('active')

        entries.forEach(entry => {
            console.log('Visible!' , entry.target.id)
            $(`#${entry.target.id}`).addClass('active')
        })

        if (i === 0) {
            $(`#info1, #info2, #info3`).removeClass('active')
            i += 1

        }
        
    }

    let observer = new IntersectionObserver(callback, options)
    observer.observe(document.querySelector('#info1'))
    observer.observe(document.querySelector('#info2'))
    observer.observe(document.querySelector('#info3'))

})