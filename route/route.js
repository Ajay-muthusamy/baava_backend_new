import express from 'express'
import { customerdetails } from '../controller/customer.control.js';
import { adminfetch } from '../controller/customer.control.js';
import { updateText } from '../controller/customer.control.js';
import { FetchUpdataData } from '../controller/customer.control.js';
import { FetchData } from '../controller/customer.control.js';

const router = express.Router();

router.post('/data',customerdetails);
router.get('/order-details',adminfetch);
router.get('/update-data',FetchData);
router.post('/update-offer',updateText);
router.put('/fetch-update-offer/:id',FetchUpdataData);

export default router;