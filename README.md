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

## Running locally

```bash
# cluster up with the public IP of your machine:
oc cluster up --version=latest --service-catalog --public-hostname=<your-machine-ip>
oc cluster up --version=latest --service-catalog --public-hostname=192.168.1.69
# set the env vars, unless the default https://127.0.0.1:8443 is sufficient
CONSOLE_PUBLIC_URL="https://192.168.1.69:8443" \
  CONSOLE_USER_NAME=bob \
  CONSOLE_PASSWORD=bob \
  yarn run test
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
  -e CONSOLE_PUBLIC_URL=https://foo.bar.baz
```


# Openshift/Kubernetes deployment
