import cloudinary from "#/configs/cloudinary.config"

import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"

/**
 * Middleware to transfer uploaded file to Cloundinary
 * Response image url instead of save to server hardware
 */
const storage = new CloudinaryStorage({
    /**
     * Connect with Cloudinary account
     * Include CLOUD_NAME, API_KEY, API SECRET
     */
    cloudinary: cloudinary,

    /**
     * Dinamic configuration
     * Always run whenever a file uploaded
     * @param req request info (body, header, ...)
     * @param file upload file info (file name, type, metadata, ...)
     * @returns file info after uploaded to Cloudinary
     */
    params: async (req, file) => {
        // Auto classify folder
        const folderName = file.fieldname === "avatar" ? "linko/avatars" : "linko/backgrounds"

        return {
            // Folder that file was added to
            folder: folderName,
            // Filter upload format type (Remove junk files)
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
            // Convert to jpg to save space & bandwidth
            format: "jpg",
            // Resize for oversize images (Only zoom out not zoom in)
            transformation: [{ width: 800, crop: "limit" }],
            // Filename (id) in Cloudinary
            public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        }
    },
})

const uploadCloud = multer({ storage })

export { uploadCloud }
