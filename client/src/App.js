import React, { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import _ from "lodash";
import { Upload } from "antd";

const beforeUpload = (file) => {
  return true;
};
const App = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [base, setBase] = useState({});
  const [artboards, setArtboards] = useState([]);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      _.filter(
        info.file.response.data,
        (data) =>
          data?.name === "thumbnail.png" &&
          setImageUrl(`data:image/png;base64, ${data?.file}`)
      );

      setBase(
        _.filter(
          info.file.response.data,
          (data) =>
            data?.name === "graphicContent.agc" &&
            !Object.keys(data?.file.artboards).includes("href")
        )[0]
      );

      setArtboards(
        _.filter(
          info.file.response.data,
          (data) =>
            data?.name === "graphicContent.agc" &&
            data?.file.children.length > 0
        )
      );

      setLoading(false);
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/uploadAPI"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>

      {!_.isEmpty(base?.file?.artboards) &&
        Object.keys(base?.file?.artboards).map((data) => (
          <div
            key={data}
            style={{
              width: `${base?.file?.artboards[data].width}px`,
              height: `${base?.file?.artboards[data].height}px`,
              border: "1px solid #000",
            }}
          >
            {_.filter(artboards, (artboard) => artboard?.file?.children[0]?.id === data)[0]?.file?.children[0].artboard.children}
            {`${base?.file?.artboards[data].name}`}
          </div>
        ))}
    </>
  );
};
export default App;
