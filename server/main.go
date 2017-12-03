package main

import (
	"log"
	"net/http"
	"github.com/gorilla/websocket"
)

var messengerClients = make(map[*websocket.Conn]bool) // connected clients
var broadcast = make(chan Message)           // broadcast channel
// Configure the upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

func check(err error, message string) {
	if err != nil {
		panic(err)	      
	}
	log.Println(message)
}

func main() {
	// Create a simple file server
	fs := http.FileServer(http.Dir("../public"))
	http.Handle("/", fs)

	log.Println("Before websocket connect")
	// Configure websocket route
	http.HandleFunc("/ws", handleConnections)
	
	go handleMessages()

	// Start the server on localhost port 8000 and log any errors
	log.Println("HTTP server starting at :8000")
	err := http.ListenAndServe(":8000", nil)
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
	log.Printf("%s", "weebs")

	for {
		var msg Message
		// Read in a new message as JSON and map it to a Message object
		err := ws.ReadJSON(&msg)
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
		if msg.Message != "" {
			for client := range messengerClients {
				err := client.WriteJSON(msg)
				if err != nil {
					log.Printf("error: %v", err)
					client.Close()
					delete(messengerClients, client)
				}
			}
		}
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
