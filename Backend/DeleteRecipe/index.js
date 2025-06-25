const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { id } = event.pathParameters;

  await db.delete({
    TableName: 'Recipes',
    Key: { id_recipe: id }
  }).promise();

  response = {
    'status': 'success',
    'message': 'Recipe deleted successfully.'
  }

  return { statusCode: 200, body: JSON.stringify(response)};
};