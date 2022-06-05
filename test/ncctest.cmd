    @echo off
    for /f "tokens=2 delims==" %%i in (..\gggmonitored\.secret) do set INPUT_TOKEN=%%i
    set INPUT_ACTION=push
    set INPUT_ACTION=push
    set INPUT_COMMENT-ID=1146650184
    set INPUT_REPOSITORY-DIR=../gggmonitored
    set INPUT_PULL-REQUEST-NUMBER=1
    set INPUT_CONFIG=../ggguser/config/gggmonitored.json
    set INPUT_REPO-OWNER=webstech
    set INPUT_REPO-BASEOWNER=webstech
    set INPUT_REPO-NAME=gggmonitored

    set GITGITGADGET_PUBLISHREMOTE=../gggmonitored
    set GITGITGADGET_SMTPUSER=test
    set GITGITGADGET_SMTPHOST=test
    set GITGITGADGET_SMTPPASS=test
    set GITGITGADGET_SMTPOPTS=

    ncc run ./dist/index.js
