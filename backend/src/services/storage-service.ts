import fs from "fs";
import path from "path";
import { Buffer } from "node:buffer";

export type StorageType = "memory" | "disk";
const STORAGE_TYPE: StorageType = (process.env.STORAGE_TYPE as StorageType) || "disk";
const UPLOAD_DEST = process.env.UPLOAD_DEST || "public/uploads";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const memoryStorage = new Map<string, Buffer>();

export interface UploadFileParams {
  buffer?: Buffer;
  filePath?: string;
  objectKey: string;
  contentType?: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  objectKey: string;
}

async function saveToDisk(params: UploadFileParams): Promise<UploadResult> {
  const data = params.buffer || (params.filePath ? fs.readFileSync(params.filePath) : null);
  if (!data) throw new Error("No data to save to disk");

  const fileName = params.objectKey;
  const folder = params.folder?.replace(/^\/+|\/+$/g, "");
  const finalPath = folder ? `${folder}/${fileName}` : fileName;
  const fullPath = path.join(UPLOAD_DEST, finalPath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, data);

  // Return a relative URL that can be served by the web server
  const relativeUrl = `/uploads/${finalPath.replace(/\\/g, "/")}`;
  return { url: relativeUrl, objectKey: finalPath };
}

async function saveToMemory(params: UploadFileParams): Promise<UploadResult> {
  const data = params.buffer || (params.filePath ? fs.readFileSync(params.filePath) : null);
  if (!data) throw new Error("No data to save to memory");

  const fileName = params.objectKey;
  const folder = params.folder?.replace(/^\/+|\/+$/g, "");
  const finalKey = folder ? `${folder}/${fileName}` : fileName;

  memoryStorage.set(finalKey, data);
  return { url: `memory://${finalKey}`, objectKey: finalKey };
}

export async function uploadFile(params: UploadFileParams): Promise<UploadResult> {
  switch (STORAGE_TYPE) {
    case "disk":
      return saveToDisk(params);
    case "memory":
      return saveToMemory(params);
    default:
      throw new Error(`Unsupported STORAGE_TYPE: ${STORAGE_TYPE}`);
  }
}
