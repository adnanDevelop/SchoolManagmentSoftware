package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Subject struct {
	ID   primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

type Period struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Class     primitive.ObjectID `json:"class" bson:"class" validate:"required"`
	Subject   string             `json:"subject" bson:"subject" validate:"required"`
	Teacher   primitive.ObjectID `json:"teacher" bson:"teacher" validate:"required"`
	StartTime string             `json:"startTime" bson:"startTime" validate:"required"`
	EndTime   string             `json:"endTime" bson:"endTime" validate:"required"`
	Status    bool               `json:"status" bson:"status"`
}

type Class struct {
	ID        primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Name      string               `json:"name" bson:"name"`
	Subjects  []string             `json:"subjects" bson:"subjects" `
	ClassYear string               `json:"classYear" bson:"classYear"`
	Status    bool                 `json:"status" bson:"status"`
	Periods   []primitive.ObjectID `json:"periods" bson:"periods"`
}
