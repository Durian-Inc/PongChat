package main

import (
	"strings"
	"log"
	"net/http"
	"github.com/gorilla/websocket"
)

var messengerClients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan Message)           // broadcast channel
var players = make(map[string]Player)
var gamecast = make(chan GamePacket)
// Configure the upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Username string `json:"username"`
	Message  string `json:"message"`
	Socket *websocket.Conn
}

type Player struct {
	Username string
	Paddle uint8	
	Socket *websocket.Conn
}

type GamePacket struct {
	Ball string
	Paddle string
}

func check(err error, message string) {
	if err != nil {
		panic(err)	      
	}
	log.Println(message)
}

func main() {
	port := ":10000"

	// Create a simple file server
	fs := http.FileServer(http.Dir("../public"))
	http.Handle("/", fs)

	// Configure websocket route
	http.HandleFunc("/ws", handleConnections)
	
	go handleMessages()

	// Start the server on localhost port 8000 and log any errors
	log.Println("HTTP server starting at", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		panic(err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Make sure we close the connection when the function returns
	defer ws.Close()

	// Register our new client
	messengerClients[ws] = true
	log.Println("Client connected: user", len(messengerClients))

	for {
		var msg Message
		// Read in a new message as JSON and map it to a Message object
		err := ws.ReadJSON(&msg)
		msg.Socket = ws
		if err != nil {
			log.Printf("error: %v", err)
			delete(messengerClients, ws)
			break
		}
		// Send the newly received message to the broadcast channel
		broadcast <- msg
	}
}

func handleMessages() {
        for {
                // Grab the next message from the broadcast channel
                msg := <-broadcast
                // Send it out to every client that is currently connected
		if strings.ToLower(msg.Message) == "/join" {
			player := Player{msg.Username, uint8(len(players)), msg.Socket}
			players[msg.Username] = player
		} else if strings.ToLower(msg.Message) == "/start" {
			// stuff
		} else if msg.Message == "" {
			for player := range players {
				err := players[player].Socket.WriteJSON(msg)
				if err != nil {
					log.Printf("error: %v", err)
					players[player].Socket.Close()
				}
			}
		} else {
			log.Println(msg.Message)
			for client := range messengerClients {
				err := client.WriteJSON(msg)
				if err != nil {
					log.Printf("error: %v", err)
					client.Close()
					delete(messengerClients, client)
				}
			}
		}
	}
}
