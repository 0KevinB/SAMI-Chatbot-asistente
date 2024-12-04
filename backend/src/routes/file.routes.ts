import express from 'express';
import { FileController } from '../controllers/file.controller';

const router = express.Router();
const fileController = new FileController();

router.get('/files', (req, res) => fileController.getAllFiles(req, res));
router.get('/file-url/:fileName', (req, res) => fileController.getFileUrl(req, res));
router.get('/url/:fileName', (req, res) => fileController.getPublicFileUrl(req, res));
export default router;