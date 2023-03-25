$(document).on('ready', ()=>{
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    $('#LoginForm').on('submit',function(e) {
        e.preventDefault()
        $.post('/api/account/login/', {username: e.target.username.value, password: e.target.password.value, csrfmiddlewaretoken:csrftoken,}, 
            (data)=>{
                document.cookie = `userToken=${data['token']}; domain=${window.location.host};path=/;`
                document.getElementById('LoginForm').submit()
            }
            )
    })
})