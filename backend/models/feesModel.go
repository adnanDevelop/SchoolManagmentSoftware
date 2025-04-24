package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FeeType string

const (
	FeeTypeAdmission FeeType = "admission"
	FeeTypeMonthly   FeeType = "monthly"
)

type FeeStatus string

const (
	FeeStatusPaid    FeeStatus = "paid"
	FeeStatusPending FeeStatus = "pending"
)

type Fee struct {
	ID       primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Student  primitive.ObjectID `json:"student" bson:"student"`
	FeeType  FeeType            `json:"feeType" bson:"feeType"`
	FeeMonth string             `json:"feeMonth" bson:"feeMonth"`
	Amount   int                `json:"amount" bson:"amount"`
	Status   FeeStatus          `json:"status" bson:"status"`
	Discount float64            `json:"discount" bson:"discount"`
	DatePaid *time.Time         `json:"datePaid,omitempty" bson:"datePaid,omitempty"`
}
