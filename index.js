import express from "express";
import fileUpload from "express-fileupload";
import {
  getFile,
  getFiles,
  uploadFile,
  downloadFile,
  getFileURL,
} from "./s3.js";

const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

app.get("/files", async (req, res) => {
  const result = await getFiles();
  res.json(result.Contents);
});

app.get("/files/:fileName", async (req, res) => {
  const { fileName } = req.params;

  const result = await getFileURL(fileName);

  res.json({
    url: result,
  });
});

app.get("/files/download/:fileName", async (req, res) => {
  const { fileName } = req.params;

  await downloadFile(fileName);

  res.json({ message: "downloaded yay" });
});

app.post("/files", async (req, res) => {
  const result = await uploadFile(req.files.file);
  console.log(req.files);
  res.json({ result });
});

app.use(express.static("downloads"));

app.listen(3000, () => {
  console.log(`server up at http://localhost:3000`);
});
