# teachsrv
A server + very lightweight editor to teach using humble devices as terminals, without internet connectivity, etc.

## Run widh sdt_env_dev

~~~
(cd ui; docker_node "npm i ; npm run build")
rm -Rf server/src/static_ui_generated ; cp -r ui/dist server/src/static_ui_generated 
(cd server; PORT=3000 docker_node "npm i; node src/index.js")
~~~
