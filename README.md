# Web console smoke test container

This container image uses `protractor` to run smoke tests against the web console
at a default or specified `interval`, exposing the results via `/metrics` with the
assumption that this data will be scraped and used by `prometheus`.

## Running on a production cluster

Create an `openshift-*` namespace for the container to run in. You will need to do this as cluster admin as
`openshift-*` is reserved:

```bash
oc create namespace openshift-console-smoke-test
```

next, use the `/openshift/smoke-test.yaml` template to deploy the smoke tests:

```bash
oc process \
  -f openshift/smoke-test.yaml \
  NAMESPACE=<a-valid-namespace> \
  IMAGE=<image> \
  CONSOLE_URL=<url-or-ip-for-console> | oc create -f -
```

## Running tests

The origin smoke tests are running periodically, every 5 minutes. To override the interval length set `TEST_INTERVAL_MINUTES` environment variable to desired number of minutes.

## Collecting metrics

[Prom Client](https://github.com/siimon/prom-client) for Node.js is used to collect metrics.

The file `/test/server.js` is responsible for creating the `/metrics` endpoint.  To
run it locally to review the output do the following:

```bash
cd test
yarn install
# note: the endpoint uses https and expects certificate files.
# you can generate some via the make_dev_crt.sh file
KEY_PATH=/path/to/key.pem \
 CRT_PATH=/path/to/crt.pem \
 node server.js
```

This will start a server listening at `http://localhost:3000/metrics`.  When this endpoint
is hit, via a browser or otherwise, a txt file like the following will be returned:

```bash
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

## Local Environment

You will need to test against a running cluster. Minishift is a simple way to do this
locally.  Follow the [installation instructions](https://github.com/minishift/minishift) for
minishift for your OS, then do the following:

```bash
minishift start
# take note of the console url when opened,
# you will need to use it as an environment variable below
minishift console
```

## Running locally with the Openshift Template

This is the recommended way to run the smoke test image built from this repository.

```bash
# oc process looks something like this:
oc process \
  -f openshift/smoke-test.yaml \
  NAMESPACE=<a-valid-namespace> \
  IMAGE=<image> \
  CONSOLE_URL=<url-or-ip-for-console> | oc create -f -

# full example:
oc process \
  -f openshift/smoke-test.yaml \
  NAMESPACE=test-namespace-1 \
  IMAGE=web-console-smoke-test:latest \
  CONSOLE_URL=https://192.168.64.3:8443 | oc create -f -
```


## Running with the YAML files

Alternatively, you can manually setup the smoke tests with the yaml files in the `/kube`
directory of this repository.  You will have to make a copy and tweak some of the
environment variables to fit your needs.

```bash
# first you will need a new namespace:
oc new-project <project-name>
# create certificates for the /metrics endpoint
#./make_dev_crt.sh
# store the certs in a secret
# oc create secret tls --cert ./tls/cert.pem --key ./tls/key.pem -o yaml
#

# create the service first, this contains an annotation to generate a
# certificate that will also be used by the deployment
oc create -f kube/service/smoke-test.yaml
# create the deployment
# be sure to check the env vars in the yaml file
# CONSOLE_URL will almost certainly need to be updated
oc create -f kube/deployments/smoke-test.yaml
# alternatively you could just create the pod
oc create -f kube/pods/smoke-test.yaml
```

If you need to manually provide a secret, you can do something like:

```bash
./make_dev_crt.sh
oc create secret tls --cert ./tls/cert.pem --key ./tls/key.pem -o yaml
# edit the deployment/smoke-test.yaml to reference the created
# secret rather than use the one that would be provided by the
# service annotation
oc create -f kube/deployments/smoke-test.yaml

```



## Running locally with Docker

For a fast development workflow while still working with the container, you can
use Docker:

- building
  - `./docker_build.sh` is easiest
    - to build with a specific tag (default `latest`) or specify container name:
      - `TAG=v0.0.1 ./docker_build.sh`
      - `CONTAINER_NAME=new-name ./docker_build.sh`

- pushing
  - `./docker_push.sh` is provided, but you must provide a username for the repository:
    - `USERNAME=openshift ./docker_push.sh`
    - results in:
    - `docker push openshift/web-console-smoke-test:latest`

- running
  - this is probably the fastest way to test locally
  - you will need to provide certificates for https for the metrics endpoint
    - `./make_dev_certs.sh` will generate certs at `./tls/`
  - you will also need to provide a token (such as an OAuth token) for the
    tests to login to the web console.
    - the simplest way to do this is to manually login to your dev cluster
      via the web console, then do one of the following:
      - Click your username in the top right corner and then select "Copy Login Command".
        Use this token from your clipboard
      - Alternatively, you can open the developer console in your browser after
        login and copy `LocalStorageUserStore.token` from LocalStorage.
  - then run `./docker_run.sh` like this:
    `CONSOLE_URL=<console-url> TOKEN=<token-string> ./docker_run.sh`
  - a full example:
    `CONSOLE_URL=https://192.168.64.3:8443 TOKEN=UC2YKiub0Wf8lrgitp1kCNi_sTk3lt-YGB83T5Vzs0s ./docker_run.sh`


## Running locally

Finally, the tests can be run locally without using a container by doing the following:

```bash
cd /test
# the last "scripts" block of the package.json file contains some useful scripts
tail -n 15
# you can use "yarn" to run any of these scripts
CONSOLE_URL=<console-url> TOKEN=<token> yarn test:run_once
# a full example:
CONSOLE_URL=https://192.168.64.3:8443 \
  TOKEN=UC2YKiub0Wf8lrgitp1kCNi_sTk3lt-YGB83T5Vzs0s \
  yarn test:run_once
```

You can optionally provide a `CONSOLE_USER` and `CONSOLE_PASSWORD` if
you want to run the tests with an OAuth flow.  It is recommended you
are familiar with `protractor` and can read the `/test/protractor.conf.js`
file and understand test files / suites to do this.

An example may look like:


```bash
cd /test
CONSOLE_URL=https://<machine-ip>:8443 \
  TOKEN=<some-token> \
  CONSOLE_USER=<some-username-for-oauth> \
  CONSOLE_PASSWORD=<some-password-for-oauth> \
  $(yarn bin)/protractor protractor.conf.js
```

## Check the /metrics endpoint

If you need to verify that the metrics endpoint is working properly, you can do something like:

```bash
# assuming you are using minishift to start a local cluster
minishift start
minishift ssh
# find the <container-id> of your running smoke tests
docker ps                            
docker exec -it <container-id> /bin/bash
# should return metrics information
curl --insecure https://localhost:3000/metrics
```





  
