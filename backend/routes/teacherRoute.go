package routes

import (
	"school-software/controllers"
	"school-software/middlewares"

	"github.com/labstack/echo/v4"
)

func TeacherRoutes(e *echo.Echo) {

	protectedRoutes := e.Group("/teacher")
	protectedRoutes.Use(middlewares.JwtMiddlware)

	// Protected routes
	protectedRoutes.GET("/:id", controllers.GetTeacherById)
	protectedRoutes.GET("/all", controllers.ListTeachers)
}
