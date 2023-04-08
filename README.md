# Jelly
Jelly brings to life the idea we all thought of: A chat app, with no data collection. No third party cookies, no spying on user's messages, no worries about your privacy. It's even software free!

Unlike other fish in the sea...

![Jelly's chat screenshot example](/core/static/core/images/JellyScreenshotChat.png)

## Instalation
### 1. Requirements:

  Install the following python packages:
  - [Django 4.1.1 or grater](https://www.djangoproject.com/download/)
  - [Django rest framework](https://www.django-rest-framework.org/)
  - [Channels / Channels-redis](https://channels.readthedocs.io/en/stable/installation.html)
  - [Pillow](https://pypi.org/project/Pillow/)
  - [Daphne (optional)](https://pypi.org/project/daphne/)
  
  You should also have `node.js` installed as it is important for compiling React files and these libraries:
  - [React](https://react.dev/)
  - JQuery for React
  - js-cookie for React
  
  (Some of these libraries might not be necessary in the future)
  
  If needed, install redis-server on your server
  
  
### 2. Project cloning:

  Run this command on your command prompt:
  ```
    git clone https://github.com/MrGooseCoding/Jelly.git
  ```


### 3. Setup:

  Run Django's collectstatic command on your main app directory:
  ```
    python3 manage.py collectstatic
  ```
  
  Then open the `jelly-react` folder and execute the following command:
  ```
    npm run build
  ```
  
