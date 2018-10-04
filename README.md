# # Serverless-POC

Hi! I'm writing this for easy reference of **Serverless** project structure. This is as part of my learning serverless framework. 

## Get Started with new service (Serverless Project)
Create a new  **Project Folder** using the file explorer. Then we will create a new service using the Node.js template, specifying a unique name and an optional path for our service.

```sh
# Create a new Serverless Service/Project, for me it is -> Serverless-POC
$ serverless create --template aws-nodejs --path Serverless-POC 
# Change into the newly created directory
$ cd Serverless-POC
# Create services folder for keeping all the functions in it
$ mkdir services
```

##### Note 

  - We will create the the directory structure of our project as follows.
  - In the parent folder we will be having a **services** folder and our **serverless.yml** config file.
  - Here we don't need the handler.js file created by ```serverless create --template aws-nodejs``` command. 




## Project Structure

Our Project structure is going to be like this:

```
Serverless-POC
│   serverless.yml
│   package.json   
│   .gitignore
└───services\
   └───Create-User
   │    │   index.js
   │    │   Create-User.yml
   │    │   ...
   └───Get-Data
   │    │   index.js
   │    │   Get-Data.yml
   │    │   ...
   └───Put-Data
   │    │   index.js
   │    │   Put-Data.yml
   │    │   ...
   └───lambda-integration
        │  index.js
        │  lambda-integration.yml
        │   ...
```

To create each service I will use the following command.
```sh
# Create a new service
$ serverless create --template aws-nodejs --path Create-User 
# Create another new service
$ serverless create --template aws-nodejs --path Get-Data
# Create yet another new service
$ serverless create --template aws-nodejs --path Put-Data
# Create a service again
$ serverless create --template aws-nodejs --path lambda-integration
```
These commands will  create a folder of the following structure:
```
Service-Name
│   serverless.yml
│   handler.js   
│   .gitignore
```
I've changed the names of the files as per my convenience and better readability. My structure as follows:
```
Service-Name
│   Service-Name.yml
│   index.js   
│   .gitignore
```
### Description

Now we are done with the Project Structure. Next we need to wire things up. 

##### **```Serverless-POC/serverless.yml```**

```sh 

service: Serverless-POC    # NOTE: This is my service name(Here Project Name)

provider:
  name: aws
  runtime: nodejs8.10
  versionLambda: false     #not allowing the lambda versiong
  stage: dev               #Stage on which we want to deploy our code
  region: ap-south-1       #My aws api region
  apiName: Serverless-POC  #API name want it on aws
  
  #### Instead of writing the code for each service(function) directly here, we will modularize the code for better readability.
  functions:
  # Create-User:
  - ${file(./services/Create-User/Create-User.yml)} 
  # Get-Data:
  - ${file(./services/Get-Data/Get-Data.yml)}
  # Put-Data:
  - ${file(./services/Put-Data/Put-Data.yml)}
  # lambda-integration:
  - ${file(./services/lambda-integration/lambda-integration.yml)}
```

###### Whenever we will be adding a new service, we need to define it here, in the above file.
###### In the above specified structure, clean up the your-service-name.yml file, write your own service specific code which will replace the  ```${file(./services/lambda-integration/your-service-name.yml)}``` declaration with your yml code in the main ```serverless.yml``` file.


## Lambda Proxy

This is a simple yet important integration type. The API request hitting APIGateway is forwarded straight to Lambda function, here the lambda fungtion gets the data in the **event** object and it does some processing as we write our code the the response is sent directly from Lambda(without any intervention of API Gateway). The response headers, status codes etc are not added to the response body by API Gateway.

Example: ```services/Create-User```

##### **```Create-User.yml```**

```sh 
Create-User:
    handler: services/Create-User/handler.handler
    timeout: 30
    events:
      - http:
          path: Create-User/
          method: post
          request: 
          parameters: 
          paths: 
          id: false
          cors: true
```


##### **```index.js```**

```sh 
exports.handler = (event, context, callback) => {

  var responseBody = JSON.parse(event.body);
  var response = {
      "statusCode": 200,
      "headers": {
          "my_Sample_header": "value"
      },
      "body": JSON.stringify(responseBody),
      "isBase64Encoded": false
  };
  callback(null, response);
};

```
##### Request
Request from the UI is sent directly to lambda function with all the parameters passed in ***event*** object. As it is sent in lambda with mapping template to lambda. API Gateway does nothing in modification of data or structuring it.

##### Response
HTTP Status codes in the response messages like 200, 404 & 502 etc. needs to be sent by the lambda function. Example as follows.

## Lambda-Integration
This is also an easy setup, provides more control over the API Life-cycle. The request data(such as path-params, query-string params etc.) could be mapped before it is passed to lambda and also the response from lambda can be modified after data is returned from lambda. This could be performed by using mapping templates which maps the data from the request to lambda function and again from lambda function to the calling entity. 
Example: ```services/lambda-integration```


