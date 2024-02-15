import { ALLOWED_FILE_TYPES_TO_UPLOAD } from './multer.consts';

export const fileExtensionAccepted = (mimetype: string) => {
  if (ALLOWED_FILE_TYPES_TO_UPLOAD.includes(mimetype)) return true;
  return false;
};
