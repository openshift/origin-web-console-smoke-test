# Smoke Tests

## protractor w/o selenium

No selenium! yay!

```bash
yarn install
yarn run webdriver:update
# testing locally
yarn run test
# testing in a docker container or in CI
yarn run test:run_once
```

## Running OpenShift & Prometheus locally

You will need openshift running via `cluster up` and then prometheus.  Do the following:

```bash
# cluster up with the public IP of your machine:
# there are numerous ways to find this.
# on MacOS, the simpest is:
#  - open system prefs, networking, wi-fi, and look at the "status" are for IP address.
# there are also cli commands for lookup
oc cluster up --version=latest --service-catalog --public-hostname=<your-machine-ip>
oc cluster up --version=latest --service-catalog --public-hostname=192.168.1.69

```

Then, once you are running, you will need to give the `cluster-admin` role to
a user for the `kube-system` namespace in order to deploy prometheus:

```bash
oc adm policy add-cluster-role-to-user cluster-admin developer -n kube-system
```

The prometheus template lives in `kube-system`. Feel free to deploy via the CLI or
load the web console `https://<your-machine-ip>/console`, naviate to the in-project
catalog, and deploy.

Prometheus will deploy a `stateful-set`.  The `prometheus` service will have a
public route you can click, then login with your OpenShift user.

## Running the smoke tests locally (non docker container)

You should be able to run the code locally like this:

```bash
# set the env vars, unless the default https://127.0.0.1:8443 is sufficient
CONSOLE_URL="https://192.168.1.69:8443" \
  CONSOLE_USER=bob \
  CONSOLE_PASSWORD=bob \
  yarn run test
```

## Deploying the smoke test container

There is a pod and a deployment yaml file:

```bash
# WIP:
# currently these reference the container image on dockerhub at:
# image: benjaminapetersen/origin-web-console-smoke-test
oc create -f smoke-test-dir/kube/pods/smoke-test.yaml
oc create -f smoke-test-dir/kube/deployments/smoke-test.yaml
```

## Docker container communication

You can build the container locally, but running it vanilla docker wont work.
You'll have to continue down to the kubernetes/openshift part to get a deployment
and all the exciting config.

### Building the container

```bash
# in the root of the project
docker build -t origin-web-console-smoke-test .
```

Running the container locally via docker (tests will fail!)

```bash
# if you are using `oc cluster up`:
oc cluster up --version=latest --service-catalog \
  --public-hostname=$(dig +short myip.opendns.com @resolver1.opendns.com)
# docker ps
# find the origin-web-console container ID
# docker inspect <console-id>

docker run -it --rm \
  --name origin-web-console-smoke-test origin-web-console-smoke-test \
  # you will need the IP address of the console for this.
  # if its local, an IP for your machine
  # if its remote, the IP or domain of the console for the cluster
  # use a command like:
  #   dig +short myip.opendns.com @resolver1.opendns.com
  # to get your machine
  -e CONSOLE_URL=https://foo.bar.baz
```
