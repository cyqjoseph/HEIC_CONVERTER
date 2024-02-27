# HEIC to PNG Converter

**Project URL**: [HEIC to PNG Converter](http://heic-website.s3-website-ap-southeast-1.amazonaws.com)

## Overview

A serverless application that converts HEIC images to PNG format using AWS technologies. It features a React frontend for easy file uploads, with backend processing powered by AWS Lambda, S3, and API Gateway.

## Architecture

- **Frontend**: React app hosted on S3 for uploading HEIC files.
- **Backend**:
  - **AWS S3**: Two buckets for source (HEIC files) and destination (PNG files).
  - **AWS Lambda**: Converts HEIC to PNG upon file upload.
  - **AWS API Gateway**: Manages communication between the frontend and Lambda.

## Quick Start

1. **Upload**: Select and upload HEIC files through the web interface.
2. **Conversion**: Files are automatically converted to PNG format.
3. **Download**: Download the converted PNG files directly from the web interface.

## Deployment

- Frontend assets are deployed to an S3 bucket.
- Lambda function
- API Gateway configured for frontend-backend communication.
