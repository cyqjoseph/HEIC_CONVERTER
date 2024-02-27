const AWS = require("aws-sdk");
const S3 = new AWS.S3();
const convert = require("heic-convert");

const destinationBucket = "cyqjoseph-destination-bucket";

exports.handler = async (event) => {
  // Get the source bucket and object key from the event
  const sourceBucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  try {
    // Get the HEIC file from the source S3 bucket
    const inputBuffer = (
      await S3.getObject({ Bucket: sourceBucket, Key: key }).promise()
    ).Body;

    // Convert the file to PNG
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: "PNG",
    });

    // Key for the new PNG file
    const targetKey = key.replace(/\.[^/.]+$/, "") + ".png";

    // Upload the PNG file to the destination S3 bucket
    await S3.putObject({
      Bucket: destinationBucket,
      Key: targetKey,
      Body: outputBuffer,
      ContentType: "image/png",
    }).promise();

    return `File converted and uploaded successfully: ${targetKey}`;
  } catch (error) {
    console.error(error);
    throw new Error(`Error converting file: ${error.message}`);
  }
};
