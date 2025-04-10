package routes

import (
	"school-software/controllers"
	"school-software/middlewares"

	"github.com/labstack/echo/v4"
)

func UserRoutes(e *echo.Echo) {
	// Public routes
	// e.POST("/auth/login", controllers.LoginUser)
	e.POST("/auth/register", controllers.RegisterUser)

	protectedRoutes := e.Group("/user")
	protectedRoutes.Use(middlewares.JwtMiddlware)

	// Protected routes
	// protectedRoutes.GET("/:id", controllers.GetUserById)
	// protectedRoutes.GET("/all", controllers.ListAllUsers)
	// protectedRoutes.PUT("/update", controllers.UpdateUser)
	// protectedRoutes.POST("/logout", controllers.LogoutUser)
	// protectedRoutes.DELETE("/delete/:id", controllers.DeleteUser)
}
