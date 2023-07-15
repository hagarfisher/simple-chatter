package main

import (
	"net/http"

	routes "simple-chatter/src"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())
	router.GET("/ping", func(context *gin.Context) {
		context.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	router.POST("/auth", routes.Authenticate)
	router.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}