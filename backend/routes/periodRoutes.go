package routes

import (
	"school-software/controllers"
	"school-software/middlewares"

	"github.com/labstack/echo/v4"
)

func PeriodRoutes(e *echo.Echo) {
	protectedRoutes := e.Group("/period")
	protectedRoutes.Use(middlewares.JwtMiddlware)

	// Protected routes
	protectedRoutes.GET("/all", controllers.ListPeriod)
	protectedRoutes.GET("/:id", controllers.GetPeriodById)
	protectedRoutes.POST("/create", controllers.CreatePeriod)
	protectedRoutes.DELETE("/delete/:id", controllers.DeletePeriod)
	protectedRoutes.PUT("/update/:id", controllers.UpdatePeriod)
}
