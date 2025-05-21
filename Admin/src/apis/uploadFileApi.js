import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/FirebaseConfig";

const uploadFileApi = {
  async uploadFile(e) {
    console.log(e.target);
    const file = e.target.files[0];
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Tạo một Promise để xử lý việc trả về downloadURL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
          reject(error); // Trả về lỗi nếu có lỗi xảy ra
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Khi upload thành công, resolve Promise với downloadURL
            resolve(downloadURL);
          });
        }
      );
    });
  },
};

export default uploadFileApi;
