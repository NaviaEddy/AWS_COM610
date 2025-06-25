const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {

    const TableName = process.env.TABLE_NAME;

    const result = await db.scan({
      TableName: TableName
    }).promise();

    const response = {
      status: 'success',
      message: 'Recipes retrieved successfully',
      data: {
        recipes: result.Items
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error("Error fetching recipes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        message: 'Failed to retrieve recipes'
      })
    };
  }
};
