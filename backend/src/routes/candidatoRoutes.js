const express = require('express');
const router = express.Router();
const controller = require('../controllers/candidatoController');
const upload = require('../middlewares/upload');

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.detalhar);
router.post('/extrair-pdf', upload.single('arquivo'), controller.extrairPdf);

module.exports = router;