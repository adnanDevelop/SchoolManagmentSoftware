package routes

import (
	"school-software/controllers"
	"school-software/middlewares"

	"github.com/labstack/echo/v4"
)

func ClassRoutes(e *echo.Echo) {
	protectedRoutes := e.Group("/class")
	protectedRoutes.Use(middlewares.JwtMiddlware)

	// Protected routes
	protectedRoutes.GET("/all", controllers.ListClass)
	protectedRoutes.GET("/:id", controllers.GetClassById)
	protectedRoutes.POST("/create", controllers.CreateClass)
	protectedRoutes.DELETE("/delete/:id", controllers.DeleteClass)
	protectedRoutes.PUT("/update/:id", controllers.UpdateClass)
}
