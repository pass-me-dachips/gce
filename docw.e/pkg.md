# GCE PACKAGES

## Special Note

this doc contains detailed guides about building your own gce package. this doc assumes you have already read the manual for the pkg command using `gce man pkg` and has understood exactly what gce packages are, thier use cases and thier importance.

## Protocol Overview

like you would see in the manual, gce packages typically does not provide a user interface for developers to interact with. they instead use a stateless protocol to communicate with each other using the following cycle:

### request cycle

- run a package using a gcce
- the gcce sends the command or instructions to the service using the service epkg
  api,
- the api reads it cache to check if the package exists, and then read the package headers if found in the cache to know exactly how to handle the request.
- break the request to a more package-like format and call the package, parsing the arguments down to it.

### response cycle

- the package sends the response back to the gce service using the /epkg/response server endpoint by making a request to the path and parsing its own data unit down to the request body just like a webhook.
- gce would read the request as the package response and perform the neccesary operations.

## Building A Package

This section contains the actual step by step guide on building a gce package. below is the table of content.

- the Headerfile
- package structures
- request cycle
- response cycle
- testing
- distribution
- closure

### the Headerfile

The main component/controller of every gce package is the **Headerfile.json**. the **Headerfile.json** is a gce required file which contains all neccessaary informations for building and distributing a package.
a package cannot be used in any gce service without the **Headerfile.json**.
below is a complete snippet of what the Headerfile.json **must** contain.

```json
{
  "author": "<your_name>",
  "name": "<the_package_name>",
  "version": "<the_package_version>",
  "repo": "<the_package_repo>",
  "man": "<relative_path_to_Manfile>",
  "desc": "your_package_description",
  "requirements": ["<...requirements_needed_to_run_package>"],
  "supportedPlatforms": ["<...platforms_supported>"],
  "cmd": "<start_command>",
  "cmd1": "<relative/path/to/entrypoint>",
  "args": ["<...optional_arguments"]
}
```

- the `author` field specifies the author or owner of the package.
- the `name` field specifies the name of the package.
- the `version` field specifies the version of the package.
- ther `repo` field specifies the repository of the package.
- the `man` field specifies the relative path to where the `Manfile` resides.
  a man file is a file that contains the manual of the package
  in a text based format as it is usally read by gce and outputed as plain texts to the users terminal whenever the user runs `gce pkg man <packagename>`.
  NOTE: the filename of the manual must be **Manfile** with no extension.
- ther `desc` field specifies the description of the package.
- the `requirements` field must be an array containing the requirements needed in order for the package to function. gce would not perform any action to make sure the requirements are meet, instead it logs each of the requirements to the user before intalling the package, alerting the user to make sure the requirements are met before installation.
- the `supportedPlatforms` field must be an array containing the supported platforms in other to run the application. possible values: win32, linux, android, darwin.
  gce would perform actions to make sure the platform is supported before installation.
- the `cmd` field specifies the command to run while making the request to the package.
  examples of this values can be `node` if node-based application , `python` if python-based application, and so on....
  if the package is runned as an executable binary, shell etc that does not have a start command but might require executable permissions to run (usually on posix), then the value of the cmd field must be `{BIN}`. eg:

```json
{ "cmd": "{BIN}" }
```

this allows gce to effectively set the neccessary permisions on posix,
and execute the binary.

- the `cmd1` field specifies the relative part to the entry point of the package.
  NOTE: for gce to effectively execute the package, it needs the absolute path to the entry point file and not the relative path, although the `cmd1` field needs the relative path. in other to make this work as expected prepend `{PATH}` to the path specified eg :

```json
{ "cmd1": "{PATH}./bin/app" }
```

by specifying this, gce would convert the value to the appropriate absolute path to `./bin/app` in our example or the specified path.

- the `args` field must be an array that specifies optional arguments to pass to the application.
  gce recommends this method instead of passing the arguments directly in the cmd1 field as this can alter the path formating.
  NOTE THAT THE ARGUMENTS PASSED IN THIS FIELD DIFFERS FROM THE ONES THAT WOULD BE OPTIONALY PARSED FROM THE SERVICE WHEN EXECUTING THE PACKAGE.

