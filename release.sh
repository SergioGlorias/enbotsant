#!/bin/bash

set -e
set -u

VERSION=$1

echo "Releasing $VERSION"

read -p "Press 'y' to continue: " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
fi

git tag -am "Release $VERSION" v$VERSION
git push origin v$VERSION

docker pull node:14
docker build -t registry.gitlab.com/sbrandwoo/enbotsant:$VERSION .
docker push registry.gitlab.com/sbrandwoo/enbotsant:$VERSION

ssh norwood << EOF
    docker pull registry.gitlab.com/sbrandwoo/enbotsant:$VERSION;
    docker stop enbotsant;
    docker rm enbotsant;
    docker run --name enbotsant --env-file enbotsant.list -v /enbotsant-data:/enbotsant/data --restart=always registry.gitlab.com/sbrandwoo/enbotsant:$VERSION && echo "Container started"
EOF