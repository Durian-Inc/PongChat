package main

import (
	"strings"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var port = ":10000"

var messengerClients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan message)                    // broadcast channel
var players = make(map[string]player)

//var gamecast = make(chan GamePacket)
// Configure the upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type message struct {
	Username string `json:"username"`
	Message  string `json:"message"`
	Socket   *websocket.Conn
}

type player struct {
	username string
	paddle   uint8
	socket   *websocket.Conn
}

type ballType struct {
	x     float64
	y     float64
	dir   float64
	speed float64
}

type paddleType struct {
	x     float64
	y     float64
	angle float64
	id    uint8
	color string
}

type gamePacket struct {
	ball    string
	paddles []string
}

func main() {
	// New Goroutine that loops infinitely, updating messages
	go handleMessages()

	// Configure websocket route for messages
	http.HandleFunc("/ws", handleMessageConnection)

	// Configure http route
	http.Handle("/", http.FileServer(http.Dir("../client")))

	// Start the server on localhost and log any errors
	log.Println("HTTP server starting at", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

// Upon connection to the website, a WebSocket is created and a new Goroutine will be spawned
// that will handle that specific connection
func handleMessageConnection(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}

	// Close the connection when the function returns
	defer ws.Close()

	// Register the new client
	messengerClients[ws] = true
	log.Println("Client connected: user", len(messengerClients))

	for {
		var msg message

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
			player := player{msg.Username, uint8(len(players)), msg.Socket}
			players[msg.Username] = player
		} else if strings.ToLower(msg.Message) == "/start" {
			// NO
		} else {
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
