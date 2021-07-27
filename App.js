const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.get("/video", (req, res) => {
  const videoPath = "videos/cars.mp4";
  const videoStat = fs.statSync(videoPath);
  const fileSize = videoStat.size;
  const videoRange = req.headers.range;
  //   const videoRange = "bytes=0-1000000";
  if (videoRange) {
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(videoRange.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
    const file = fs.createReadStream(videoPath, { start, end });
    const contentLength = end - start + 1;
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
    // res.status(400).send("Requires Range header");
  }
});

module.exports = app;
