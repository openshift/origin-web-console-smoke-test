# Docker image of Protractor with headless Chrome

Build:

```bash
$ ./docker_build.sh
# or
$ docker build -t protractor-smoke-test .
```

Run tests:

```bash
$ CONSOLE_URL=https://<machine-ip>:8443 ./docker_run.sh
# or
$ docker run -it --privileged --rm --shm-size 2g -v $(pwd)/test:/protractor -e CONSOLE_URL=https://<machine-ip>:8443 protractor-smoke-test
```

Debug:

```bash
$ ./docker_debug.sh
# in the container:
$ CONSOLE_URL=https://<machine-ip>:8443 protractor protractor.conf.js
# or
$ docker run -it --privileged --rm --shm-size 2g -v $(pwd)/test:/protractor -e CONSOLE_URL=https://<machine-ip>:8443 --entrypoint /bin/bash protractor-smoke-test
$ protractor protractor.conf.js
```

Based on https://github.com/jciolek/docker-protractor-headless
