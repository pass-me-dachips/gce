# Upcoming

in later versions, gce would introduce new functionalities which includes :

- a watch function that watches the top level of the current working directory
  for changes made outside the gce service, notifying the client via ws
  using custom OID'S, SIG.

- full support for packages usage in gce services/gcce's

- a registry/global-cache that lives on the internet which stores informations about packages (Headerfiles), for faster retrieval, insigths and lookup.

- a package for handling/managing terminal windows, with addy functionalities like
  creating a new terminal window or bringing an existing window back to the
  foreground.

- an additional support for web urls(git) instead of relying on only file paths as args in
  commands like `install`, `pkg add` and `start`.

- additional built-in packages: http client, live server, word finders/ replacers, and "the gce anot project: remember, upcoming, gitignore, fs, pins".
