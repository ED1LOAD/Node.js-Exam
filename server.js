const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;

app.use(express.json());

let items = []; 

const validateItem = [
  body('name').isString().withMessage('Имя должно быть строкой').isLength({ min: 2 }).withMessage('Имя слишком короткое'),
  body('description').optional().isString().withMessage('Описание должно быть строкой'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', validateItem, handleValidationErrors, (req, res) => {
  const newItem = { id: items.length + 1, ...req.body };
  items.push(newItem); 
  res.status(201).json(newItem); 
});

app.put('/items/:id', validateItem, handleValidationErrors, (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(item => item.id === parseInt(id));
  if (index === -1) {
    return res.status(404).send('Элемент не найден');
  }
  const updatedItem = { ...items[index], ...req.body };
  items[index] = updatedItem;
  res.json(updatedItem);
});

app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  items = items.filter(item => item.id !== parseInt(id));
  res.send(`Элемент с id ${id} удален`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!', error: err.message });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
