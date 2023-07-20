package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Nickname   string
	ChatRooms1 []ChatRoom `gorm:"foreignKey:Participant1"`
	ChatRooms2 []ChatRoom `gorm:"foreignKey:Participant2"`
}
