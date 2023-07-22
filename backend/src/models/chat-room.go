package models

import (
	"gorm.io/gorm"
)

type ChatRoom struct {
	gorm.Model
	Participant1ID uint
	Participant1   User
	Participant2ID uint
	Participant2   User
	LastMessage    string
	Messages       []Message `gorm:"foreignKey:ChatRoomID"`
}
