package utils

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateToken(id string) (string, error) {
	if len(os.Getenv("SECRET_KEY")) == 0 {
		log.Fatal("❌ SECRET_KEY environment variable is not set")
	}

	claims := jwt.MapClaims{
		"id":  id,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		return "", err
	}

	return tokenString, nil

}
