/* 
 * This file contains short snippets | placeholders for multiple langs
 * File meant to be used in spkg.quick
 * This file migth contain incorrect codes. be sure to crosscheck.
*/


export const short = "The quick brown fox jumps over the lazy dog.";

export const fill = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam";

export const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const bacon = "Bacon ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const actionscript = `
trace("Hello, World!");
`;

export const ada = `
with Ada.Text_IO;
use Ada.Text_IO;

begin
   Put_Line ("Hello, World!");
end Hello;
`;

export const applescript = `
print "Hello, World!"
`;

export const assembly = `
section .data
msg db 'Hello, World!',0

section .text
global _start

_start:
    mov eax, 4
    mov ebx, 1
    mov ecx, msg
    mov edx, len
    int 0x80
    mov eax, 1
    xor ebx, ebx
    int 0x80

section .data
len equ $ - msg
`;

export const autoit = `
MsgBox(0, "Hello, World!", "Hello, World!")
`;

export const bash = `
echo "Hello, World!"
`;

export const basic = `
PRINT "Hello, World!"
`;

export const c = `
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
`;

export const cpp = `
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`;

export const csharp = `
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
`;

export const clojure = `
(println "Hello, World!")
`;

export const cobol = `
IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO.

PROCEDURE DIVISION.
    DISPLAY "Hello, World!".
`;

export const coffeescript = `
console.log "Hello, World!"
`;

export const d = `
import std.stdio;

void main() {
    writeln("Hello, World!");
}
`;

export const dart = `
void main() {
    print('Hello, World!');
}
`;

export const eiffel = `
eiffel
class HELLO
feature
    main -- Entry point
        print("Hello, World!%N")
end
`;

export const erlang  = `
-module(Hello).
-export([hello/0]).

hello() ->
    io:fwrite("Hello, World!~n").
`;

export const fortran = `
PROGRAM HELLO
  PRINT *, "Hello, World!"
END PROGRAM HELLO
`;

export const go = `
package main
import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
`;

export const groovy = `
println "Hello, World!"
`;

export const haskell = `
main :: IO ()
main = putStrLn "Hello, World!"
`;

export const html = `
<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Document</title>
</head>
<body>

</body>
</html>
`;

export const java = `
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`;

export const javascript = `
console.log("Hello, World!");
`;

export const julia = `
println("Hello, World!")
`;

export const kotlin = `
fun main() {
    println("Hello, World!")
}
`;

export const latex = `
\\documentclass{article}
\\begin{document}
Hello, World!
\\end{document}
`;

export const lisp = `
(print "Hello, World!")
`;

export const lua = `
print("Hello, World!")
`;

export const matlab = `
disp('Hello, World!');
`;

export const mysql = `
SELECT 'Hello, World!';
`;

export const nim = `
echo "Hello, World!"
`;

export const nodejs = `
import { createServer } from "node:http";

const cb = (request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ack : true}));
}
const server = createServer(cb);
const port  = process.env.port || 8080;

server.listen(port, ()=> console.log("server running on port %s", port));
`;

export const objectivec = `
#import <Foundation/Foundation.h>

int main() {
    NSLog(@"Hello, World!");
    return 0;
}
`;

export const ocaml = `
print_endline "Hello, World!";;
`;

export const perl = `
print "Hello, World!\\n";
`;

export const php = `
<?php echo "Hello, World!"; ?>
`;

export const powershell = `
Write-Host "Hello, World!"
`;

export const prolog = `
write('Hello, World!'), nl.
`;

export const python = `
print("Hello, World!")
`;
 
export const r = `
print("Hello, World!")
`;

export const ruby = `
puts "Hello, World!"
`;

export const rust = `
fn main() {
    println!("Hello, World!");
}
`;

export const scala = `
object Hello {
  def main(args: Array[String]) {
    println("Hello, World!")
  }
}
`;

export const docker = `
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
`;

export const k8s = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello-world
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - name: hello-world
        image: hello-world:latest
        ports:
        - containerPort: 80
`;

export const nginx = `
http {
    server {
        listen 80;
        location / {
            return 200 "Hello, World!";
        }
    }
}
`;
