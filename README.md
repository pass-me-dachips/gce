
# Grand Code Environment (GCE)

## Showcasing Kivana (The Default Gcce)
 
![https://tgcep-7d565.web.app/showcase/gce-desktop1.png](https://tgcep-7d565.web.app/showcase/gce-desktop1.png)
![https://tgcep-7d565.web.app/showcase/gce-desktop2.png](https://tgcep-7d565.web.app/showcase/gce-desktop2.png)
![https://tgcep-7d565.web.app/showcase/gce-desktop3.png](https://tgcep-7d565.web.app/showcase/gce-desktop3.png)

## Installation
[https://tgcep-7d565.web.app/install](https://tgcep-7d565.web.app/install)

## What is GCE?

The Grand Code Environment (GCE), pronounced "gee cee," is a revolutionary code
environment designed to transcend traditional code editors. Unlike other code editors such
as VSCode, Vim, or Nano, GCE offers a completely different approach by providing an
integrated backend system that handles core file system operations and other backend
processes. This allows developers to focus solely on building the user interface of their
code editors.

## Key Features

- **Cross-Platform**: GCE is designed to work seamlessly across Android (via Termux), Linux,
  Windows (experimental), and macOS (experimental).
- **High Performance**: Written in Node.js, GCE ensures fast startup and efficient performance.
- **Scalability and Customizability**: Developers can easily switch between different GCCEs,
  customize the environment, and contribute to the codebase.

## Benefits of GCE

### Focus on User Interface

By using GCE, developers can concentrate on designing the user interface of their code
editors without worrying about backend operations. GCE provides APIs for handling packages
and I/O file operations, streamlining the development process.

### Continuous Development and Updates

GCE is an actively developed project, with frequent updates to introduce new features and
improvements. This ensures that GCCEs built on GCE can stay up-to-date with the latest
advancements.

### Open Source and Community-Driven

GCE is open source and licensed under the MIT license. This encourages community
involvement, allowing developers to contribute to the project, create GCCEs, and develop
packages. The community-driven nature of GCE fosters innovation and collaboration.

### Cross-Platform Support

GCE is designed to be portable across various platforms, including Android, Linux,
Windows (experimental), and macOS (experimental). The platform-specific installation 
ensures that GCE runs optimally on each operating system.

### Customization and Flexibility

GCE allows developers to customize the environment extensively. by modifying the source 
code itself, GCE offers unparalleled flexibility.
Developers can also easily switch between different GCCEs without loosing their configuarations, 
ensuring that they can always use the best tool for their needs.

## When To Use GCE 

- Integrating a web-based text editor into your service, e.g., Cloud.
- **Code sharing**: By exposing the socket the GCE service runs on to the internet using 
  software like [NGROK](https://ngrok.com), various people from different parts of the 
  world can work on your project and make changes that sync to your file system 
  immediately, without the need of having GCE running on their machine. 
  A web browser is the only software needed.
- Tutorials, e.g., (YouTube tutorials), tests, or prototypes that are only useful for a 
  specific period of time: By using the GCE `--temp` option, GCE ensures the codebase 
  ceases to exist as soon as the service dies.
- Cases where you have a low-end device: GCE runs smoothly on low-end devices. 
  You just choose the most lightweight GCE distro (GCCE) depending on your use case. 
  When you run `gce`, you would typically see a field that says 
  _rec services in parallel <value>_. This field shows you the number of GCE services you are recommended to run simultaneously.
- Regular coding.
- **MultiTasking**: When you install GCE and run a service on a dedicated server, e.g.
  , [AWS EC2](https://aws.amazon.com/ec2/), 
  [Google Compute Engine](https://cloud.google.com/compute), or 
  [Microsoft Azure Virtual Machines](https://azure.microsoft.com/en-us/services/virtual-machines/), 
  which offers such flexibility, multiple developers can work on the same code base at the 
  same time, although on different files to avoid data overwritting and breaches: 
  _View the official documentation to learn more_. Your project is also stored on a dedicated server, which enhances the risk of data loss even without a VCS, and promotes portability as any device can work on the codebase. Note that exposing a service is generally super insecure. GCE recommends wrapping these services with more powerful software, e.g., [Nginx](https://www.nginx.com/), [NGROK](https://ngrok.com). Set up a strong firewall configuration to block unauthorized IPs.

## Getting Started with GCE

To Get a more detailed overview about gce, it's use cases, installation process, and
everything else needed to fully understand, contribute and start using gce, gce recommends
visiting its official website at
[https://tgcep-7d565.web.app/](https://tgcep-7d565.web.app/) to learn more.
