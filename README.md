# Docker image of Protractor with headless Chrome

## Run locally

This will run protractor against Chrome allowing you to see the tests:

```bash
cd test
yarn install
$(yarn bin)/webdriver-manager update
CONSOLE_URL=https://<machine-ip>:8443 $(yarn bin)/protractor protractor.conf.js
# additionally, you can use the following environment variables
CONSOLE_URL=https://<machine-ip>:8443 \
  # If you are not running in a container within Openshift/Kubernetes,
  # you will need to provide a token or run the oauth flow as the
  # service account token will not exist.  The service account token
  # is read from disk in these environments.
  TOKEN=<some-token> \
  # don't use TOKEN + CONSOLE_USER CONSOLE_PASSWORD
  CONSOLE_USER=<some-username-for-oauth> \
  CONSOLE_PASSWORD=<some-password-for-oauth> \
  $(yarn bin)/protractor protractor.conf.js
```

## Build the container

```bash
$ ./docker_build.sh
# or
$ docker build -t openshift-web-console-smoke-test .
```

# Run the tests in a container

```bash
$ CONSOLE_URL=https://<machine-ip>:8443 ./docker_run.sh
# or
$ docker run -it --rm -e CONSOLE_URL=https://<machine-ip>:8443 openshift-web-console-smoke-test
```

# Debug from within the container

```bash
$ ./docker_debug.sh
# then, in the container:
# $ CONSOLE_URL=https://<machine-ip>:8443 protractor protractor.conf.js
# or
$ docker run -it --rm -e CONSOLE_URL=https://<machine-ip>:8443 --entrypoint /bin/bash openshift-web-console-smoke-test
$ protractor protractor.conf.js
```

Based on [Docker Protractor Headless](https://github.com/jciolek/docker-protractor-headless)

## Deploying on openshift

Create an `openshift-*` namespace for the container to run in. You will need to do this as cluster admin as
`openshift-*` is reserved:

```bash
oc create namespace openshift-console-smoke-test
```

Next, use `/kube/pods/smoke-test.yaml` to deploy the image within this namespace.  Be sure to update the
`CONSOLE_URL` environment variable to point to the correct IP address:

```yaml
containers:
- name: openshift-web-console-smoke-test
  image: benjaminapetersen/openshift-web-console-smoke-test:latest
  imagePullPolicy: Always
  env:
  # update the IP to <machine-ip>, wherever the console is running
  - name: CONSOLE_URL
    value: https://<machine-ip>:8443
```

## Running tests

The origin smoke tests are running periodically, every 5 minutes. To override the interval length set `TEST_INTERVAL_MINUTES` environment variable to desired number of minutes.

## Collecting metrics

[Prom Client](https://github.com/siimon/prom-client) for Node.js is used to collect metrics.

There is a server.js file in this repository, it can be run with:

```bash
node server.js
```

This will start a server listening at `http://localhost:3000/metrics`.  When this endpoint
is hit, via a browser or otherwise, a txt file like the following will be returned:

```
# lots of default metrics...
# followed by:
#
# HELP origin_web_console_smoke_test The number of times the web console smoke tests pass (should be 1)
# TYPE origin_web_console_smoke_test counter
origin_web_console_smoke_test 2
```

The `kube/pods/smoke-test.yaml` file has the appropriate annotations for prometheus to
collect metrics:


```yaml
annotations:
  prometheus.io/scrape: "true"
  # todo: enable HTTPS
  prometheus.io/scheme: http
```

However, this is still not automatic.

TODO: figure out what else is needed to get prometheus to hit this endpoint.


### TODO for metrics:

This is implemented as a prometheus Counter.  It is a proof of concept only. Some things we need
to decide:

- how often should these smoke tests run? only on upgrades?  constantly?
- what is the most meaningful metric to gather?

In addition, there is probably a better way to stitch together `protractor` to the `/metrics`
endpoint.  Currently this just reads the JUNIT `xml` file & looks for `failures: 0` on
each of the `testsuite` entries.  We could write a custom reporter to simplify this &
eliminate the need to read the XML file.
