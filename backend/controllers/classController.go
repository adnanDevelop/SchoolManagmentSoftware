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
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "periods"},
			{Key: "localField", Value: "periods"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "periods"},
		}}},
		{{Key: "$unwind", Value: bson.D{
			{Key: "path", Value: "$periods"},
			{Key: "preserveNullAndEmptyArrays", Value: true},
		}}},
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "users"},
			{Key: "localField", Value: "periods.teacher"},
			{Key: "foreignField", Value: "_id"},
			{Key: "as", Value: "periods.teacher"},
		}}},
		{{Key: "$unwind", Value: bson.D{
			{Key: "path", Value: "$periods.teacher"},
			{Key: "preserveNullAndEmptyArrays", Value: true},
		}}},
		{{Key: "$group", Value: bson.D{
			{Key: "_id", Value: "$_id"},
			{Key: "name", Value: bson.D{{Key: "$first", Value: "$name"}}},
			{Key: "subjects", Value: bson.D{{Key: "$first", Value: "$subjects"}}},
			{Key: "classYear", Value: bson.D{{Key: "$first", Value: "$classYear"}}},
			{Key: "status", Value: bson.D{{Key: "$first", Value: "$status"}}},
			{Key: "periods", Value: bson.D{{Key: "$push", Value: "$periods"}}},
		}}},
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

	type TeacherInfo struct {
		Name           string `json:"name"`
		Email          string `json:"email"`
		ProfilePicture string `json:"profilePicture"`
	}

	type PeriodFields struct {
		Teacher   TeacherInfo `json:"teacher"`
		StartTime string      `json:"startTime"`
		EndTime   string      `json:"endTime"`
		Status    string      `json:"status"`
		Subject   string      `json:"subject"`
	}

	for _, class := range classes {
		if rawPeriods, ok := class["periods"].(primitive.A); ok {
			var filtered []PeriodFields
			for _, p := range rawPeriods {
				if pDoc, ok := p.(bson.M); ok {
					teacher := TeacherInfo{}
					if teacherDoc, ok := pDoc["teacher"].(bson.M); ok {
						teacher = TeacherInfo{
							Name:           fmt.Sprintf("%v", teacherDoc["name"]),
							Email:          fmt.Sprintf("%v", teacherDoc["email"]),
							ProfilePicture: fmt.Sprintf("%v", teacherDoc["profilePicture"]),
						}
					}
					filtered = append(filtered, PeriodFields{
						Teacher:   teacher,
						StartTime: fmt.Sprintf("%v", pDoc["startTime"]),
						EndTime:   fmt.Sprintf("%v", pDoc["endTime"]),
						Status:    fmt.Sprintf("%v", pDoc["status"]),
						Subject:   fmt.Sprintf("%v", pDoc["subject"]),
					})
				}
			}
			class["periods"] = filtered
		}
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

// Get class by id
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

	var findClass bson.M
	err = config.GetCollection("classes").FindOne(ctx, bson.M{"_id": classObjId}).Decode(&findClass)
	if err != nil {
		return c.JSON(http.StatusBadRequest, network.BadResponse{
			Status:  http.StatusBadRequest,
			Message: "Class not found",
		})
	}

	if periodIDs, ok := findClass["periods"].(primitive.A); ok && len(periodIDs) > 0 {
		periodFilter := bson.M{"_id": bson.M{"$in": periodIDs}}
		cursor, err := config.GetCollection("periods").Find(ctx, periodFilter)
		if err == nil {
			var rawPeriods []bson.M
			if err = cursor.All(ctx, &rawPeriods); err == nil {

				// Collect teacher IDs
				var teacherIDs []primitive.ObjectID
				for _, p := range rawPeriods {
					if tid, ok := p["teacher"].(primitive.ObjectID); ok {
						teacherIDs = append(teacherIDs, tid)
					}
				}

				// Fetch teacher details
				teacherMap := map[primitive.ObjectID]bson.M{}
				if len(teacherIDs) > 0 {
					teacherCursor, err := config.GetCollection("users").Find(ctx, bson.M{"_id": bson.M{"$in": teacherIDs}})
					if err == nil {
						var teachers []bson.M
						if err := teacherCursor.All(ctx, &teachers); err == nil {
							for _, t := range teachers {
								if id, ok := t["_id"].(primitive.ObjectID); ok {
									teacherMap[id] = bson.M{
										"name":           t["name"],
										"email":          t["email"],
										"profilePicture": t["profilePicture"],
									}
								}
							}
						}
					}
				}

				type TeacherInfo struct {
					Name           string `json:"name"`
					Email          string `json:"email"`
					ProfilePicture string `json:"profilePicture"`
				}

				type PeriodFields struct {
					Teacher   TeacherInfo `json:"teacher"`
					StartTime string      `json:"startTime"`
					EndTime   string      `json:"endTime"`
					Status    string      `json:"status"`
					Subject   string      `json:"subject"`
				}

				var filterPeriods []PeriodFields
				for _, s := range rawPeriods {
					tid, _ := s["teacher"].(primitive.ObjectID)
					teacher := TeacherInfo{}
					if tDoc, ok := teacherMap[tid]; ok {
						teacher = TeacherInfo{
							Name:           fmt.Sprintf("%v", tDoc["name"]),
							Email:          fmt.Sprintf("%v", tDoc["email"]),
							ProfilePicture: fmt.Sprintf("%v", tDoc["profilePicture"]),
						}
					}

					filterPeriods = append(filterPeriods, PeriodFields{
						Teacher:   teacher,
						StartTime: fmt.Sprintf("%v", s["startTime"]),
						EndTime:   fmt.Sprintf("%v", s["endTime"]),
						Status:    fmt.Sprintf("%v", s["status"]),
						Subject:   fmt.Sprintf("%v", s["subject"]),
					})
				}

				findClass["periods"] = filterPeriods
			}
		}
	}

	return c.JSON(http.StatusOK, network.Response{
		Status:  http.StatusOK,
		Message: "Data retreived successfully",
		Data:    findClass,
	})
}
