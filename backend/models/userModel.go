package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type UserRole string

const (
	Admin   UserRole = "admin"
	Student UserRole = "student"
	Teacher UserRole = "teacher"
	Parent  UserRole = "parent"
)

type BankDetails struct {
	Name        string `json:"name" bson:"name"`
	AccountNo   string `json:"accountNo" bson:"accountNo"`
	PaymentName string `json:"paymentName" bson:"paymentName"`
}

type ParentContact struct {
	Name   string `json:"name" bson:"name"`
	Email  string `json:"email" bson:"email"`
	Number string `json:"number" bson:"number"`
}

type ParentDetails struct {
	Father ParentContact `json:"father" bson:"father"`
	Mother ParentContact `json:"mother" bson:"mother"`
}

type User struct {
	ID             primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Name           string               `json:"name" bson:"name" validate:"required"`
	Email          string               `json:"email" bson:"email" validate:"required"`
	Password       string               `json:"password" bson:"password" validate:"required"`
	Role           UserRole             `json:"role" bson:"role" validate:"required"`
	Status         bool                 `json:"status" bson:"status"`
	ProfilePicture string               `json:"profilePicture" bson:"profilePicture"`
	AdmissionDate  string               `json:"admissionDate" bson:"admissionDate"`
	RoleNumber     int                  `json:"roleNumber" bson:"roleNumber"`
	Number         string               `json:"number" bson:"number"`
	ParentDetails  ParentDetails        `json:"parentDetails" bson:"parentDetails"`
	Address        string               `json:"address" bson:"address"`
	BankDetails    BankDetails          `json:"bankDetails" bson:"bankDetails"`
	Description    string               `json:"description" bson:"description"`
	Siblings       []primitive.ObjectID `json:"siblings" bson:"siblings"`
	Class          primitive.ObjectID   `json:"class" bson:"class"`
}

type SiblingInfo struct {
	ID    primitive.ObjectID `json:"id" bson:"_id"`
	Name  string             `json:"name" bson:"name"`
	Role  UserRole           `json:"role" bson:"role"`
	Class primitive.ObjectID `json:"class" bson:"class"`
}
