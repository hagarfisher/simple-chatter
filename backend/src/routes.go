package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"fmt"

	"time"

	models "simple-chatter/src/models"
	"strconv"
)

type AuthRequestBody struct {
	Nickname string
}

type CreateMessageRequestBody struct {
	ChatRoomID    uint
	MessageFromID uint
	Content       string
}

type ChatRoom struct {
	Id           int
	Participant1 string
	Participant2 string
	LastMessage  string
	LastUpdated  time.Time
}

type Message struct {
	Id          int
	ChatRoomId  int
	MessageFrom string
	MessageTo   string
	Content     string
	CreatedAt   time.Time
}

func Authenticate(context *gin.Context) {
	var requestBody AuthRequestBody

	if err := context.BindJSON(&requestBody); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "couldn't auth"})
		return
	}
	user := models.User{
		Nickname: requestBody.Nickname,
	}
	userCreateResult := models.DB.FirstOrCreate(&user, models.User{Nickname: requestBody.Nickname})

	var users []models.User
	result := models.DB.Where("id <> ?", user.ID).Find(&users)
	if result.Error != nil {
		fmt.Println("error: ")
		fmt.Println(result.Error)
		context.JSON(http.StatusInternalServerError, gin.H{"success": "false"})
		return
	}

	if userCreateResult.RowsAffected == 1 {
		var chatRooms = []models.ChatRoom{}
		for _, otherUser := range users {
			chatRooms = append(chatRooms, models.ChatRoom{
				Participant1ID: user.ID,
				Participant2ID: otherUser.ID,
			})
		}
		models.DB.Create(&chatRooms)
	}

	context.JSON(http.StatusOK, gin.H{"userId": user.ID})
}

func GetChatRooms(context *gin.Context) {
	userId := context.Query("user_id")
	var chatRooms []models.ChatRoom
	result := models.DB.
		Where("participant1_id = ? OR participant2_id = ?", userId, userId).
		InnerJoins("Participant1").
		InnerJoins("Participant2").
		Find(&chatRooms)
	if result.Error != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "couldn't find chat rooms"})
		return
	}

	context.JSON(http.StatusOK, chatRooms)
}

func GetMessages(context *gin.Context) {

	chatRoomId := context.Query("chat_room_id")

	chatRoomIdInt, err := strconv.ParseInt(chatRoomId, 10, 0)
	if err != nil {
		fmt.Println(err)
		context.String(http.StatusInternalServerError, "")
		return
	}
	var messages []models.Message
	result := models.DB.Where("chat_room_id = ?", chatRoomIdInt).
		Joins("ChatRoom").
		Joins("ChatRoom.Participant1").
		Joins("ChatRoom.Participant2").
		Order("created_at asc").
		Find(&messages)

	if result.Error != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "couldn't find messages"})
		return
	}

	context.JSON(http.StatusOK, messages)
}
