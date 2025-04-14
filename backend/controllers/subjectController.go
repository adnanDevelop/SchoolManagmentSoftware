package controllers

import (
	"context"
	"math"
	"net/http"
	"school-software/config"
	"school-software/models"
	"school-software/network"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Create subject
func CreateSubject(c echo.Context) error {
	var subjectData models.Subject
	if err := c.Bind(&subjectData); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check if subject already exists
	err := config.GetCollection("subjects").FindOne(ctx, bson.M{"name": subjectData.Name}).Decode(&models.Subject{})
	if err == nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Subject already exists",
		})
	} else if err != mongo.ErrNoDocuments {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	// Create subject
	result, err := config.GetCollection("subjects").InsertOne(ctx, subjectData)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	subjectData.ID = result.InsertedID.(primitive.ObjectID)

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Subject created",
		Data:    subjectData,
	})
}

// Update subject
func UpdateSubject(c echo.Context) error {
	subjectId := c.Param("id")
	subjectIod, err := primitive.ObjectIDFromHex(subjectId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid subject id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var findSubject models.Subject
	err = config.GetCollection("subjects").FindOne(ctx, bson.M{"_id": subjectIod}).Decode(&findSubject)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Subject not found",
		})
	}

	// Update subject
	var subjectData models.Subject
	if err := c.Bind(&subjectData); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid request body",
		})
	}
	_, err = config.GetCollection("subjects").UpdateOne(ctx, bson.M{"_id": subjectIod}, bson.M{"$set": subjectData})
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Error while updating subject",
		})
	}

	subjectData.ID = subjectIod
	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Subject updated",
		Data:    subjectData,
	})

}

func DeleteSubject(c echo.Context) error {
	subjectId := c.Param("id")
	subjectIod, err := primitive.ObjectIDFromHex(subjectId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid subject id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Delete subject
	_, err = config.GetCollection("subjects").DeleteOne(ctx, bson.M{"_id": subjectIod})
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Error while deleting subject",
		})
	}

	return c.JSON(http.StatusOK, network.ShortResponse{
		Status:  http.StatusOK,
		Message: "Subject deleted",
	})
}

func ListSubject(c echo.Context) error {
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

	filter := bson.M{}
	if search != "" {
		filter = bson.M{
			"$or": []bson.M{
				{"title": bson.M{"$regex": search, "$options": "i"}},
				{"description": bson.M{"$regex": search, "$options": "i"}},
			},
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.GetCollection("subjects")

	// Count for pagination
	countStage := bson.D{{Key: "$match", Value: filter}}
	totalCount, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error while counting data",
		})
	}

	// Get data
	cursor, err := collection.Aggregate(ctx, mongo.Pipeline{
		countStage,
		{{Key: "$match", Value: filter}},
		{{Key: "$skip", Value: skip}},
		{{Key: "$limit", Value: limit}},
	})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error while getting data",
		})

	}

	var subjects []models.Subject
	err = cursor.All(ctx, &subjects)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error while getting data",
		})
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Data retreived successfully",
		Data:    subjects,
		Pagination: &network.Pagination{
			CurrentPage: page,
			TotalPage:   totalPages,
			TotalData:   int(totalCount),
		},
	})

}

func GetSubjectById(c echo.Context) error {
	subjectId := c.Param("id")
	subjectIod, err := primitive.ObjectIDFromHex(subjectId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid subject id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var subject models.Subject
	err = config.GetCollection("subjects").FindOne(ctx, bson.M{"_id": subjectIod}).Decode(&subject)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Subject not found",
		})

	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Data retreived successfully",
		Data:    subject,
	})
}
