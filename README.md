{
	"info": {
		"_postman_id": "902dce30-8cbb-486c-bf21-2710e1475700",
		"name": "E-commerce",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Customer",
			"item": [
				{
					"name": "Get customer details",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImJiIiwiZW1haWwiOiJiYkBnbWFpbC5jb20ifSwiaWF0IjoxNTk5MDQ3MTQ0fQ.uYFZPH0B-qGKRq2ztPmLehhPgws_EfnTdglk8SbB0bc",
								"type": "text"
							}
						],
						"url": {
							"raw": "http://localhost:4000/customers",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"customers"
							]
						}
					},
					"response": []
				},
				{
					"name": "Signup - customer",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"bb\",\n    \"email\": \"bb@gmail.com\",\n    \"password\": \"12345\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/customers",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"customers"
							]
						}
					},
					"response": []
				},
				{
					"name": "LOGIN",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"email\": \"aa@gmail.com\",\n    \"password\": \"12345\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/customers/login",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"customers",
								"login"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update Phone_no",
					"request": {
						"method": "PUT",
						"header": [
							{
								"key": "Authorization",
								"type": "text",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwNjI4MDA5fQ.bXr45MBagrZvR8jmvd98xP6DTVhrV8rVBRSFFjwU1LA"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"phone_no\": \"9999999989\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/customers/phoneNo",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"customers",
								"phoneNo"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update credit card no",
					"request": {
						"method": "PUT",
						"header": [
							{
								"key": "Authorization",
								"type": "text",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwNjA3MDU0fQ.gI8RRl-g7u4UUXn5ynNH5jBJCzVkGlcNMxhChVxg9f0"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"credit_card_no\": 444422229999\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/customers/creditCard",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"customers",
								"creditCard"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update address",
					"request": {
						"method": "PUT",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwNjI4MDA5fQ.bXr45MBagrZvR8jmvd98xP6DTVhrV8rVBRSFFjwU1LA",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"addr1\": \"K-336\",\n    \"addr2\": \"xyz\",\n    \"city\": \"Meerut\",\n    \"postal_code\": \"201011\",\n    \"country\": \"India\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/customers/address",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"customers",
								"address"
							]
						}
					},
					"response": []
				},
				{
					"name": "Logout",
					"request": {
						"method": "PUT",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MSwibmFtZSI6ImJiIiwiZW1haWwiOiJiYkBnbWFpbC5jb20ifSwiaWF0IjoxNjAwMjQ1ODQ0fQ.5SAw5ZcYAUw6S9R_UZKEZxjg5x6kGcTOQNNCCXzxH38",
								"type": "text"
							}
						],
						"url": {
							"raw": "http://localhost:4000/customers/logout",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"customers",
								"logout"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update customer info",
					"request": {
						"method": "PUT",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MSwibmFtZSI6ImJiIiwiZW1haWwiOiJiYkBnbWFpbC5jb20ifSwiaWF0IjoxNjAwMjQ1ODQ0fQ.5SAw5ZcYAUw6S9R_UZKEZxjg5x6kGcTOQNNCCXzxH38",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"addr1\": \"90, h-block\",\n    \"city\": \"Ghaziabad\",\n    \"postal_code\": \"211911\",\n    \"country\": \"India\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/customers",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"customers"
							]
						}
					},
					"response": []
				}
			],
			"protocolProfileBehavior": {}
		},
		{
			"name": "Categories",
			"item": [
				{
					"name": "Get all categories",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/categories",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"categories"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get categories by id",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/categories/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"categories",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get category of product",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/categories/inProduct/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"categories",
								"inProduct",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "Add category",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MSwibmFtZSI6ImIiLCJlbWFpbCI6ImJiQGdtYWlsLmNvbSJ9LCJpYXQiOjE2MDAyNjY0Njl9.RHiovoZnU1GfmEKkkkgtNKA3k3o-aGwORUs26Z3niZQ",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"\",\n    \"desc\": \"About laptop\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/categories",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"categories"
							]
						}
					},
					"response": []
				}
			],
			"protocolProfileBehavior": {}
		},
		{
			"name": "Products",
			"item": [
				{
					"name": "Get all products",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/products",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"products"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get product by id",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/products/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"products",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get products in the category by id",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/products/inCategory/2",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"products",
								"inCategory",
								"2"
							]
						}
					},
					"response": []
				},
				{
					"name": "Search product",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"name\": \"Re\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/products/search",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"products",
								"search"
							]
						}
					},
					"response": []
				},
				{
					"name": "Give review",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"rating\": 5,\n    \"review\": \"Good camera\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/products/products/1/reviews",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"products",
								"products",
								"1",
								"reviews"
							]
						}
					},
					"response": []
				},
				{
					"name": "See all reviews of a product",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/products/3/reviews",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"products",
								"3",
								"reviews"
							]
						}
					},
					"response": []
				},
				{
					"name": "Add products",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/products",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"products"
							]
						}
					},
					"response": []
				}
			],
			"protocolProfileBehavior": {}
		},
		{
			"name": "orders",
			"item": [
				{
					"name": "Give order from products (buy now)",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwMzczOTYxfQ.laL4NZZwJF7ouNsPSNYHqZFkEqJX9_irKeI962HWPYY",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"product_id\": 2,\n    \"quantity\": 2\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/orders//from_products",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"orders",
								"",
								"from_products"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get order by id",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/orders/2",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"orders",
								"2"
							]
						}
					},
					"response": []
				},
				{
					"name": "Get customer's orders",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwNjI4MDA5fQ.bXr45MBagrZvR8jmvd98xP6DTVhrV8rVBRSFFjwU1LA",
								"type": "text"
							}
						],
						"url": {
							"raw": "http://localhost:4000/orders/inCustomer",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"orders",
								"inCustomer"
							],
							"query": [
								{
									"key": "",
									"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwNDYyMDU4fQ.Lwly3vU1YciiIOd1FOki3bu8-VFrEnSwWHgAvqApXoo",
									"disabled": true
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "GIve order from cart ( Buy from cart )",
					"request": {
						"method": "POST",
						"header": [],
						"url": {
							"raw": "http://localhost:4000/orders//from_cart",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"orders",
								"",
								"from_cart"
							]
						}
					},
					"response": []
				}
			],
			"protocolProfileBehavior": {}
		},
		{
			"name": "shopping cart",
			"item": [
				{
					"name": "Add to cart",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwMjgzNjUxfQ.RH3q6HFiPLyvh7evmc8q6gwOOzc23w3-PdJCr5KbfzE",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"product_id\": 2,\n    \"quantity\": 1\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/shoppingcart/add",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"shoppingcart",
								"add"
							]
						}
					},
					"response": []
				},
				{
					"name": "GET products of cart",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwMjgzNjUxfQ.RH3q6HFiPLyvh7evmc8q6gwOOzc23w3-PdJCr5KbfzE",
								"type": "text"
							}
						],
						"url": {
							"raw": "http://localhost:4000/shoppingcart",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"shoppingcart"
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete a product from cart",
					"request": {
						"method": "DELETE",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwNDYyMDU4fQ.Lwly3vU1YciiIOd1FOki3bu8-VFrEnSwWHgAvqApXoo",
								"type": "text"
							}
						],
						"url": {
							"raw": "http://localhost:4000/shoppingcart/removeProduct/1",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"shoppingcart",
								"removeProduct",
								"1"
							]
						}
					},
					"response": []
				},
				{
					"name": "Empty cart",
					"request": {
						"method": "DELETE",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MSwibmFtZSI6ImIiLCJlbWFpbCI6ImJiQGdtYWlsLmNvbSJ9LCJpYXQiOjE2MDAyNjY0Njl9.RHiovoZnU1GfmEKkkkgtNKA3k3o-aGwORUs26Z3niZQ",
								"type": "text"
							}
						],
						"url": {
							"raw": "http://localhost:4000/shoppingcart/empty",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"shoppingcart",
								"empty"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update product in cart",
					"request": {
						"method": "PUT",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwMjgzNjUxfQ.RH3q6HFiPLyvh7evmc8q6gwOOzc23w3-PdJCr5KbfzE",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"quantity\": 3\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:4000/shoppingcart/update/3",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"shoppingcart",
								"update",
								"3"
							]
						}
					},
					"response": []
				},
				{
					"name": "GET - Cart's total amount ",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuZXdDdXN0b21lciI6eyJpZCI6MiwibmFtZSI6ImFhIiwiZW1haWwiOiJhYUBnbWFpbC5jb20ifSwiaWF0IjoxNjAwNDE3MjYyfQ.FjBCJCPnPokvmomFXLALOCVgYbMcmPYAVmxhhd4-ZDk",
								"type": "text"
							}
						],
						"url": {
							"raw": "http://localhost:4000/shoppingcart/totalAmount",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "4000",
							"path": [
								"shoppingcart",
								"totalAmount"
							]
						}
					},
					"response": []
				}
			],
			"protocolProfileBehavior": {}
		}
	],
	"protocolProfileBehavior": {}
}