//..... templates

export const TglobalConfig = {
 def: "<def>"
}

/* pkgs-lock => 
{ 
  "packageName": {
    "version": <v>,
    "cmd": "string",
    "fpath": "{PATH}string",
    "args": [...any]
  }
}  
*/

export const cacheTemplate= {
    lastUpdate: null, 
    fs: {}, 
    packages: {},  
    stack: {},
    stackLastUpdate: null
};

export const extensionTable = {
  Eas: "ActionScript",
  Eada: "Ada", Eadb: "Ada",
  Eagda: "Agda",
  Ealg: "Algol",
  Eg4: "Antlr",
  Econf: "ApacheConf",
  Eapplescript: "AppleScript",
  Earc: "Arc",
  Eino: "Arduino",
  Easp: "Asp",
  Easm: "Assembly", Es: "Assembly",
  Eahk: "AutoHotkey",
  Ebat: "Batch",  Ecmd: "Batch",
  Ebefunge: "Befunge",
  Ebmx: "BlitzMax",
  Eboo: "Boo",
  Ebf: "Brainfuck",
  Ec: "C", Eh: "C",
  Econfig: "Config",
  Ecs: "Csharp",
  Ecpp: "Cpp", Ecxx: "Cpp", "Ec++": "Cpp", Ehpp: "Cpp",
  Eclj: "Clojure",
  Ecsv: "Csv",
  Ecob: "Cobol", Ecbl: "Cobol",
  Ecoffee: "CoffeeScript", Ecjsx: "CoffeeScript",
  Ecfm: "ColdFusion", Ecfc: "ColdFusion",
  Elisp: "Lisp", Ecl: "Lisp",
  Ev: "Coq",
  Ecr: "Crystal",
  Ecss: "Css",
  Ecmake: "Cmake",
  Econf: "Conf",
  Ed: "D",
  Edart: "Dart",
  Edockerfile: "Docker", EDockerfile: "Docker",
  Epas: "Delphi", Edpr: "Delphi",
  Eex: "Elixir",
  Eelm: "Elm",
  Eenv: "env",
  Eerl: "Erlang",
  Efs: "Fsharp",
  Ef: "Fortran", Efor: "Fortran", Ef90: "Fortran",
  Efb: "FreeBasic",
  Ego: "Golang",
  Egemfile: "Gemfile",
  Egemspec: "Gemspec",
  Egroovy: "Groovy",
  Egitignore: "Git",
  Egradle: "Gradle",
  Ehs: "Haskell",
  Ehx: "Haxe",
  Ehtml: "HTML", Ehtm: "HTML",
  Ehtaccess: "Htaccess",
  Eini: "Ini",
  Ejava: "Java",
  Ejs: "Node/Javascript", Emjs: "Node/Javascript", Ecjs: "Node/Javascript",
  Ejl: "Julia",
  Ejson: "Json",
  Ekt: "Kotlin",
  Etex: "LaTeX",
  Eless: "Less",
  Elogo: "Logo",
  Elua: "Lua",
  Em: "Matlab",
  Emp: "MetaPost",
  Esql: "MySql",
  Emd: "Markdown",
  Emakefile: "Makefile",
  Enim: "Nim",
  Enuspec: "Nuspec",
  Eml: "OCaml", Emli: "OCaml",
  Epas: "Pascal",
  Epl: "Perl", Epm: "Perl",
  Ephp: "Php", Ephp3: "Php", Ephp4: "Php", Ephp5: "Php", Ephp7: "Php",
  Eps: "PostScript",
  Eproperties: "Properties",
  Epro: "Prolog",
  Epodfile: "Podfile",
  Epy: "Python",
  Epom: "Pom",
  Er: "R",
  Erakefile: "Rakefile",
  Ejsx: "React/React Native", Etsx: "React/React Native",
  Erkt: "Racket",
  Erb: "Ruby",
  Ers: "Rust",
  Escala: "Scala",
  Escm: "Scheme",
  Esh: "Shell",
  Est: "Smalltalk",
  Eswift: "Swift",
  Esgml: "Sgml",
  Etcl: "Tcl",
  Etsv: "Tsv",
  Ets: "TypeScript",
  Etoml: "Toml",
  Evb: "Visual Basic/.NET",
  Ewasm: "WebAssembly",
  Exsl: "XSLT",
  Exq: "XQuery",
  Exml: "Xml",
  Exhtml: "Xhtml",
  Eyaml: "Yaml", Eyml: "Yaml",
  Ezsh: "Zsh",
}