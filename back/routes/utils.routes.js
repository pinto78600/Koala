const router = require('express').Router();
const chatController = require('../controllers/chat.controller');


//chat
router.get('/:id', chatController.getNotifs);
router.patch('/:id', chatController.deleteNotifs);
router.post('/friendly', chatController.createRoom);
router.get('/friendly/:id/:idfriend', chatController.getRoom);
router.post('/friendly/:roomid', chatController.postNotifs);

module.exports = router;