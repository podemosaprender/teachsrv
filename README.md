# teachsrv

A server + very lightweight editor to teach using humble devices as terminals, without internet connectivity, etc.

Get a glimpse at http://viejo.podemosaprender.org/teachsrv/

The code on this repo provides:
* CodeEditingServer: 
   * (safely) editing (specific) files in the local filesystem
   * proxy to EditedApp result url (e.g. when you run `npm run dev` in a React app)
   * static serving the CodeEditingWebUI
* CodeEditingWebUI, a react app connecting to the CodeEditingServer api with
   * a convenient editor (thanks CodeMirror!)
   * a file list

This allows you, TheAdministrator, to run the EditedApp wherever you want, e.g. your own computer, a VirtualBox for safety, etc. while TheEditor can just see and edit the few files they need, just using a browser even in a phone or tablet BUT see the results of running the full EditedApp.

## Two motivating examples

* Help with complex app: Alice needs Bob's help her choose colors for a complex application. Bob would only need to read and change some .css files. THE PROBLEM is Bob needs to see the results of each small edition and unning the complex application in his computer is probably impossible. There may also be restrictions regarding data privacy, Alice NDAs, etc.

* Teaching: Clarice wants to teach the basics of programming to Daniel. THE PROBLEM is Daniel may have just a phone or a tablet. Even with a computer it'd be frustrating to waste the first hours of a course fighting installation issues, arcane Window$ settings, etc. Clarice wants a simple web editor focused on the concepts and examples that will help Daniel the most, everything else she can run on her computer, even editing or fixing things on the flight, BUT Daniel needs to see the final results.

## Configuration

**BE CAREFUL WITH SECURITY**: the CodeEditingServer can let hostile actors **read or write** dangerous files or **access services** on the computer it's running on or others on the same net if misconfigured! Reading the source code to understand what you are doing is strongly recommended. Running the CodeEditingServer and the EditedApp inside a VirtualBox may mitigate some risks compared to running it unrestrained in your host operating system.

You can pass an ENV environment variable with the path to a config file to the CodeEditingServer. For example:

~~~
ENV=config_example_single_app.json node index.js
~~~

## Run widh sdt_env_dev

~~~
(cd ui; docker_node "npm i ; npm run build")
rm -Rf server/src/static_ui_generated ; cp -r ui/dist server/src/static_ui_generated 
(cd server; PORT=3000 docker_node "npm i; node src/index.js")
~~~

~~~
/* U: para que estudiantes accedan via pepe.test1.podemosaprender.org
 * abro tunel con # ssh -i *YOUR_KEY* -R 13215:localhost:3000 -o ServerAliveInterval=3 *YOUR_USER*@podemosaprender.org
 * 13215 es el puerto de mi app "nginx only port" en el hosting
 */
~~~

## Authentication 

~~~
CFG_TOKENS_JSON_PATH=../example-tokens.json node index.js 
~~~

https://api1.o-o.fyi/xp.cgi/docs#/default/login_for_access_token_auth_token_post

~~~
curl https://api1.o-o.fyi/token_key_public.pem -o token_key_public.pem
CFG_TOKENS_KEY_PATH=../token_key_public.pem node index.js 
~~~