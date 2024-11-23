import multer from "multer";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

interface TCloudinaryResponse {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    folder: string;
    overwritten: boolean;
    original_filename: string;
    api_key: string;
}



interface TFile {
    fieldname: string;   
    originalname: string;
    encoding: string;    
    mimetype: string;    
    destination: string; 
    filename: string;    
    path: string;        
    size: number;        
}



// functionality of multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })



//Functionality of upload in cloudinary

// Configuration
cloudinary.config({
    cloud_name: 'djh6t55nn',
    api_key: '713998522948863',
    api_secret: '9pyex37WBq-9HOnofBSWIuuZEEw'
});

const uploadToCloudinary = async (file: TFile): Promise<TCloudinaryResponse | undefined> => {
    
    return new Promise((resolve, reject) => {
        // Upload an image
        cloudinary.uploader.upload(file.path, 
            // { public_id: file.originalname },
            (error: Error, result: TCloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            }
        )

    })

    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });

    // console.log(optimizeUrl);

    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto', 
    //     width: 500,
    //     height: 500,
    // });

    // console.log(autoCropUrl);    
}


export const fileUploader = {
    upload,
    uploadToCloudinary
}