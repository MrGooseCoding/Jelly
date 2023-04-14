$('document').ready(()=>{
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value

    function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        const hostname = window.location.hostname

        document.cookie = cName + "=" + cValue + "; " + expires + `; domain=${hostname.split('.')[1]}.${hostname.split('.')[2]}; path=/;`;
    }

    var User = {
        user: { 
            username: null,
            first_name: null,
            email: null,
            password1: null,
            password2: null,
        },
        image:''
    } 


    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.ProfilePicture').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    var RegisterModal = {
        currentSlide: 1,
        slides: 3,
        nextSlide: function () {
            $(`.slide.${this.currentSlide}`).addClass('left').removeClass('active');
            this.currentSlide += 1
            $(`.slide.${this.currentSlide}`).addClass('active');
            $('#BackBtn').removeClass('disabled')
            if (this.currentSlide == this.slides) {
                $('#NextBtn').addClass('disabled')
            } 
        },
        lastSlide: function () {
            $(`.slide.${this.currentSlide}`).removeClass('active');
            this.currentSlide -= 1
            $(`.slide.${this.currentSlide}`).removeClass('left').addClass('active');
            $('#NextBtn').removeClass('disabled')
            if (this.currentSlide == 1) {
                $('#BackBtn').addClass('disabled')
            } 
        } 
    } 

    //function IfConditionToggler(condition, jqueryObject, htmlClass) { if (condition) jqueryObject.addClass(htmlClass);} else {jqueryObject.removeClass(htmlClass);} } 

    $(document).on('click', '#NextBtn', function(e) { 
        var validated = false;
        if (RegisterModal.currentSlide == 1) {
            var testusername = /^[0-9a-zA-Z._]+$/;
            var Username = $('#UsernameInput').val().trim();
            var First_name = $('#First_nameInput').val().trim();
            var validFirst_name = false;
            if (First_name.length == 0) {
                $('#First_nameNotValid').addClass('active');
            } else {
                $('#First_nameNotValid').removeClass('active');
                validFirst_name = true
            } 
            if (!testusername.test(Username)) {
                $('#UsernameNotValid').addClass('active');
            } else {
                $('#UsernameNotValid').removeClass('active');
                $.post('/api/account/exists/', {csrfmiddlewaretoken:csrftoken, username:Username}, function (data) {
                    if (data['data']) {
                        $('#UsernameAlreadyExists').addClass('active');
                    } else {
                        $('#UsernameAlreadyExists').removeClass('active');
                        if (validFirst_name) {
                            RegisterModal.nextSlide();
                            User.user.username = Username;
                            User.user.first_name = First_name;
                        } 
                    } 
                })
            }
        }

        if (RegisterModal.currentSlide == 2) {
            var password1 = $('#password1').val().trim()
            var password2 = $('#password2').val().trim()
            if (password1.length < 8) {
                $('#Password1NotValid').addClass('active')
            } else {
                $('#Password1NotValid').removeClass('active')
                
                if (password2 !== password1) {
                    $('#Password2NotValid').addClass('active')
                } else {
                    $('#Password2NotValid').removeClass('active')
                    validated=true
                    User.user.password1=password1
                    User.user.password2=password1
                }
            } 
        } 

        if (validated) {
            RegisterModal.nextSlide();
        }
    });

    $(document).on('click', '#BackBtn', function(e) { 
        RegisterModal.lastSlide()
    });

    $(document).on('click', '.ProfilePicture', function (e) {
        $('.ProfilePictureInput').click();
    });

    $('.ProfilePictureInput').change(function (e) {
        readURL(this);
    })

    $('#RegisterForm').submit(function (e) {
        e.preventDefault();
        var account = $.extend(true, {}, User);
        account.image = ''
        var imageInput = document.getElementsByClassName('ProfilePictureInput')[0]
        User.image = imageInput.files[0]
        formdata = new FormData()
        formdata.append('image', User.image)
        formdata.append('csrfmiddlewaretoken', csrftoken)
        console.log(csrftoken)
        console.log(account) 
        var queryString = window.location.search
        var params = new URLSearchParams(queryString)

        if (params.has('joinUser')) {
            document.forms[0].joinUser.value = params.get('joinUser')
        }           
        $.ajax({
            type:"POST",
            url:'/api/account/create/', 
            data:JSON.stringify({account:account}),
            headers:{
                'X-CSRFToken':csrftoken
            },
            contentType: "application/json; charset=utf-8;",
            success:function(data) { 
                console.log(data['token'])
                setCookie('userToken', data['token'], 30)

                if (User.image != undefined) {
                    $.ajax({
                        url: '/api/account/update_image/',
                        type:'POST',
                        headers: {Authorization: `Token ${data['token']}`},
                        data: formdata,
                        contentType: false, 
                        processData: false,
                        xhr: function() {
                                var xhr = new window.XMLHttpRequest();
                                //Upload progress
                                xhr.upload.addEventListener("progress", function(evt){
                                if (evt.lengthComputable) {
                                    var percentComplete = evt.loaded / evt.total;
                                    $('#uploadBar').width(`${percentComplete*100}%`)
                                    console.log(percentComplete);
                                }
                                }, false);
                                return xhr;
                            },
                        success: function(data) {
                            } 
                    }).done(()=>{
                        document.getElementById('RegisterForm').submit()

                    })
                } else {
                    document.getElementById('RegisterForm').submit()

                }
            },
        })
    })
});
