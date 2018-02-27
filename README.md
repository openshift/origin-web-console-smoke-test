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
# be sure you have oc cluster-up!
# get the origin-web-console container IP
# docker ps
# find the origin-web-console container ID
# docker inspect <console-id>

docker run -it --rm \
  --name origin-web-console-smoke-test origin-web-console-smoke-test \
  # you will need the IP address of the console for this.
  # if its local, an IP for your machine
  # if its remote, the IP or domain of the console for the cluster
  -e CONSOLE_PUBLIC_URL=https://foo.bar.baz
```


# Openshift/Kubernetes deployment
