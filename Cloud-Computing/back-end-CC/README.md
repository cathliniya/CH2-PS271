This is a JavaScript code built using Node.js, so make sure you have Node.js installed on your system.
This service is using MySQL as the database, so you also have to run MySQL on your system.

Clone the repository then open it using your code editor.
Supposedly you have done the steps from the predict-api, you can continue these steps. If not, check the predict-api and finish the steps there first (otherwise you can't complete these steps).
In the root directory of this project, make a new file named .env to provide the configurations needed.
Provide these details in the .env file:

# Fill "" with the url of the predict api ex: http://localhost:5000
API_PREDICT_HOST=""
# Fill "" with your database username ex: root
DB_USERNAME=""
# Fill "" with your database password
DB_PASSWORD=""
# Fill "" with your database host name ex: localhost
DB_HOSTNAME=""
# This is the database name, no need to change it
DB_NAME="dbhandspeak"
# Fill "" with the bucket name you created in the previous step
GCS_BUCKET=""
# Fill "" with the project_id value from the capstone-project-credentials.json file
GCLOUD_PROJECT=""
# Fill "" with the client_email value from the capstone-project-credentials.json file
GCLOUD_CLIENT_EMAIL=""
# Fill "" with the private_key value from the capstone-project-credentials.json file
GCLOUD_PRIVATE_KEY=""
# Add whitelisted IP address for CORS ex: http://localhost;http://localhost:3000 (Use semicolon to separate)
WHITELISTED=""
