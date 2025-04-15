package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTranslateError(t *testing.T) {
	type UserInput struct {
		Email string `json:"email" validate:"required,email"`
	}

	user := UserInput{
		Email: "",
	}

	errors := TranslateError(user)
	assert.Equal(t, errors, []IError{{Field: "email", Message: "Email is required"}})

	user.Email = "invalid-email"
	errors = TranslateError(user)
	assert.Equal(t, errors, []IError{{Field: "email", Message: "Email must be a valid email address"}})

	// test integer validation
	type IntegerInput struct {
		Age string `json:"age" validate:"required,integer"`
	}

	integer := IntegerInput{
		Age: "AA",
	}

	errors = TranslateError(integer)
	assert.Equal(t, []IError{{Field: "age", Message: "Age must be an integer"}}, errors)
}