### package structures

after adding the **Headerfile.json** file and specifying the appropriate fields,
you can now proceed to writing the actual code of the package.
gce doest not really care how you structure and write the actual code of the package. it only cares about how your **Headerfile.json** and **Manfile** are written and stored, and how requests and responses are handled. aslong as the package runs, and the gce files are correctly placed, and the protocol correctly written, then the package is valid.

### request cycle

**before creating a package, know that gce package protocol works statelessly and an operationid is required in other to keep track of the request and response**

to effectively handle requests from gce services, you have to set your application _entry point_ to handle arguments parsed to the file during execution.
when a service make a request to a package, it calls the package file just like we would do regularly: eg `node app.js argument1 argument2`, `python app.py argument1 argument2`, `./app argument1 argument2`, `app.exe argument1 argument2` etc.
when a service calls the package, it takes the argumnts passed from a higher layer (the gcce) and convert it to a single, merging the arguments in the Headerfile.json and that specified by the user.
in a quick example, assumming the `args` field in the Headerfile.json has 3 elements in its array eg `["argA", "argB", "argC"]`,
and the gcce sent 3 other arguments down to the service when trying to call the package eg `["gcce_arg1", "-gcce_arg2", "--gcce_arg3"]`.
gce would convert these arguments to a single string seperated by whitespaces eg `<SERVICE_PORT> <OID> argA argB argC gcce_arg1 -gcce_arg2 --gcce_arg3` and this string would then be passed to the package as the arguments recieved when calling it.
in the above example you would notice two arguments at position 0 and 1 in the arguments which wasnt part of the args field in the Headerfile or the arguments passed from the gcce. these two fields are prepended by default and they contain
neccessary information about the request in which all packages need.
the `<SERVICE_PORT>` argument would be replaced with the acutal port the service is runnin on , and the `<OID>` argument would be replaced with the **operation id** which is a unique identifier created by the gcce to identify each request made to any gce api..

this gce method of using _arguments_ streamlines the package process as it would just read the arguments like it was a cli tool or somethinf.
instead of writing a tons of logics to gain arguments in other methods or get the .
below provides a simple snippet for getting the arguments parsed to the program in various languages:

```js
let request_arguments = process.argv.slice(2);
console.log(request_arguments);
// request_arguments becomes an array containg the arguments
// request_arguments[0] would always be the service port
// and request_arguments[1] would always be the operation id
// request_arguments[2] and onwards are the additional arguments passed by combining the args field in the Headerfile and the arguments passed from the gcce
```

```nim
from "std/cmdline" import commandLineParams

var request_arguments: seq[string] = commandLineParams()
for i in request_arguments :
  echo i
# request_arguments becomes an sequence containg the arguments
# request_arguments[0] would always be the service port
# and request_arguments[1] would always be the operation id
# request_arguments[2] and onwards are the additional arguments passed by combining # the args field in the Headerfile and the arguments passed from the gcce

```

these snippets are for javascript and nim language respectively, you can use similar approach for whatever language the package is built on.
after retrieving the arguments, you can start processing the request.

### response cycle

after processing the request, you migth want to give a feedback or a data back to the service which would be passed to the gcce service(higher level).
in other to do this, gce provides an endpoint that allows packages to make requests to it (similar to / webhook ) upon completetaion or failure of the request.

this endpoint is `http://localhost:<servicePort>/epkg/response`

when you make a request to the enpoint and specify your response to that request,
gce would treath the request as your package response and then send the feedback in a more suitable format to the gcce.

all requests made to this endpoint from the package must have a standard format:

```
header -
  protocol: http 1
  method: post
  content-type: application/json
  path: /epkg/response
  oid: <operation_id_gotten_from_request>

payload -
  {
    ack: <bool>
    hasData: <bool>
    message: <string>
    data: {
      type: <string>
      iframe: {
         url:  <string>,
         newTab: <bool>
      }
      isOpened: <bool>
      uitext:  {
        col: <string>,
        content: <string>
      }
    }
  }
```

