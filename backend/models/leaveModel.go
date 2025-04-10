package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type LeaveType string

const (
	MedicalLeave LeaveType = "medical"
	CasualLeave  LeaveType = "casual"
	SpecialLeave LeaveType = "special"
)

type LeaveDuration string

const (
	FullDay LeaveDuration = "full_day"
	HalfDay LeaveDuration = "half_day"
)

type LeaveStatus string

const (
	Pending  LeaveStatus = "pending"
	Approved LeaveStatus = "approved"
	Rejected LeaveStatus = "rejected"
)

type LeaveSummary struct {
	Student     primitive.ObjectID `json:"student" bson:"student"`
	TotalLeaves int                `json:"totalLeaves" bson:"totalLeaves"`
	LeavesTaken int                `json:"leavesTaken" bson:"leavesTaken"`
}

type Leave struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Type         LeaveType          `json:"type" bson:"type"`
	Duration     LeaveDuration      `json:"duration" bson:"duration"`
	NumberOfDays int                `json:"numberOfDays" bson:"numberOfDays"`
	Reason       string             `json:"reason,omitempty" bson:"reason,omitempty"`
	Status       LeaveStatus        `json:"status" bson:"status"`
	LeaveSummary LeaveSummary       `json:"leaveSummary" bson:"leaveSummary"`
}
