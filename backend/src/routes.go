package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"fmt"

	"time"

	"sort"
	"strconv"
)

type AuthRequestBody struct {
	Nickname string
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
		// DO SOMETHING WITH THE ERROR
	}

	context.JSON(http.StatusOK, gin.H{"success": "true"})
}

func GetChatRooms(context *gin.Context) {
	var chatRoomSample = []ChatRoom{
		{
			Id:           1,
			Participant2: "bob the builder",
			Participant1: "boop",
			LastMessage:  "yo bro wazzup?",
			LastUpdated:  time.Now(),
		},
		{
			Id:           2,
			Participant2: "roofy the dog",
			Participant1: "boop",
			LastMessage:  "Please walk me .. don't forget!",
			LastUpdated:  time.Now(),
		},
		{
			Id:           3,
			Participant2: "Master Kenobi",
			Participant1: "boop",
			LastMessage:  "Im sending u a phising link please clikc it very trusted yes!",
			LastUpdated:  time.Now(),
		},
		{
			Id:           1,
			Participant2: "bob the builder",
			Participant1: "boop",
			LastMessage:  "yo bro wazzup?",
			LastUpdated:  time.Now(),
		},
		{
			Id:           2,
			Participant2: "roofy the dog",
			Participant1: "boop",
			LastMessage:  "Please walk me .. don't forget!",
			LastUpdated:  time.Now(),
		},
		{
			Id:           3,
			Participant2: "Master Kenobi",
			Participant1: "boop",
			LastMessage:  "Im sending u a phising link please clikc it very trusted yes!",
			LastUpdated:  time.Now(),
		},
	}
	nickname := context.Query("nickname")
	fmt.Println(chatRoomSample)
	fmt.Println(nickname)

	context.JSON(http.StatusOK, chatRoomSample)
}

func GetMessages(context *gin.Context) {
	var messages = []Message{
		{
			Id:          1,
			ChatRoomId:  1,
			MessageFrom: "bob the builder",
			MessageTo:   "boop",
			Content:     "hello",
			CreatedAt:   time.Date(2022, 7, 3, 14, 34, 0, 0, time.Local),
		},
		{
			Id:          1,
			ChatRoomId:  1,
			MessageFrom: "boop",
			MessageTo:   "bob the builder",
			Content:     "hellooooo bob the builder!",
			CreatedAt:   time.Date(2023, 7, 3, 14, 39, 0, 0, time.Local),
		},
		{
			Id:          1,
			ChatRoomId:  1,
			MessageFrom: "bob the builder",
			MessageTo:   "boop",
			Content:     "hellooooo",
			CreatedAt:   time.Date(2023, 7, 3, 14, 34, 0, 0, time.Local),
		},
		{
			Id:          2,
			ChatRoomId:  2,
			MessageFrom: "roofy the dog",
			MessageTo:   "boop",
			Content:     "hello",
			CreatedAt:   time.Now(),
		},
	}
	chatRoomId := context.Query("chat_room_id")

	chatRoomIdInt, err := strconv.ParseInt(chatRoomId, 10, 0)
	if err != nil {
		fmt.Println(err)
		context.String(http.StatusInternalServerError, "")
		return
	}
	var messagesInChatRoom = []Message{}

	for i := range messages {
		if messages[i].ChatRoomId == int(chatRoomIdInt) {
			messagesInChatRoom = append(messagesInChatRoom, messages[i])
		}
	}
	sort.Slice(messagesInChatRoom, func(i, j int) bool {
		return messagesInChatRoom[i].CreatedAt.Before(messagesInChatRoom[j].CreatedAt)
	})
	context.JSON(http.StatusOK, messagesInChatRoom)

}
