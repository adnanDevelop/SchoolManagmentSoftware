package controllers

import (
	"context"
	"fmt"
	"net/http"
	"school-software/config"
	"school-software/models"
	"school-software/network"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var validate = validator.New()

func RegisterUser(c echo.Context) error {
	var user models.User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	// Validating input fields
	err := validate.Struct(user)
	if err != nil {
		var validationErrors []string
		for _, err := range err.(validator.ValidationErrors) {
			validationErrors = append(validationErrors, fmt.Sprintf("Field '%s' %s", err.Field(), err.Tag()))
		}
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Validation error",
			Errors:  validationErrors,
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if user already exists
	var existingUser models.User
	err = config.GetCollection("users").FindOne(ctx, bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		return c.JSON(http.StatusConflict, network.BadResponse{
			Status:  http.StatusConflict,
			Message: "User already exists with this email",
		})
	}

	// Hashing password
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error while hashing password",
		})
	}

	var profilePicture string
	if user.Gender == "male" {
		profilePicture = fmt.Sprintf("https://avatar.iran.liara.run/public/boy?username=%s", user.Name)
	} else {
		profilePicture = fmt.Sprintf("https://avatar.iran.liara.run/public/girl?username=%s", user.Name)
	}

	// Generate User Picture
	user.ProfilePicture = profilePicture
	user.Password = string(hashPassword)
	user.ParentDetails.Father.ProfilePicture = fmt.Sprintf("https://avatar.iran.liara.run/public/boy?username=%s", user.ParentDetails.Father.Name)
	user.ParentDetails.Mother.ProfilePicture = fmt.Sprintf("https://avatar.iran.liara.run/public/girl?username=%s", user.ParentDetails.Mother.Name)
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	result, err := config.GetCollection("users").InsertOne(ctx, user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error creating user",
			Errors:  []string{err.Error()},
		})
	}

	user.ID = result.InsertedID.(primitive.ObjectID).Hex()

	return c.JSON(http.StatusCreated, network.Response{
		Status:  http.StatusCreated,
		Message: "User created successfully",
		Data:    user,
	})
}

// func LoginUser(c echo.Context) error {
// 	var bodyData models.User
// 	if err := c.Bind(&bodyData); err != nil {
// 		c.JSON(http.StatusBadRequest, network.BadResponse{
// 			Status:  http.StatusBadRequest,
// 			Message: err.Error(),
// 		})
// 	}

// }
