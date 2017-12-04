# PongChat
> Originally developed for [MLH Local Hack Day](https://localhackday.mlh.io/)

### Developers
**Client**
- [Jennifer Coleman](https://github.com/JenniferColeman)
- [Innocent Niyibizi](https://github.com/25cent9)

**Game**
- [Griffin Melson](https://github.com/griffin962)

**Server**
- [Clay McGinnis](https://github.com/claymav)

### What is PongChat?
Pong chat is a platform where you and `n` number of friends can chat and play Pong together at the same time!

## Installation
1. Install go from [golang.org](https://golang.org/dl/)
2. Clone the repository with `git clone https://github.com/Durian-Inc/PongChat`

## Running the app
1. Switch to the server directory `cd PongChat/server`
2. Run the server with `go run src/main.go`

From here, navigate to localhost:10000 in your favorite browser (with JavaScript enabled) and you should see the app, and be able to chat.

To get other clients to join, forward the port 10000 and have them connect to your computer.