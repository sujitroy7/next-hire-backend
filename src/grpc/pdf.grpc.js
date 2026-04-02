import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "pdf.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  long: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const pdfPackage = grpcObject.pdf;

export default new pdfPackage.PdfService(
  "localhost:50052",
  grpc.credentials.createInsecure(),
);
