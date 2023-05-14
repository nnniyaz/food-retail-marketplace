package env

import (
	"fmt"
	"os"
	"strings"
)

func GetEnv(key string) (string, error) {
	value, exists := os.LookupEnv(key)
	if !exists {
		return "", fmt.Errorf("env variable %s is not found", key)
	}
	// remove quotes that were read from Makefile
	value = strings.Trim(value, "\"")
	return value, nil
}

func MustGetEnv(key string) string {
	v, err := GetEnv(key)
	if err != nil {
		panic(err)
	}
	return v
}
