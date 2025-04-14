package routes

import (
	"school-software/controllers"
	"school-software/middlewares"

	"github.com/labstack/echo/v4"
)

func SubjectRoutes(e *echo.Echo) {
	protectedRoutes := e.Group("/subject")
	protectedRoutes.Use(middlewares.JwtMiddlware)

	// Protected routes
	protectedRoutes.GET("/all", controllers.ListSubject)
	protectedRoutes.GET("/:id", controllers.GetSubjectById)
	protectedRoutes.GET("/create", controllers.CreateSubject)
	protectedRoutes.DELETE("/delete/:id", controllers.DeleteSubject)
	protectedRoutes.PUT("/update-password", controllers.UpdateSubject)
}
