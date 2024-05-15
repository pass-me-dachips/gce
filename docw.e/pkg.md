# GCE PACKAGES

**this docs contains detailed guides about building your own gce package. this doc assumes you have already read the manual for the pkg command using `gce man pkg` and has understood exactly what gce packages are, thier use cases and thier importance.**

## Protocol Overview

like you would see in the manual, gce packages typically does not provide a user interface for developers to interact with. they instead use a protocol to communicate with each other using the following cycle:

### request cycle

- run a package using a gcce
- the gcce sends the command or instructions to the service using the service epkg
  api,
- the api reads it cache to check if the package exists, and then read the package headers if found in the cache to know exactly to handle the request.
- encapsulates the request and call the package, parsing the arguments down to it.

### response cycle

- the package sends the response to the gce using the /epkg_r service http server path by making a request to the path and parsing its own encapsulated data in the body of the request, down to the /epkg_r endpoint.

## Building A Package

This section contains the main guides and step by step information on building a gce package. below is the table of content.

- the Headerfile
- package structures
- request cycle
- response cycle
- testing
- distribution
- best practices
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
  in a text based format as it is usally read by gce and outputed as plain texts to the users terminal.
  NOTE: the filename of the manual must be **Manfile** with no extension.
- the `requirements` field must be an array containing the requirements needed in order for the package to function. gce would not perform any action to make sure the requirements are meet, instead it logs each of the requirements to the user before intalling the package, alerting the user to make sure the requirements are met before installation.
- the `supportedPlatforms` field must be and array containing the supported platforms in other to run the application. possible values: windows, linux, android, mac.
  gce would perform actions to make sure the platform is supported before installation.
- the `cmd` field specifies the command to run while making the request to the package.
  examples of this values can be `node` if node-based application , `python` if python-based application, and so on....
  if the package is runned as an executable binary, shell, bat, or cmd script that does not have a start command but might require executable permissions to run, then the value of the cmd field must be `{BIN}`. eg:

```json
{ "cmd": "{BIN}" }
```

this allows gce to effectively set the neccessary permisions based on the os,
and execute the binary.

- the `cmd1` field specifies the relative part to the entry point of the package.
  NOTE: for gce to effectively execute the package, it needs the absolute path to the entry point file and not the relative path, although the `cmd1` field needs the relative path. in other to make this work as expected prepend `{PATH}` to the path specified eg :

```json
{ "cmd1": "{PATH}./bin/app" }
```

by specifying this, gce would convert the value to the appropriate absolute path to `./bin/app` in our example or the specified path.

- the `args` field must be an array that specifies optional arguments to pass to the application.
  gce recommends the method instead of passing the arguments directly in the cmd1 field as this can alter the part formating.
  NOTE THAT THE ARGUMENTS PASSED IN THIS FIELD DIFFERS FROM THE ONES THAT WOULD BE OPTIONALY PARSED FROM THE SERVICE WHEN EXECUTING THE PACKAGE.
