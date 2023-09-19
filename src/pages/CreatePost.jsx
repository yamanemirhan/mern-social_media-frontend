import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { GiCancel } from "react-icons/gi";
import { createPost } from "../features/post/postSlice";

function CreatePost() {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const dispatch = useDispatch();

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleImageRemove = (index) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((img, i) => i !== index)
    );
  };

  const handleShare = (e) => {
    e.preventDefault();

    if (!content && selectedImages?.length === 0) {
      toast.error("Please select images or enter content");
      return;
    }

    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append("post_image", image);
    });
    formData.append("content", content);

    dispatch(createPost(formData));

    setSelectedImages([]);
    setContent("");
  };

  return (
    <div className="py-12">
      <div className="max-w-[1200px] mx-auto p-2">
        <h2 className="text-2xl">What do you wanna share?</h2>
        <form
          action="/uploadfile"
          method="post"
          encType="multipart/form-data"
          className="mt-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="content">Content</label>
            <textarea
              onChange={(e) => setContent(e.target.value)}
              name="content"
              value={content}
              rows="6"
              className="p-1 rounded-md bg-black-navbar resize-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="files">Images</label>
            <input
              onChange={handleImageSelect}
              multiple
              accept="image/*"
              type="file"
              name="files"
            />
          </div>
          <div className="mt-2 flex flex-row flex-wrap justify-center gap-4 w-fit">
            {selectedImages?.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt="selected"
                  className="w-[584px] h-[384px] object-cover"
                />
                <GiCancel
                  onClick={() => handleImageRemove(index)}
                  size={30}
                  color="white"
                  className="absolute cursor-pointer top-0 right-0"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleShare}
            className="bg-black-navbar w-fit mx-auto py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500"
          >
            Share
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
