package models

import (
	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	ChatRoomID    uint
	ChatRoom      ChatRoom
	MessageFromID uint
	Content       string
}
