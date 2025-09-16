package valueobject

import (
	"math/rand"
	"strconv"
	"time"
)

type UserCode string

func NewUserCode() UserCode {
	return generateUniqueNumber()
}

func (u UserCode) String() string {
	return string(u)
}

func generateUniqueNumber() UserCode {
	// Seed the random number generator with the current time
	rand.Seed(time.Now().UnixNano())

	// Generate a random permutation of numbers 0 to 9
	perm := rand.Perm(10)

	// Shuffle the permutation to get a random order
	rand.Shuffle(len(perm), func(i, j int) { perm[i], perm[j] = perm[j], perm[i] })

	// Concatenate the first 6 numbers from the shuffled permutation
	var number string
	for i := 0; i < 6; i++ {
		number += strconv.Itoa(perm[i])
	}

	return UserCode(number)
}
