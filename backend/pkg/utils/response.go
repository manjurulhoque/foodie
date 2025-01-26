package utils

// ErrorDetail represents an individual error
type ErrorDetail struct {
	Message string `json:"message"`        // Error message
	Code    string `json:"code,omitempty"` // Error code (optional)
}

// GenericResponse is a flexible structure for API responses
type GenericResponse[T any] struct {
	Success    bool          `json:"success"`          // Indicates success or failure
	StatusCode int           `json:"status_code"`      // HTTP status code
	Message    string        `json:"message"`          // Summary message
	Data       T             `json:"data,omitempty"`   // Response data (if any)
	Errors     []ErrorDetail `json:"errors,omitempty"` // List of detailed errors (optional)
}
