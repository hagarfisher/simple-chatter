package main

import (
	"encoding/json"
	models "simple-chatter/src/models"
	"time"

	"github.com/gorilla/websocket"
)

// client represents a single chatting user.
type MessageData struct {
	ChatRoomID    uint   `json:"chat_room_id"`
	MessageFromID uint   `json:"message_from_id"`
	Content       string `json:"content"`
}

type Payload struct {
	Event string
	Data  MessageData `json:"data"`
}

type leanMessage struct {
	ID            uint
	CreatedAt     time.Time
	ChatRoomID    uint
	MessageFromID uint
	Content       string
}

type client struct {
	socket *websocket.Conn

	// receive is a channel to receive messages from other clients.
	receive chan []byte

	room *room
}

func (c *client) read() {
	defer c.socket.Close()
	for {
		var payload Payload
		err := c.socket.ReadJSON(&payload)
		if err != nil {
			return
		}
		createdMessage := createMessage(payload.Data)
		byteMessage, err := json.Marshal(createdMessage)
		c.room.forward <- byteMessage
	}
}

func (c *client) write() {
	defer c.socket.Close()
	for msg := range c.receive {
		err := c.socket.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			return
		}
	}
}

func createMessage(message MessageData) leanMessage {

	createdMessage := models.Message{
		ChatRoomID:    message.ChatRoomID,
		MessageFromID: message.MessageFromID,
		Content:       message.Content,
	}

	models.DB.Create(&createdMessage)
	result := leanMessage{
		ID:            createdMessage.ID,
		ChatRoomID:    createdMessage.ChatRoomID,
		MessageFromID: createdMessage.MessageFromID,
		Content:       createdMessage.Content,
		CreatedAt:     createdMessage.CreatedAt,
	}
	return result
}
