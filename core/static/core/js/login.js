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
    function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        const hostname = window.location.hostname

        document.cookie = cName + "=" + cValue + "; " + expires + `; domain=${hostname.split('.')[1]}.${hostname.split('.')[2]}; path=/;`;
    }

    $('#LoginForm').on('submit',function(e) {
        e.preventDefault()
        $.post('/api/account/login/', {username: e.target.username.value, password: e.target.password.value, csrfmiddlewaretoken:csrftoken,}, 
            (data)=>{
                setCookie('userToken', data['token'], 30)
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
