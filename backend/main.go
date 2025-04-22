package main

import (
	"context"
	"log"
	"os"
	"school-software/config"
	"school-software/routes"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Loading .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("❌ Error loading .env file")
	} else {
		log.Println("✅ .env file loaded")
	}

	// Connect to MongoDB
	mongoClient := config.ConnectDB()
	defer func() {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := mongoClient.Disconnect(ctx); err != nil {
			log.Fatal("❌ Failed to disconnect from MongoDB:", err)
		}
		log.Println("✅ MongoDB connection closed")
	}()

	e := echo.New()

	// Middlewares
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))

	// Routes
	routes.UserRoutes(e)
	routes.ClassRoutes(e)
	routes.SubjectRoutes(e)
	routes.TeacherRoutes(e)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
		log.Printf("⚠️  PORT environment variable not set, defaulting to %s", port)
	}

	log.Printf("🚀 Server is running on port %s", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}
