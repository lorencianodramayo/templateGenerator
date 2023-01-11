const express = require("express");
const router = express.Router();

const AdmZip = require("adm-zip");

const xdFile = require("xd-file");

const multer = require("../utils/multerSettings");

function extendTimeout(req, res, next) {
  res.setTimeout(480000, function () {
    console.log("timeout");
  });
  next();
}

router.post("/", extendTimeout, multer.any(), async (req, res, next) => {
  let zip = new AdmZip(req.files[0].buffer);

  const map = await zip.getEntries().map((entry) => {
    return {
      name: entry.name,
      file:
        entry.getData().toString("utf8").at(0) === "{" &&
        entry.getData().toString("utf8").at(-1) === "}"
          ? JSON.parse(entry.getData().toString("utf8"))
          : entry.getData().toString('base64'),
    };
  });

  res.status(200).json({ data: map });

  // console.log()

  // const xdData = xdFile.readXDFile();

  // xdData.then((value) => res.status(200).json({ data: value }));
});

module.exports = router;
