# vef2-2022-h1

login 
curl --location --request POST 'http://localhost:7777/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"admin",
    "password":"123"
}'

or 

curl --location --request POST 'http://localhost:7777/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"bja23@hi.is",
    "password":"123"
}'

cart
curl --location --request POST 'http://localhost:7777/cart' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "titill30"
}'

curl --location --request DELETE 'http://localhost:7777/cart/ID FROM BEFORE!!!!!!!' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ3MzQ0MjU5LCJleHAiOjE2NDczNjQyNTl9.rNJrVsvcDRZhpyouhd3eDK6kYeLEQ9vjMIsLAshwDDc' \
--data-raw ''



order
curl --location --request POST 'http://localhost:7777/orders' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ3MzQ0MjU5LCJleHAiOjE2NDczNjQyNTl9.rNJrVsvcDRZhpyouhd3eDK6kYeLEQ9vjMIsLAshwDDc' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name":"nafn3"
}'

curl --location --request POST 'http://localhost:7777/orders/1/status' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ3MzQ0MjU5LCJleHAiOjE2NDczNjQyNTl9.rNJrVsvcDRZhpyouhd3eDK6kYeLEQ9vjMIsLAshwDDc' \
--header 'Content-Type: application/json' \
--data-raw '{
    "id":"SET THE ID FROM THE COMMAND BEFORE!!!!!"
}'