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

func CreatePeriod(c echo.Context) error {
	var periodData models.Period
	if err := c.Bind(&periodData); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// create period
	result, err := config.GetCollection("periods").InsertOne(ctx, periodData)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}
	periodID := result.InsertedID.(primitive.ObjectID)
	periodData.ID = periodID

	// find class and store period id
	var findClass models.Class
	err = config.GetCollection("classes").FindOne(ctx, bson.M{"_id": periodData.Class}).Decode(&findClass)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Class not found",
		})
	}

	findClass.Periods = append(findClass.Periods, periodID)
	_, err = config.GetCollection("classes").UpdateOne(ctx, bson.M{"_id": periodData.Class}, bson.M{"$set": bson.M{"periods": findClass.Periods}})
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Period created successfully",
		Data:    periodData,
	})

}

// Update Period
func UpdatePeriod(c echo.Context) error {
	periodId := c.Param("id")
	ObjectPerId, err := primitive.ObjectIDFromHex(periodId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid period id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// find period
	var findPeriod models.Period
	err = config.GetCollection("periods").FindOne(ctx, bson.M{"_id": ObjectPerId}).Decode(&findPeriod)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Period not found",
		})
	}

	// update period
	var perdioData models.Period
	if err := c.Bind(&perdioData); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	_, err = config.GetCollection("periods").UpdateOne(ctx, bson.M{"_id": ObjectPerId}, bson.M{"$set": perdioData})
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})

	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Period updated successfully",
		Data:    perdioData,
	})

}

// Delete Period
func DeletePeriod(c echo.Context) error {
	periodId := c.Param("id")
	objectPrId, err := primitive.ObjectIDFromHex(periodId)

	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid period id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// find period
	var findPeriod models.Period
	err = config.GetCollection("periods").FindOne(ctx, bson.M{"_id": objectPrId}).Decode(&findPeriod)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Period not found",
		})
	}

	// remove period id from class
	_, err = config.GetCollection("classes").UpdateOne(
		ctx,
		bson.M{"_id": findPeriod.Class},
		bson.M{"$pull": bson.M{"periods": objectPrId}},
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Failed to remove period ID from class",
		})
	}

	// delete period
	_, err = config.GetCollection("periods").DeleteOne(ctx, bson.M{"_id": objectPrId})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Failed to delete period",
		})
	}

	return c.JSON(http.StatusOK, network.ShortResponse{
		Status:  http.StatusOK,
		Message: "Period deleted successfully",
	})
}

// List period
func ListPeriod(c echo.Context) error {
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
				{"subject": bson.M{"$regex": search, "$options": "i"}},
			},
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := config.GetCollection("periods")

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

	var periods []bson.M
	if err := cursor.All(ctx, &periods); err != nil {
		return c.JSON(http.StatusInternalServerError, network.BadResponse{
			Status:  http.StatusInternalServerError,
			Message: "Error while decoding periods",
		})
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Data retreived successfully",
		Data:    periods,
		Pagination: &network.Pagination{
			CurrentPage: page,
			TotalPage:   totalPages,
			TotalData:   int(totalCount),
		},
	})

}

// Get Period By Id
func GetPeriodById(c echo.Context) error {
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
