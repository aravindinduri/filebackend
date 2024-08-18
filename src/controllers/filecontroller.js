import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import sharp from 'sharp';
import util from 'util';
import File from '../models/filemodel.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const gzip = util.promisify(zlib.gzip);

const compressImage = async (filePath) => {
    const compressedPath = path.join(path.dirname(filePath), `compressed-${path.basename(filePath)}`);
    const { size } = await sharp(filePath)
        .resize({ width: 1920 }) 
        .jpeg({ quality: 70 }) 
        .toFile(compressedPath);

    if (size > 6 * 1024 * 1024) {
        await sharp(compressedPath)
            .jpeg({ quality: 50 })
            .toFile(compressedPath);
    }

    return compressedPath;
};

const compressOtherFile = async (filePath) => {
    const compressedPath = path.join(path.dirname(filePath), `compressed-${path.basename(filePath)}.gz`);
    const fileData = fs.readFileSync(filePath);
    let compressedData = await gzip(fileData);

    while (compressedData.length > 1 * 1024 * 1024) {
        compressedData = await gzip(compressedData.slice(0, Math.floor(compressedData.length * 0.8)));
        console.log(compressedData.length)
    }
    fs.writeFileSync(compressedPath, compressedData);
    return compressedPath;
};

const FileUpload = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        let filePath = file.path;

        if (file.size > 6 * 1024 * 1024) { 
            if (file.mimetype.startsWith('image/')) {
                filePath = await compressImage(filePath);
            } else {
                filePath = await compressOtherFile(filePath);
            }
        }

        const uploadResult = await uploadOnCloudinary(filePath);
        console.log(uploadResult)
        const newFile = new File({
            name: file.originalname,
            url: uploadResult.url,
            size: fs.statSync(filePath).size, 
            contentType: file.mimetype,
        });

        await newFile.save();

        return res.status(201).json({ file: newFile, message: "File uploaded successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error occurred while uploading the file", error });
    }
};

const getAllFiles = async (req, res) => {
    try {
        const files = await File.find();
        if (files.length === 0) {
            return res.status(404).json({ message: "No files found" });
        }

        return res.status(200).json({ files, message: "Files retrieved successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error occurred while retrieving files", error: error.message });
    }
};

export { getAllFiles, FileUpload };
