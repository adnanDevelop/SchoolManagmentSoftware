package controllers

import (
	"context"
	"fmt"
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

func CreateFee(c echo.Context) error {
	feeData := models.Fee{}
	if err := c.Bind(&feeData); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// If fee is already paid
	if feeData.Status == "paid" {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Student fee is already paid",
		})
	}

	// create fee
	result, err := config.GetCollection("fees").InsertOne(ctx, feeData)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	feeData.ID = result.InsertedID.(primitive.ObjectID)
	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Fee created successfully",
		Data:    feeData,
	})

}

// Delete Fee
func DeleteFee(c echo.Context) error {
	feeId := c.Param("id")
	objectFeeId, err := primitive.ObjectIDFromHex(feeId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid fee id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// find fee
	var findFee models.Fee
	err = config.GetCollection("fees").FindOne(ctx, bson.M{"_id": objectFeeId}).Decode(&findFee)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Fee not found",
		})
	}

	// delete fee
	_, err = config.GetCollection("fees").DeleteOne(ctx, bson.M{"_id": objectFeeId})
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Fee deleted successfully",
		Data:    findFee,
	})

}

// Update Fee
func UpdateFee(c echo.Context) error {
	feeId := c.Param("id")
	feeObjId, err := primitive.ObjectIDFromHex(feeId)

	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Invalid fee id",
		})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// find fee
	var findFee models.Fee
	err = config.GetCollection("fees").FindOne(ctx, bson.M{"_id": feeObjId}).Decode(&findFee)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Fee not found",
		})
	}

	// update fee
	var feeData models.Fee
	if err := c.Bind(&feeData); err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	result, err := config.GetCollection("fees").UpdateOne(ctx, bson.M{"_id": feeObjId}, bson.M{"$set": feeData})
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: err.Error(),
		})

	}

	if result.ModifiedCount == 0 {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Fee not updated",
		})
	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Fee updated successfully",
		Data:    feeData,
	})
}

// List Fees
func ListFee(c echo.Context) error {
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
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "class"},
			{Key: "localField", Value: "class"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "class"},
		}}},
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "users"},
			{Key: "localField", Value: "siblings"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "siblings"},
		}}},
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
