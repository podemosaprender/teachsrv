# teachsrv

A server + very lightweight editor to teach using humble devices as terminals, without internet connectivity, etc.

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
