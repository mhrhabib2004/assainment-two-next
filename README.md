# Stationery Shop Application

## Description

A full-featured stationery shop application that allows users to manage products, place orders, and calculate total revenue from all orders. The application integrates MongoDB to manage the product and order data, using an Express backend with TypeScript to handle API requests and business logic.

## Features

- **Product Management**: Create, read, update, and delete stationery products.
- **Order Management**: Place orders for stationery items and automatically update the stock quantity.
- **Revenue Calculation**: Calculate total revenue by aggregating the order data.
- **Inventory Management**: Automatically reduce stock quantity and set `inStock` to `false` if the product goes out of stock.
- **Search & Filter**: Search for products by name, brand, or category.
- **Product Lookup**: Retrieve detailed information about a specific product.
- **Error Handling**: Handle common errors like insufficient stock or invalid product IDs.

## Technologies Used

- **Node.js**: JavaScript runtime environment for building server-side applications.
- **Express.js**: Web application framework for Node.js used to handle API requests.
- **MongoDB**: NoSQL database to store product and order information.
- **Mongoose**: ODM for MongoDB to interact with the database.
- **TypeScript**: Superset of JavaScript that provides type checking and advanced features.
- **JWT (JSON Web Tokens)**: For secure user authentication (if added in the future).
- **Aggregation Pipeline**: To calculate total revenue from all orders.

## Setup Instructions

### 1. Prerequisites

Ensure the following tools are installed:

- **Node.js**: Download and install from [here](https://nodejs.org/).
- **MongoDB**: Download and install MongoDB or use a cloud-based service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 2. Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/your-username/stationery-shop.git
cd stationery-shop
