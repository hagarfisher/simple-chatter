package models

import (
	"gorm.io/gorm"
)

type Message struct {
	gorm.Model
	ChatRoomID  uint
	MessageFrom string
	MessageTo   string
	Content     string
}
