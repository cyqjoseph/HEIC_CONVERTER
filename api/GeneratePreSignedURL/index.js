const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  console.log("Received event:", event);

  // Check if queryStringParameters exists and has the filename parameter
  if (!event.queryStringParameters || !event.queryStringParameters.filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid filename parameter" }),
    };
  }

  const destinationBucket = "cyqjoseph-destination-bucket";
  const originalHeicFileName = event.queryStringParameters.filename;
  const pngFileName = originalHeicFileName.replace(".HEIC", ".png");

  const params = {
    Bucket: destinationBucket,
    Key: pngFileName,
    Expires: 300,
    ResponseContentDisposition: `attachment; filename="${pngFileName}"`, // Force download
  };

  try {
    // Check if the file exists in the destination bucket
    await s3
      .headObject({ Bucket: destinationBucket, Key: pngFileName })
      .promise();

    const url = s3.getSignedUrl("getObject", params);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ url }),
    };
  } catch (err) {
    console.error(err);

    // Determine the status code based on the error
    const statusCode = err.code === "NotFound" ? 404 : 500;

    return {
      statusCode: statusCode,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Error generating pre-signed URL",
        details: err.message,
      }),
    };
  }
};
