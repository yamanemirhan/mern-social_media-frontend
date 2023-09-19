import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updatePost } from "../features/post/postSlice";
import { GiCancel } from "react-icons/gi";

function EditPost({ post, setShowEditPost, setCurrentImageIndex }) {
  const [content, setContent] = useState(post?.content);
  const [images, setImages] = useState([]);

  const dispatch = useDispatch();

  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + "/images/" + imageUrl
      );
      if (!response.ok) {
        throw new Error(
          "Error downloading image: " +
            response.status +
            " " +
            response.statusText
        );
      }
      const blob = await response.blob();
      const filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error("Error downloading image:", error.message);
      return null;
    }
  };

  useEffect(() => {
    if (post?.images) {
      const fetchImages = async () => {
        const fetchedImages = await Promise.all(post.images.map(downloadImage));
        const filteredImages = fetchedImages.filter((image) => image !== null);
        setImages(filteredImages);
      };
      fetchImages();
    }
  }, [post]);

  const handleUpdateImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setImages([...images, ...files]);
  };

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();

    if (!content && images?.length === 0) {
      toast.error("Please select images or enter content");
      return;
    }

    const formData = new FormData();

    images.forEach((image) => {
      formData.append("post_image", image);
    });
    formData.append("content", content);

    setShowEditPost(false);

    dispatch(updatePost({ post: formData, id: post._id }));

    setImages([]);
    setContent("");
    setCurrentImageIndex(0);
  };

  const handleCloseButton = () => {
    setShowEditPost(false);
  };

  return (
    <div className="py-2">
      <h2 className="text-2xl text-center">Update Post</h2>
      <GiCancel
        onClick={handleCloseButton}
        size={30}
        className="absolute right-2 top-2 cursor-pointer"
      />
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
            className="p-1 rounded-md bg-black-main resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="files">Images</label>
          <input
            onChange={handleUpdateImageSelect}
            multiple
            accept="image/*"
            type="file"
            name="files"
          />
        </div>
        <div className="mt-2 flex flex-row flex-wrap justify-center gap-4 w-fit">
          {images?.map((image, index) => (
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
          onClick={handleUpdatePost}
          className="bg-black-main w-fit mx-auto py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default EditPost;
