const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { id } = event.pathParameters || {};
  const TableName = process.env.TABLE_NAME;

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 'error',
        message: 'Invalid JSON in request body.'
      }),
    };
  }

  const { title, ingredents } = body;

  if (!title || !Array.isArray(ingredents)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 'error',
        message: 'Both "title" and "ingredents" (as array) are required.'
      }),
    };
  }

  try {
    await db.update({
      TableName: TableName,
      Key: { id },
      UpdateExpression: 'set #title = :title, #ingredents = :ingredents',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#ingredents': 'ingredents'
      },
      ExpressionAttributeValues: {
        ':title': title,
        ':ingredents': ingredents
      }
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'success',
        message: 'Recipe updated successfully',
        data: { id, title, ingredents }
      }),
    };

  } catch (error) {
    console.error("Update failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        message: 'Failed to update recipe'
      }),
    };
  }
};
