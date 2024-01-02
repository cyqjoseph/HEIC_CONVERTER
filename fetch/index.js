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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error generating pre-signed URL" }),
    };
  }
};