##### **```lambda-integration.yml```**
```sh

  lambda-integration:
    handler: services/lambda-integration/handler.handler
    timeout: 30
    events:
      - http:
          path: lambda-integration/
          method: POST
          integration: lambda # This differentiates the configuration of Lambda-Proxy from Lambda-Integration
          cors: 
            origin: '*'
            headers:
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token
              - X-Amz-User-Agent
              - my-custom-access-token  # This Allows my custom header through API Gateway else it may throw errors like not allowed through CORS 
            allowCredentials: false
          request: 
            passThrough: NEVER
            template:
              application/json: '{ "method": "$context.httpMethod", "body" : $input.json("$"), "headers": { #foreach($param in $input.params().header.keySet()) "$param": "$util.escapeJavaScript($input.params().header.get($param))" #if($foreach.hasNext),#end #end } }'

```
Request data and Response data can be re-structured while passing to lambda function and also while lambda returns data through API Gateway. HTTP Status Codes can be set by API Gateway. In the above file it can be configured.

##### **```index.js```**
```sh

exports.handler = (event, context, callback) => {

  var responseBody = {message:"some data in string form", event: event, context: context};

  callback(null, responseBody);
};

```

## Enabling CORS and Allowing specific Header
Code follows, where we will enable CORS and allow my-custom-access-token through Gateway:
```sh
lambda-integration:
    handler: your service handler
        timeout: 30 #some timeout
        events:
          - http:
              path: some-path/
              method: POST  #Any thing(GET,PUT,DELETE)
              integration: lambda
              # For Default CORS Configuration 
              cors:true
              # For Custom Configuration
              cors: 
                origin: '*'
                headers:
                  - Content-Type
                  - X-Amz-Date
                  - Authorization
                  - X-Api-Key
                  - X-Amz-Security-Token
                  - X-Amz-User-Agent
                  - my-custom-access-token  # This Allows my custom header through API Gateway else it may throw errors like not allowed through CORS 
                allowCredentials: false
```




## SQS Queues!

In the following example, we specify that the ```sqs-msg-receiver``` function should be triggered whenever there are messages in the given SQS Queue.:
  - ```sqs-msg-receiver``` lambda function will be triggered whenever we put a message on SQS Queue named ```SQS1```
  - We have already created the Queue on AWS with *```sqs:ReceiveMessage```* and *```sqs:SendMessage```* permissions.
  - The lambda function which puts message on the Queue named ```SQS1``` is ```sqs-msg-sender```.


#### example to put a message on SQS with minimal code.
#### ```sqs-msg-sender/handler.js```

```sh 
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = (event, context, callback) => {

  var responseBody = {message:"some data in string form", event: event, context: context};

  var params = {
      DelaySeconds: 0,
      MessageBody: JSON.stringify(responseBody),
      QueueUrl: process.env.sqsURL
  };

  sqs.sendMessage(params, function(err, data) {
      if (err) {
          console.log('error:' + err, null);
          var responseObj = new Object();
          responseObj.message = "SQS Error.";
          responseObj.error = err;
          callback(null, responseObj);
      }
      else {
          console.log('data:', data.MessageId);
          callback(null, data);
      }
  });
};
```
#### ```sqs-msg-sender/sqs-msg-sender.yml```

```sh 
  sqs-msg-sender:
    handler: services/sqs-msg-sender/handler.handler
    timeout: 30
    environment:
      ApiPrefix: ${self:custom.API}-${self:custom.stage}
      sqsURL: ${self:provider.environment.sqsURL}
    events:
      - http:
          path: sqs-msg-sender/
          method: POST
          integration: lambda
          cors: 
            origin: '*'
            headers:
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token
              - X-Amz-User-Agent
              - my-custom-access-token  # This Allows my custom header through API Gateway else it may throw errors like not allowed through CORS 
            allowCredentials: false
          request: 
            passThrough: NEVER
            template:
              application/json: '{ "method": "$context.httpMethod", "body" : $input.json("$"), "headers": { #foreach($param in $input.params().header.keySet()) "$param": "$util.escapeJavaScript($input.params().header.get($param))" #if($foreach.hasNext),#end #end } }'

```


#### Configuration associated with ```sqs-msg-receiver``` function to.
#### ```sqs-msg-receiver.yml```

```sh 
  sqs-msg-receiver:
    handler: services/sqs-msg-receiver/handler.handler
    timeout: 30
    environment:
      ApiPrefix: ${self:custom.API}-${self:custom.stage}
    events:
    - sqs:
        arn: ${self:provider.environment.sqsARN}
        batchSize: 10
```
> This configuration automatically attaches this function to the created SQS Queue as the function to be triggered.
#### ```handler.js```

```sh 
  exports.handler = (event, context, callback) => {

  var responseBody = {event: event, context: context};
  console.log("RESPONSE: ",JSON.stringify(responseBody));
  callback(null, "OK");
};

```
> The js code for this will be same as normal lambda function. 

#### Configuration to be done for creating SQS Queues right from your yml code.
#### ```serverless.yml```

Here, we have created one Queue named ```${self:custom.prefix}Queue``` which becomes ```Serverless-POC-alpha-Queue``` after compilation.
I have used references for referring to Queue in the form ```${self: .....}```.

Similarly, we can create DynamoDB tables right from your ```serverless.yml``` file.


**ENDS HERE - Thanks! For Reading.**
