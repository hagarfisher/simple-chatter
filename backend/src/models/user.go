package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Nickname   string     `gorm:"uniqueIndex"`
	ChatRooms1 []ChatRoom `gorm:"foreignKey:Participant1ID"`
	ChatRooms2 []ChatRoom `gorm:"foreignKey:Participant2ID"`
}
