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
