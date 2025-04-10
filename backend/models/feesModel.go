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
	FeeStatusUnpaid  FeeStatus = "unpaid"
	FeeStatusPending FeeStatus = "pending"
)

type PaymentMode string

const (
	PaymentModeCash         PaymentMode = "cash"
	PaymentModeBankTransfer PaymentMode = "bank_transfer"
	PaymentModeEasypaisa    PaymentMode = "easypaisa"
	PaymentModeJazzCash     PaymentMode = "jazzcash"
)

type Fee struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Student   primitive.ObjectID `json:"student" bson:"student"`
	FeeType   FeeType            `json:"feeType" bson:"feeType"`
	DueDate   time.Time          `json:"dueDate" bson:"dueDate"`
	Amount    float64            `json:"amount" bson:"amount"`
	Status    FeeStatus          `json:"status" bson:"status"`
	Mode      PaymentMode        `json:"mode" bson:"mode"`
	DatePaid  *time.Time         `json:"datePaid,omitempty" bson:"datePaid,omitempty"`
	Discount  float64            `json:"discount" bson:"discount"`
	Fine      float64            `json:"fine" bson:"fine"`
	TotalPaid float64            `json:"totalPaid" bson:"totalPaid"`
}
