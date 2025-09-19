Using the Postman Collection
This collection contains pre-configured requests for all endpoints in the Payment Processing API, making it easy to test and demonstrate functionality.

1. Import the Collection
   Open the Postman desktop application.

Click on File in the top menu, then select Import....

Drag and drop or select the Payment-API.postman_collection.json file from the root of this repository.

2. Configure Collection Variables
   The collection uses variables to make testing flexible. You only need to set these once.

In the Postman sidebar, click on the collection name ("Payment Processing API").

Select the Variables tab that appears in the main window.

You will see the following variables. Update their CURRENT VALUE:

baseUrl: Defaults to http://localhost:3000. You can leave this as is if your server is running locally on the default port.

adminApiKey: Set this to the value of ADMIN_API_KEY from your .env.development file (e.g., your-secret-admin-key).

transactionId: This is automatically captured by a test script. Do not edit this value manually.

3. Recommended Workflow
   Ensure your local API server is running (npm run dev).

Start by running the POST /transactions request. This will create a new transaction and automatically save its ID to the transactionId variable.

You can now run other requests like GET /transactions/:id or PUT /transactions/:id/status, which will use the captured ID to target the correct resource.
