const express = require('express');
const YAML = require('yamljs')
const swaggerUi = require('swagger-ui-express')
const swagerDocument = YAML.load('./swagger.yaml')

const app = express();
const port = 5005;

// Local object acting as database?
let  students = [{'id': 1, 'name':"Kishan"}]

// Middleware to parse JSON
app.use(express.json());

// Use SwaggerUI with the SwaggerDocument beign written
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagerDocument))

// Default root path
app.get('/', (req, res) =>{
	res.send('Hello Port 5005!');
});

// Path to getch all students
app.get('/students', (req, res) =>{
	res.json(students);
});

// Path to get a student by id
app.get('/students/:id', (req, res) =>{
	const student =students.find(item => item.id === parseInt(req.params.id));
	if (student){res.json(student)}else{res.status(404).json({message:"Not found"});}
});

// Path to create a student with parameters
app.post('/students/:id/:name', (req, res) =>{
	const {id, name} = req.params;
	const newstudent1 = { id: parseInt(id), name};
	students.push(newstudent1);
	res.status(201).json(newstudent1);
});

// Path to create a student with reqestBody
app.post('/students/create', (req, res) =>{
	const {id, name} = req.body;
	const newstudent2 = { id: parseInt(id), name};
	students.push(newstudent2);
	res.status(201).json(newstudent2);
});

app.listen(port, () => {
	console.log(`Listening on port http://localhost:${port}`);
});
