const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  let response;
  try {
    const base64String = event.body;
    const buffer = Buffer.from(base64String, "base64");
    let fileName = "";

    if (event.headers["Content-Disposition"]) {
      const contentDisposition = event.headers["Content-Disposition"];
      const match = contentDisposition.match(/filename="?(.+?)"?(\s|$)/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    const params = {
      Bucket: "cyqjoseph-source-bucket",
      Key: fileName,
      Body: buffer,
    };

    await s3.putObject(params).promise();

    response = {
      statusCode: 200,
      body: JSON.stringify("File uploaded successfully"),
    };
  } catch (error) {
    console.error(error);
    response = {
      statusCode: 500,
      body: JSON.stringify("Error uploading file"),
    };
  }

  return response;
};
