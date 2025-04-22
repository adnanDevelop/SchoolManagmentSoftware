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

func CreateClass(c echo.Context) error {
	var classData models.Class
	if err := c.Bind(&classData); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// check if  class already exist
	var isClassExist models.Class
	err := config.GetCollection("classes").FindOne(ctx, bson.M{"name": classData.Name}).Decode(&isClassExist)
	if err == nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Class already exists",
		})
	}

	// create class
	result, err := config.GetCollection("classes").InsertOne(ctx, classData)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	// Update the classData with inserted ID
	classData.ID = result.InsertedID.(primitive.ObjectID)

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Class created successfully",
		Data:    classData,
	})

}

// Update class
func UpdateClass(c echo.Context) error {
	classId := c.Param("id")

	classObjId, err := primitive.ObjectIDFromHex(classId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid class id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// find class
	var findClass models.Class
	err = config.GetCollection("classes").FindOne(ctx, bson.M{"_id": classObjId}).Decode(&findClass)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Class not found",
		})
	}

	// update class
	var classData models.Class
	if err := c.Bind(&classData); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	result, err := config.GetCollection("classes").UpdateOne(ctx, bson.M{"_id": classObjId}, bson.M{"$set": classData})
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Class updated successfully",
		Data:    result.ModifiedCount,
	})

}

// Delete class
func DeleteClass(c echo.Context) error {
	classId := c.Param("id")
	classObjId, err := primitive.ObjectIDFromHex(classId)

	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid class id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// find class
	var findClass models.Class
	err = config.GetCollection("classes").FindOne(ctx, bson.M{"_id": classObjId}).Decode(&findClass)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Class not found",
		})
	}

	// delete class
	_, err = config.GetCollection("classes").DeleteOne(ctx, bson.M{"_id": classObjId})
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, network.ShortResponse{
		Status:  http.StatusOK,
		Message: "Class deleted",
	})

}

// List class
func ListClass(c echo.Context) error {
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
				{"name": bson.M{"$regex": search, "$options": "i"}},
				{"description": bson.M{"$regex": search, "$options": "i"}},
			},
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.GetCollection("classes")

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

	var classes []bson.M
	if err := cursor.All(ctx, &classes); err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error while decoding classes",
		})
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Data retreived successfully",
		Data:    classes,
		Pagination: &network.Pagination{
			CurrentPage: page,
			TotalPage:   totalPages,
			TotalData:   int(totalCount),
		},
	})

}

func GetClassById(c echo.Context) error {
	classId := c.Param("id")
	classObjId, err := primitive.ObjectIDFromHex(classId)

	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid class id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// find class
	var findClass models.Class
	err = config.GetCollection("classes").FindOne(ctx, bson.M{"_id": classObjId}).Decode(&findClass)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Class not found",
		})
	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Data retreived successfully",
		Data:    findClass,
	})

}
