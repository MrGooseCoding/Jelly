$(function () {
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
                var hostname = window.location.hostname
                document.cookie = `userToken=${data['token']}; domain=${hostname.split('.')[1]}.${hostname.split('.')[2]}; path=/;`
                
                if (data['token']) {
                    var queryString = window.location.search
                    var params = new URLSearchParams(queryString)
                    if (params.has('joinUser')) {
                        document.forms[0].joinUser.value = params.get('joinUser')
                    }
                    document.getElementById('LoginForm').submit()
                }
                document.getElementById('LoginForm').reset()
            }
            )
    })
})