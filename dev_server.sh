#!/bin/bash -e

function start_watchify {
    watchify_command="node_modules/watchify/bin/cmd.js client/js/app.js"

    $watchify_command \
        --debug \
        -o client/js/gen/bundle.js \
        -v \
        &
}

npm install

start_watchify

node_modules/supervisor/lib/cli-wrapper.js --quiet --ignore node_modules --watch server server/index.js
