// src/middleware/uploadMiddleware.ts

import path from 'path';
import { randomBytes } from 'crypto';
import multer, { type FileFilterCallback } from 'multer';
import type { Request, Response, NextFunction } from 'express';
import { uploadFile } from '../services/storage-service';

export interface UploadedFileInfo {
  objectKey: string;
  url: string;
  acl?: string;
}

export interface MulterFileWithStorage extends Express.Multer.File {
  storageInfo?: UploadedFileInfo;
}

const memoryStorage = multer.memoryStorage();

const fileFilter = (allowedMimeTypes: string[]) => {
  return (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error(`File type ${file.mimetype} not allowed`));
    }
    cb(null, true);
  };
};

export type UploadFolderResolver = string | ((req: Request) => string);

export interface UploadMiddlewareOptions {
  /** Subfolder under the storage root, or a function (runs after auth) e.g. `profiles/${userId}`. */
  folder?: UploadFolderResolver;
}

function buildSafeObjectKey(originalname: string): string {
  const base = path.basename(originalname || 'upload');
  const ext = path.extname(base);
  const stem =
    path
      .basename(base, ext)
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80) || 'file';
  return `${Date.now()}-${randomBytes(4).toString('hex')}-${stem}${ext}`;
}

export const uploadMiddleware = (
  fieldName: string,
  maxCount = 1,
  allowedMimeTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'application/pdf',
    'audio/mpeg',
  ],
  options?: UploadMiddlewareOptions,
) => {
  const upload = multer({ storage: memoryStorage, fileFilter: fileFilter(allowedMimeTypes) });
  const handler = maxCount === 1 ? upload.single(fieldName) : upload.array(fieldName, maxCount);

  return async (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, async (err) => {
      if (err) return next(err);

      try {
        const files =
          maxCount === 1
            ? req.file
              ? [req.file]
              : []
            : (req.files as Express.Multer.File[]) || [];
        const uploadedFiles: UploadedFileInfo[] = [];

        const folderRaw = options?.folder;
        const folder =
          typeof folderRaw === 'function'
            ? folderRaw(req)
            : (folderRaw ?? '').replace(/^\/+|\/+$/g, '');

        for (const file of files) {
          const storageResult = await uploadFile({
            buffer: file.buffer,
            objectKey: buildSafeObjectKey(file.originalname),
            contentType: file.mimetype,
            folder,
          });

          (file as MulterFileWithStorage).storageInfo = storageResult;
          uploadedFiles.push(storageResult);
        }

        if (maxCount === 1) {
          req.file = files[0];
        } else {
          req.files = files;
        }

        req.body.uploadedFiles = uploadedFiles;
        next();
      } catch (uploadErr) {
        next(uploadErr);
      }
    });
  };
};
