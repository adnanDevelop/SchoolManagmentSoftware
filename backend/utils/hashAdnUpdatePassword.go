package utils

import (
	"context"
	"school-software/config"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func HashAndUpdatePassword(userId primitive.ObjectID, newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = config.GetCollection("users").UpdateOne(ctx, bson.M{"_id": userId}, bson.M{
		"$set": bson.M{"password": string(hashedPassword)},
	})

	return err
}
