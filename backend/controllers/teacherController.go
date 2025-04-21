package controllers

import (
	"context"
	"fmt"
	"math"
	"net/http"
	"school-software/config"
	"school-software/network"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// List All Users
func ListTeachers(c echo.Context) error {
	search := c.QueryParam("search")
	pageStr := c.QueryParam("page")
	limitStr := c.QueryParam("limit")

	page := 1
	limit := 10
	var err error

	if pageStr != "" {
		page, err = strconv.Atoi(pageStr)
		if err != nil || page <= 0 {
			page = 1
		}
	}
	if limitStr != "" {
		limit, err = strconv.Atoi(limitStr)
		if err != nil || limit <= 0 {
			limit = 10
		}
	}
	skip := (page - 1) * limit

	filter := bson.M{
		"role": "teacher",
	}

	if search != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": search, "$options": "i"}},
			{"email": bson.M{"$regex": search, "$options": "i"}},
			{"description": bson.M{"$regex": search, "$options": "i"}},
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.GetCollection("users")

	totalCount, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error while counting data",
		})
	}

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: filter}},
		{{Key: "$sort", Value: bson.D{{Key: "createdAt", Value: -1}}}},
		{{Key: "$skip", Value: skip}},
		{{Key: "$limit", Value: limit}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Aggregation error",
		})
	}

	var users []bson.M
	if err := cursor.All(ctx, &users); err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error while decoding users",
		})
	}

	type Sibling struct {
		Name           string `bson:"name" json:"name"`
		Email          string `bson:"email" json:"email"`
		ProfilePicture string `bson:"profilePicture" json:"profilePicture"`
	}

	for _, user := range users {
		if siblingsRaw, ok := user["siblings"].(primitive.A); ok {
			var filteredSiblings []Sibling
			for _, s := range siblingsRaw {
				if sibDoc, ok := s.(bson.M); ok {
					filteredSiblings = append(filteredSiblings, Sibling{
						Name:           fmt.Sprintf("%v", sibDoc["name"]),
						Email:          fmt.Sprintf("%v", sibDoc["email"]),
						ProfilePicture: fmt.Sprintf("%v", sibDoc["profilePicture"]),
					})
				}
			}
			user["siblings"] = filteredSiblings
		}
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Data retreived successfully",
		Data:    users,
		Pagination: &network.Pagination{
			CurrentPage: page,
			TotalPage:   totalPages,
			TotalData:   int(totalCount),
		},
	})
}


// Get Teacher ById
func GetTeacherById(c echo.Context) error {
	userId := c.Param("id")
	objectId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid user ID",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.GetCollection("users")

	var user bson.M
	err = collection.FindOne(ctx, bson.M{"_id": objectId, "role": "teacher"}).Decode(&user)
	if err != nil {
		return c.JSON(http.StatusOK, network.Response{
			Status:  http.StatusOK,
			Message: "Teacher retrieved successfully",
			Data:    []interface{}{},
		})
	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Teacher retrieved successfully",
		Data:    user,
	})
}
