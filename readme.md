Node Dockerhub Webhook
======================
Does things when dockerhub builds your docker images.

Justification
=============
I'm a DigitalOcean droplet cheapskate, but I wanted to auto-deploy my docker images when they were built by dockerhub. This application does exactly that. And nothing else.

Usage
=====
Simply run the app with ```npm start``` or ```node server.js```

Installation
============
Configure your webhook in dockerhub. You want it to to point to ```http://<your-domain>/hub/push```. Once your docker image is built, the webhook is called, and the script specified in config/default.json is executed with the repository format.

Configuration
=============
The configuration format is very simple:
```
{
  "events": {
    "push": "./scripts/push.sh"
  }
}
```

Simply, the 'push' script is called when dockerhub has built your image. It takes one parameter, which is the repository name (i.e: ```desirableobjects/mydockerimage```).

The configuration sits in ```config/default.json```. If you specify the NODE_ENV environment variable like 'production', it will look for ```config/production.json```. If it can't find it, it will use ```config/default.json```. This is thanks to the config npm module - see its own documentation for information on inheritance and such.
