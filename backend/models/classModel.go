package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Subject struct {
	ID   primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name string             `json:"name" bson:"name"`
}

type Period struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Class     primitive.ObjectID `json:"class" bson:"class"`
	Subject   primitive.ObjectID `json:"subject" bson:"subject"`
	Teacher   primitive.ObjectID `json:"teacher" bson:"teacher"`
	StartTime string             `json:"startTime" bson:"startTime"`
	EndTime   string             `json:"endTime" bson:"endTime"`
}

type Class struct {
	ID           primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Name         string               `json:"name" bson:"name"`
	Subjects     []primitive.ObjectID `json:"subjects" bson:"subjects"`
	ClassTeacher primitive.ObjectID   `json:"classTeacher" bson:"classTeacher"`
	ClassYear    string               `json:"classYear" bson:"classYear"`
}
