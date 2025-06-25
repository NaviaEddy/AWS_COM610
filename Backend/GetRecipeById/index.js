const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { id } = event.pathParameters;

  const result = await db.get({
    TableName: 'Recipes',
    Key: { id }
  }).promise();

  if (!result.Item) {
    response = {
        'status': 'error',
        'message': 'Recipe not found'
    }
    return { statusCode: 404, body: JSON.stringify(response) };
  }

  response = {
    'status': 'success',
    'message': 'Recipe retrieved successfully',
    'data': {
      'recipe': result.Item
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};