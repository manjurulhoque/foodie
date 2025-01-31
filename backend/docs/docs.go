// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@swagger.io"
        },
        "license": {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/categories": {
            "get": {
                "description": "Get all categories",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "categories"
                ],
                "summary": "Get all categories",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            }
        },
        "/categories/{id}": {
            "get": {
                "description": "Get a category by ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "categories"
                ],
                "summary": "Get a category by ID",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            },
            "put": {
                "description": "Update a category",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "categories"
                ],
                "summary": "Update a category",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            },
            "delete": {
                "description": "Delete a category",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "categories"
                ],
                "summary": "Delete a category",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            }
        },
        "/login": {
            "post": {
                "description": "Login a user",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "user"
                ],
                "summary": "Login a user",
                "parameters": [
                    {
                        "description": "User object",
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                }
            }
        },
        "/me": {
            "get": {
                "description": "Get the current user",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "user"
                ],
                "summary": "Get the current user",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                }
            }
        },
        "/menu": {
            "get": {
                "description": "Get all menu items",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menu"
                ],
                "summary": "Get all menu items",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            },
            "post": {
                "description": "Create a menu item",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menu"
                ],
                "summary": "Create a menu item",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            }
        },
        "/menu/:id": {
            "get": {
                "description": "Get a menu item",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menu"
                ],
                "summary": "Get a menu item",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            },
            "put": {
                "description": "Update a menu item",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menu"
                ],
                "summary": "Update a menu item",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            }
        },
        "/register": {
            "post": {
                "description": "Register a new user",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "user"
                ],
                "summary": "Register a new user",
                "parameters": [
                    {
                        "description": "User object",
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                }
            }
        },
        "/restaurants": {
            "get": {
                "description": "Get all restaurants",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurants"
                ],
                "summary": "Get all restaurants",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Restaurant"
                            }
                        }
                    }
                }
            },
            "post": {
                "description": "Create a restaurant",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurants"
                ],
                "summary": "Create a restaurant",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Restaurant"
                        }
                    }
                }
            }
        },
        "/restaurants/:id": {
            "get": {
                "description": "Get a restaurant",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurants"
                ],
                "summary": "Get a restaurant",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Restaurant"
                        }
                    }
                }
            },
            "put": {
                "description": "Update a restaurant",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurants"
                ],
                "summary": "Update a restaurant",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Restaurant"
                        }
                    }
                }
            },
            "delete": {
                "description": "Delete a restaurant",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "restaurants"
                ],
                "summary": "Delete a restaurant",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.Restaurant"
                        }
                    }
                }
            }
        },
        "/restaurants/:id/menu": {
            "get": {
                "description": "Get all menu items of a restaurant",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "menu"
                ],
                "summary": "Get all menu items of a restaurant",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {}
                    }
                }
            }
        }
    },
    "definitions": {
        "models.Address": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "deleted_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "id": {
                    "type": "integer",
                    "example": 1
                },
                "is_default": {
                    "type": "boolean"
                },
                "label": {
                    "description": "e.g., \"Home\", \"Work\"",
                    "type": "string"
                },
                "postal_code": {
                    "type": "string"
                },
                "state": {
                    "type": "string"
                },
                "street": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "user_id": {
                    "type": "integer"
                }
            }
        },
        "models.MenuItem": {
            "type": "object",
            "required": [
                "category",
                "name",
                "price"
            ],
            "properties": {
                "category": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "deleted_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "description": {
                    "type": "string"
                },
                "id": {
                    "type": "integer",
                    "example": 1
                },
                "image": {
                    "type": "string"
                },
                "is_available": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string"
                },
                "price": {
                    "type": "number"
                },
                "restaurant_id": {
                    "type": "integer"
                },
                "updated_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                }
            }
        },
        "models.Restaurant": {
            "type": "object",
            "required": [
                "address",
                "email",
                "name",
                "phone"
            ],
            "properties": {
                "address": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "cuisine": {
                    "type": "string"
                },
                "deleted_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "description": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "integer",
                    "example": 1
                },
                "image": {
                    "type": "string"
                },
                "is_active": {
                    "type": "boolean"
                },
                "menu_items": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.MenuItem"
                    }
                },
                "name": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                },
                "rating": {
                    "type": "number"
                },
                "updated_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "user": {
                    "$ref": "#/definitions/models.User"
                },
                "user_id": {
                    "type": "integer"
                }
            }
        },
        "models.User": {
            "type": "object",
            "properties": {
                "created_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "deleted_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                },
                "delivery_addresses": {
                    "description": "New fields for multi-restaurant functionality",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.Address"
                    }
                },
                "email": {
                    "type": "string"
                },
                "id": {
                    "type": "integer",
                    "example": 1
                },
                "image": {
                    "type": "string"
                },
                "is_active": {
                    "type": "boolean"
                },
                "is_email_verified": {
                    "type": "boolean"
                },
                "last_login_at": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                },
                "role": {
                    "type": "string"
                },
                "updated_at": {
                    "type": "string",
                    "example": "2024-01-29T17:57:19Z"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:9000",
	BasePath:         "/api",
	Schemes:          []string{"http"},
	Title:            "Foodie API",
	Description:      "This is a sample server.",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
