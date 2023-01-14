# API for CuisineConnoisseurs

API web server for a food rating web app built with Node.js. View the front-end and demo [here](https://github.com/kmatic/cuisine-connoisseurs-client)

Users can create accounts and rate restaurants they have been to recently. They can also interact with others in the community by following and interacting with their posts.

## Built with

- Node.js
- Express
- AWS S3 (storing profile pictures)
- MongoDB (storing post and user data)
- Passport.js (JWT for auth)

## Reflection

The back-end was relatively simple to implement as it only performs basic CRUD operations. My main area of focus here was to gain some knowledge with AWS s3 by using it to store images users uploaded on their profile. By generating urls for requested images in the s3 bucket, users are able to see the profile pictures of all the other users on the app. An issue I ran into was handling following/unfollowing client-side but moving this to server-side solved the issue easily. 

## Running Locally

### Prerequisites

This project requires Node.js.
* npm
```
npm install npm@latest -g
```
### Running the project

1. clone the repo

```
git clone https://github.com/kmatic/cuisine-connoisseurs-api
```

2. Navigate to folder and install npm packages

```
npm install
```

3. Populate .env variables

You will have to setup your own MongoDB cluster and AWS s3 bucket. Here are the key variables within the project:
I used this [tutorial](https://www.youtube.com/watch?v=eQAIojcArRY) for help with the s3 setup.

- MONGODB_URL
- SECRET_KEY (can be anything. salt for password auth)
- AWS_ACCESS_KEY_ID
- AWS_ACCESS_KEY_SECRET
- AWS_BUCKET_NAME
- AWS_BUCKET_REGION

4. Run the development server:

```
npm run devstart
```

Server will be hosted at htttp://localhost:5000 (see the client repo for instructions on how to host the client locally for full web app functionality)
