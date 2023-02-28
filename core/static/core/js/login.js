$(document).ready(()=>{
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    $('#LoginForm').submit(function(e) {
        e.preventDefault()
        $.post('/api/account/login/', {username: e.target.username.value, password: e.target.password.value, csrfmiddlewaretoken:csrftoken,}, 
            (data)=>{
                document.cookie = `userToken=${data['token']}; domain=trevor.leal.me;path=/;`
                document.getElementById('LoginForm').submit()
            }
            )
    })
})