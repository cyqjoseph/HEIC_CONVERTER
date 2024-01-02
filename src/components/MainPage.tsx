import { useState } from "react";
import AWS from "aws-sdk";

function MainPage() {
  const [heicFile, setHeicFile] = useState<File | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setHeicFile(event.target.files[0]);
    }
  };

  const uploadFile = async function () {
    if (!heicFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const apiGatewayUrl =
        "https://uhki8nawxb.execute-api.ap-southeast-1.amazonaws.com/beta";

      const bucketName = "cyqjoseph-source-bucket";
      const filename = encodeURIComponent(heicFile.name);

      const fullUrl = `${apiGatewayUrl}/${bucketName}/${filename}`;
      // const response = await fetch(fullUrl);
      //   const data = await response.json();
      // if (!response.ok) {
      //   throw new Error("Failed to fetch presigned url");
      // }

      console.log(heicFile);
      const uploadResponse = await fetch(fullUrl, {
        method: "PUT",
        body: heicFile,
        headers: {
          "Content-Type": "image/heic",
        },
      });

      if (uploadResponse.ok) {
        alert("File uploaded successfully.");
      } else {
        console.log("Upload response:", uploadResponse);
        throw new Error("File upload failed.");
      }
    } catch (err) {
      console.error("Error during file upload:", err);
      alert("File upload failed.");
    }
    fetchFile();
  };

  const fetchFile = async function () {
    if (!heicFile) {
      alert("Please select a file first.");
      return;
    }
    // temp using retryInterval
    const maxRetries = 10;
    const retryInterval = 3000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const apiGatewayUrl =
          "https://uhki8nawxb.execute-api.ap-southeast-1.amazonaws.com/beta/HEICFetch";
        const filename = encodeURIComponent(heicFile.name);

        const response = await fetch(`${apiGatewayUrl}?filename=${filename}`);
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          await new Promise((resolve) => setTimeout(resolve, 5000));
          setPngUrl(data.url);
          return;
        }
        // monkey fix
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      } catch (err) {
        console.error("Error during file fetch:", err);
        alert("Failed to fetch the file.");
      }
    }
    alert("Failed to fetch the file.");
  };

  const downloadPng = () => {
    if (!pngUrl) return;
    // Create an anchor tag and trigger download
    const link = document.createElement("a");
    link.href = pngUrl;
    if (heicFile) {
      link.download = heicFile.name.replace(".HEIC", ".png");
    }
    link.download = heicFile
      ? heicFile.name.replace(".HEIC", ".png")
      : "download.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div>
        <input type="file" accept="image/heic" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
        {/* <button onClick={fetchFile}>Fetch Converted File</button> */}
        {pngUrl && <button onClick={downloadPng}>Download PNG File</button>}
      </div>
    </div>
  );
}

export default MainPage;

// const uploadFile = async function () {
//     const formData = new FormData();
//     // const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
//     const S3_BUCKET = "cyqjoseph-source-bucket";
//     const region = "ap-southeast-1";

//     AWS.config.update({
//       // accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
//       // secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
//     });

//     const s3 = new AWS.S3({
//       params: { Bucket: S3_BUCKET },
//       region: region,
//     });

//     const params = {
//       Bucket: S3_BUCKET,
//       Key: heicFile!.name,
//       Body: heicFile,
//     };

//     const upload = s3
//       .putObject({
//         ...params,
//         Body: heicFile || undefined,
//       })
//       .on("httpUploadProgress", (evt) => {
//         console.log(
//           "Uploading " + ((evt.loaded * 100) / evt.total).toString() + "%"
//         );
//       })
//       .promise();

//     await upload.then((err) => {
//       console.log(err);
//       alert("File uploaded successfully.");
//     });
//   };
