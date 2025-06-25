const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const item = { id: uuidv4(), ...body };
  const TableName = process.env.TABLE_NAME;

  await db.put({
    TableName: TableName,
    Item: item
  }).promise();

  response = {
    'status': 'success',
    'message': 'Recipe created successfully',
    'data': {
        'recipe': item
    }
  }

  return {
    statusCode: 201,
    body: JSON.stringify(response)
  };
};