# Docker image of Protractor with headless Chrome

Build:

```
$ docker build -t protractor-smoke-test .
```

Run tests:

```
$ docker run -it --privileged --rm --shm-size 2g -v $(pwd)/test:/protractor -e CONSOLE_URL=https://<machine-ip>:8443 protractor-smoke-test
```

Debug:

```
$ docker run -it --privileged --rm --shm-size 2g -v $(pwd)/test:/protractor -e CONSOLE_URL=https://<machine-ip>:8443 --entrypoint /bin/bash protractor-smoke-test
$ protractor protractor.conf.js
```

Based on https://github.com/jciolek/docker-protractor-headless