the in payload,

- the `ack` field must be a boolean that indicates wether the response was acknowleged or not.
- the `hasData` field must be a boolean that specifies wether the response has data or not. if set to true, then gce reads the message field as the response if it exists or specify null for the field if it does not exists. if set to false, reads the data object as the response. and would silently drop the request.
- the `message` field is a string that specifies a feedback to be output in the gcce service as log (similar to echoing a string in the terminal), only if hasData is false.
- the `data` field is an object that specifies the actual data and how it should be represented, only if hasData is true.

#### The data field in the response payload

in the above structure, you can see that the data field contains some objects,
this child-section explains exectly what they do.

- the `type` field is a required field that specifies how of the actual response data should be represented. currently they can only be two values: _"iframe"_ or _"uitext"_
  gce would use default _"uitext"_ if the value does not match any of the above values.

- the `iframe` field should only be added if the type field is set to _"iframe"_.
  when a type is set to _"iframe"_, it means that the response migth be a webpage or a complex response type that cannot be interpreted by the gcce _"uitext"_ engine and has to be opened in an iframe or a new tab. this allows users to create wider range of packages were the response type has a very unique response or may contain additional file types such as css, js, image, json etc. usefull in packages that provides in-browser file explorer and lot more.
  the iframe field must be an object containing two fields:

  - 1: the `url` field must be a http/s url that points to a webpage/site (hosted by the package locally or on the internet.)
  - 2: the `newTab` field must be a boolean that specifies where the url should be opened in a new tab or in the same tabe (using an iframe).
    NOTE gce recommends the url should be opened in a new tab if the webpage it points to uses anything other than traditional html and css (witouth api calls and javascript).

- the `isOpened` field is a boolean that specifies wether the package created an additional process still running or not. in cases where the package made an operation that can run in the background eg a server still listenening to requests or a background task or cron job performing tasks, it is totally recommended to set the `isOpened` field to true. this way gce would keep track of the package and would be able to terminate or close the process whenever the client chooses to or when the service ends. this way the machine remains efficient and stable.
  WARNING if you set the `isOpened` field to false, gce would have no idea if the package made and additional running process. this can be **DANGEROUS** since if the service dies unexpectedly, you would have to manually kill these packages.

- the `uitext` field should only be added if the type field is set to _"uitext"_.
  when a type is set to _"uitext"_, it means the format is in a text-based format usually good for ouputing codes, etc.
  gcces would typically use divs or sections to show the contents of the uitext in the gcce.
  the uitext field must be an object containing two fields:
  1: the `col` field specifies what text color the content should be when shown on the screen, in colorname, hex, rgba format.
  2: the `content` field holds the actual text content to be shown or printed to the screen.

## testing

when adding a packge to gces registry, gce does not copy the package code to the registry but only the headerfile.
this functionality was intentionaly done so testing and managing packags are easily done.
when building packages, the best way to test them is by adding them as packages.
and then using the package from any of your installed gcces just like you would use the package after distribution, as well as catching the errors. you migth want to log the errors down during developement as gce silently drops responses if they contain errors in the payload structure, or requests if it encouneres an error starting the package.
so in general, on developement, add your package to gce's registry just like you would do for any distributed package using `gce pkg add <path_to_package>`
and after doing this, you can start testing your package on any gcce as if it was on production mode.

## distribution

unlike other package managers the gce package manager does not upload your code to any form of storage medium, instead you can only distribute the Headerfile. since the headerfile contains the git hub repository, any one can just look at the distributed header file, copy the github repo, navigate to it and download the package based on how its documeneted in the repo or manual.

when you run the appropriate command for distributing the package, gce would copy the header file and upload it to its global-registory
which is usually hosted on a server. when users browse through the packages,
they would see lists of header files, and can install any package by going to the specified repo in the file.

want to distribute a package? run `gce man pkg` to see the appropriate commands for package distribution.

## closure

by reading this doc detaildly aswell as the pkg manual `gce man pkg`, creating packages would be an easy task.
