package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"fmt"
)

type AuthRequestBody struct {
	Nickname string
}

// post auth route
func Authenticate(context *gin.Context) {
	var requestBody AuthRequestBody

	if err := context.BindJSON(&requestBody); err != nil {
		// DO SOMETHING WITH THE ERROR
	}

	fmt.Println(requestBody.Nickname)
	context.JSON(http.StatusOK, gin.H{"success": "true"})
}
