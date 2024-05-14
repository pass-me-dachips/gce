

function show() {
  console.log("show")
}

function man() {
  console.log("man")
}

function add() {
  console.log("add")
}

function remove() {
  console.log("remove")
}

export default function Pkg(args) {
  args = args.slice(1);
  if (args.length === 2) {
    const option = args[0]; const relativePath = args[1];
    console.log(option, relativePath);
    switch(option) {
      case "man": man();
      case "show": show();
      case "add": add();
      case "remove": remove();
    }
  } else throw { message: `ABORTED: cmd expects 2 arguments, got ${args.length}`}
}