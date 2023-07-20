package models

import (
	"gorm.io/gorm"
)

type ChatRoom struct {
	gorm.Model
	Participant1 uint
	Participant2 uint
	LastMessage  string
	Messages     []Message
}
