import { storage } from '../config/firebase';
import pdf from 'pdf-parse';

export const uploadPDF = async (file: Express.Multer.File, path: string): Promise<string> => {
  const bucket = storage.bucket();
  const blob = bucket.file(path);
  
  await blob.save(file.buffer, {
    contentType: 'application/pdf',
  });

  return blob.publicUrl();
};

export const extractPDFInfo = async (buffer: Buffer) => {
  try {
    const data = await pdf(buffer);
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (error) {
    throw new Error('Error extracting PDF information');
  }
};