List of Models Used
-----------------------------------------
1. UserModel
2. ProductModel
3. CartModel
4. CategoryModel
5. OrderModel
6. PaymentModel
7. DeliveryModel
8. AdminModel
10. NotificationModel

.........................................
User Model Fields:
*  name
*  email
*  password
*  phone
*  addresses
* created date

.........................................

Product Model Fields:
* name
* price
* category
* stock
* description
* image

.........................................

Category Model Fields:
* name

.........................................

Cart Model Fields:
* user
* products
* totalPrice

.........................................

Order Model Fields:
* user
* products
* totalPrice
* address
* status
* payment
* delivery

.........................................

Payment Model Fields:
* order
* amount
* method
* status
* transactionID

.........................................

Delivery Model Fields:
* order
* deliveryBoy
* status
* trackingUrl
* estimateDeliveryTime

