import client from "../../grpc/pdf.grpc.js";

export const extractPdfDataGrpc = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    client.ProcessPdf({ file: fileBuffer }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        try {
          const data = JSON.parse(response.structuredData);
          resolve(data);
        } catch (e) {
          resolve(response.structuredData);
        }
      }
    });
  });
};
