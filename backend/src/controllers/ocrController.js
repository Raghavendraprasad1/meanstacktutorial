
const handleException = require('../utils/errorHandler');
const fs = require('fs');
const path = require('path');
const ocrSpaceApi = require('ocr-space-api');
const https = require('https');
const querystring = require('querystring');
const axios = require('axios');



// const extractTextFromFile = async (req, res, filename) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ error: messages.FILE_NOT_PROVIDED });
//     }

//     // const filePath = path.join(__dirname, '../uploads', file.filename);
//     // const fileBuffer = fs.readFileSync(filePath);

//     const filePath = path.join(__dirname, '../uploads', filename);
//     const fileBuffer = fs.readFileSync(filePath);

//     // const apiKey = process.env.OCR_SPACE_API_KEY;
//     const apiKey = "K81901272488957";
//     const ext = path.extname(file.filename).toLowerCase();

//     let postData, options;

//     if (ext === '.pdf') {
//       console.log("pdf file: ", filename);
//       const base64PDF = fileBuffer.toString('base64');
//       postData = querystring.stringify({
//         apikey: apiKey,
//         language: 'eng',
//         isOverlayRequired: 'false',
//         base64Image: `data:application/pdf;base64,${base64PDF}`
//       });

//       options = {
//         hostname: 'api.ocr.space',
//         path: '/parse/image',
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Content-Length': Buffer.byteLength(postData)
//         }
//       };
//     } else {
//       console.log("img file: ", filename);
//       const base64Image = fileBuffer.toString('base64');
//       postData = querystring.stringify({
//         apikey: apiKey,
//         language: 'eng',
//         isOverlayRequired: 'false',
//         base64Image: `data:image/jpeg;base64,${base64Image}`
//       });

//       options = {
//         hostname: 'api.ocr.space',
//         path: '/parse/image',
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Content-Length': Buffer.byteLength(postData)
//         }
//       };
//     }

//     const parsedResult = await new Promise((resolve, reject) => {
//       const ocrRequest = https.request(options, (ocrResponse) => {
//         let data = '';

//         ocrResponse.on('data', (chunk) => {
//           data += chunk;
//         });

//         ocrResponse.on('end', () => {
//           try {
//             const result = JSON.parse(data);
//             resolve(result);
//           } catch (error) {
//             reject(error);
//           }
//         });
//       });

//       ocrRequest.on('error', (e) => {
//         reject(e);
//       });

//       ocrRequest.write(postData);
//       ocrRequest.end();
//     });

//     if (parsedResult.OCRExitCode === 1) {
//       const text = parsedResult.ParsedResults[0].ParsedText;
//       res.status(200).json({ text });
//     } else {
//       console.error('Error from OCR.space API:', parsedResult);
//       res.status(400).json({ error: parsedResult.ErrorMessage });
//     }

//     // Clean up the uploaded file
//     fs.unlinkSync(filePath);
//   } catch (error) {
//     handleException(error, res);
//   }
// };

const extractTextFromFile = async (req, res, filename) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: messages.FILE_NOT_PROVIDED });
    }

    const filePath = path.join(__dirname, '../uploads', filename);
    const fileBuffer = fs.readFileSync(filePath);

    const apiKey = "K81901272488957";
    const ext = path.extname(file.filename).toLowerCase();

    let postData, options;
    let base64Image;

    switch (ext) {
      case '.pdf':
        console.log("pdf file: ", filename);
        base64Image = fileBuffer.toString('base64');
        postData = querystring.stringify({
          apikey: apiKey,
          language: 'eng',
          isOverlayRequired: 'false',
          base64Image: `data:application/pdf;base64,${base64Image}`
        });
        break;
      case '.jpeg':
      case '.jpg':
        console.log("jpeg file: ", filename);
        base64Image = fileBuffer.toString('base64');
        postData = querystring.stringify({
          apikey: apiKey,
          language: 'eng',
          isOverlayRequired: 'false',
          base64Image: `data:image/jpeg;base64,${base64Image}`
        });
        break;
      case '.png':
        console.log("png file: ", filename);
        base64Image = fileBuffer.toString('base64');
        postData = querystring.stringify({
          apikey: apiKey,
          language: 'eng',
          isOverlayRequired: 'false',
          base64Image: `data:image/png;base64,${base64Image}`
        });
        break;
      case '.webp':
        console.log("webp file: ", filename);
        base64Image = fileBuffer.toString('base64');
        postData = querystring.stringify({
          apikey: apiKey,
          language: 'eng',
          isOverlayRequired: 'false',
          base64Image: `data:image/webp;base64,${base64Image}`
        });
        break;
      default:
        return res.status(400).json({ error: 'Unsupported file type' });
    }

    options = {
      hostname: 'api.ocr.space',
      path: '/parse/image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const parsedResult = await new Promise((resolve, reject) => {
      const ocrRequest = https.request(options, (ocrResponse) => {
        let data = '';

        ocrResponse.on('data', (chunk) => {
          data += chunk;
        });

        ocrResponse.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      });

      ocrRequest.on('error', (e) => {
        reject(e);
      });

      ocrRequest.write(postData);
      ocrRequest.end();
    });

    if (parsedResult.OCRExitCode === 1) {
      const text = parsedResult.ParsedResults[0].ParsedText;
      res.status(200).json({ text });
    } else {
      console.error('Error from OCR.space API:', parsedResult);
      res.status(400).json({ error: parsedResult.ErrorMessage });
    }

    // Clean up the uploaded file
    // fs.unlinkSync(filePath);
  } catch (error) {
    handleException(error, res);
  }
};

module.exports = {
    extractTextFromFile
}