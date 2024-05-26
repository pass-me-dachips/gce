all gcces must have a gconfig.json file in its root dir that holds the configs

of the gcce. the contents must be as follows : {
start,
author,
name,
repo,
version,
entry,
notFound,
forbiden,
}

the start field if add in the aboove object tells gcce what to customly run
after the service start instead of using the default "opening of the gcce in
the browser".
in the start field value, if the script would need the port as an argument or
something you can simply specify {PORT} in the position and gce would replace
it with the actual port.
if u omit the field gce would open the browser by default. if u add the field
but set the value to default, gce would do same.
NOTE gce would show the script to the user and ask for acknowledgedment before
continuation.

UNLIKE OPERAS, THESE PACKAGES DOES NOT RAISE ANY ERRORS EVEN AFTER OCCURENECE.
THEY ARE RESPONDED AS PLAIN STRINGS.

NOTE THE QUICK SPKG WOULD THROW ERRORS SINCE IT DEALS WITH FS.

the ws path for operations is /sapi: sapi as in service Api.

any sapi response with CODE -1 means the request was not even process and failed,
while any response with CODE 0 means the request was recieved and processed
succesfully.

each request must contains an oid which stands for operation ID. each response must
also contain the same oid of the request so that the request can be identified when
reaching the client side.

SIGNALS ARE ONLY PRESENT IN CODE 0 RESPONSES AND IT IS THE
ACTUAL CODE REPRESENTING IF THE REQUEST WAS COMPLETELY ACKNOWLEGED OR NOT
eg: reading from a file.

GCE WOULD HARDLY OR WOULD NEVER STRIP ANY FEATURE PAPKAGES OR GCCES COMPLETELY RELY ON

coreapi end point for service apis
and notstatic header set to true

coreutils endpoint for utils like ping
and notstatic header set to true

anything else if for serving web contents

SERVICE API ENDPOINT STRUCTURE THE ONE THAT THE GCCE NEEDS =>
/coreapi/<type>/<operation>/<oid>
header {
notstatic: true,
Content-Type: application/json
version: 1
}

where type => is the type of request eg : fs, spkg,
operation => is the operation eg for fs: readdir etc, for spkg: add, etc
oid => operation id

all in lowercase

eg /coreapi/fs/readdir/oid

the gce api version is different from the environment version, the gce version is not frequently updating that been said, currently the version is 1 and and it must be specified in the version headder.
if you used any version not existing: error boom.
the payload of the request must be an objecr also

reponse payload :

if the response was not even processed due to bad request, you would get :
{
error: <message>,
code: -1
}
and a status of 400 always

if the request was processedc you would get status 200 regardless of wether the requst was succesul or not. the payload goes : {
ack: bool,
sig: string,
oid: string,
code : <always 0>,
payload : {...}
}

this respone value, sig is in uppercase

the ack is either true or false, which means acknowoledged, the sig is the signall.
read signal to learn more. the oid is the oid you specified. the code is aleays 0
and the payload is always an object
