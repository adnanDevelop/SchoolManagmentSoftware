package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRole string

const (
	Admin   UserRole = "admin"
	Student UserRole = "student"
	Teacher UserRole = "teacher"
	staff   UserRole = "staff"
)

type Gender string

const (
	Male   Gender = "male"
	Female Gender = "female"
)

type BankDetails struct {
	Name        string `json:"name" bson:"name"`
	AccountNo   string `json:"accountNo" bson:"accountNo"`
	PaymentName string `json:"paymentName" bson:"paymentName"`
}

type ParentContact struct {
	Name           string `json:"name" bson:"name"`
	Email          string `json:"email" bson:"email"`
	Number         string `json:"number" bson:"number"`
	ProfilePicture string `json:"profilePicture" bson:"profilePicture"`
}

type ParentDetails struct {
	Father ParentContact `json:"father" bson:"father"`
	Mother ParentContact `json:"mother" bson:"mother"`
}

type User struct {
	ID             string               `json:"id" bson:"_id,omitempty"`
	Name           string               `json:"name" bson:"name" validate:"required"`
	Email          string               `json:"email" bson:"email" validate:"required"`
	Password       string               `json:"password" bson:"password" validate:"required"`
	Gender         Gender               `json:"gender" bson:"gender" validate:"required,oneof=male female other"`
	Role           UserRole             `json:"role" bson:"role,omitempty"`
	Status         bool                 `json:"status" bson:"status,omitempty"`
	ProfilePicture string               `json:"profilePicture" bson:"profilePicture"`
	AdmissionDate  string               `json:"admissionDate" bson:"admissionDate,omitempty"`
	RoleNumber     int                  `json:"roleNumber" bson:"roleNumber,omitempty"`
	Number         string               `json:"number" bson:"number,omitempty"`
	ParentDetails  *ParentDetails       `json:"parentDetails,omitempty" bson:"parentDetails,omitempty"`
	Address        string               `json:"address" bson:"address,omitempty"`
	BankDetails    *BankDetails         `json:"bankDetails,omitempty" bson:"bankDetails,omitempty"`
	Description    string               `json:"description" bson:"description,omitempty"`
	Siblings       []primitive.ObjectID `json:"siblings" bson:"siblings,omitempty"`
	Class          primitive.ObjectID   `json:"class" bson:"class,omitempty"`
	Subjects       []string             `json:"subjects,omitempty" bson:"subjects,omitempty"`

	// Teacher fields
	TeachingExperience   int    `json:"teachingExperience,omitempty" bson:"teachingExperience,omitempty"`
	TeacherQualification string `json:"teacherQualification,omitempty" bson:"teacherQualification,omitempty"`
	Salary               int    `json:"salary,omitempty" bson:"salary,omitempty"`
	ContractType         string `json:"contractType,omitempty" bson:"contractType,omitempty"`

	// For staff role
	Department    string    `json:"department,omitempty" bson:"department,omitempty"`
	JobTitle      string    `json:"jobTitle,omitempty" bson:"jobTitle,omitempty"`
	AssignedTasks []string  `json:"assignedTasks,omitempty" bson:"assignedTasks,omitempty"`
	CreatedAt     time.Time `json:"created_at" bson:"createdAt"`
	UpdatedAt     time.Time `json:"updated_at" bson:"updatedAt"`
}

type SiblingInfo struct {
	ID    primitive.ObjectID `json:"id" bson:"_id"`
	Name  string             `json:"name" bson:"name"`
	Role  UserRole           `json:"role" bson:"role"`
	Class primitive.ObjectID `json:"class" bson:"class"`
}
