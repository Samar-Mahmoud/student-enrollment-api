import fs from "fs/promises";
import mysql from "mysql2/promise";
import env from "dotenv";
import express from "express";

env.config();

const app = express();
const connect = await mysql.createConnection(process.env.DATABASE_URL);

let dataStudents, dataGrades, dataTeachers, dataGroups, dataSubjects;

try {
	let res = await fs.readFile("dataset/students.json", "utf8");
	dataStudents = JSON.parse(res);
	res = await fs.readFile("dataset/grades.json", "utf8");
	dataGrades = JSON.parse(res);
	res = await fs.readFile("dataset/teachers.json", "utf8");
	dataTeachers = JSON.parse(res);
	res = await fs.readFile("dataset/groups.json", "utf8");
	dataGroups = JSON.parse(res);
	res = await fs.readFile("dataset/subjects.json", "utf8");
	dataSubjects = JSON.parse(res);
} catch (err) {
	console.log(err);
}

app.get("/", async (req, res) => {
	// await connect.query(`INSERT into students values (1,'a','b',1,'ss','s')`)
	res.send();
});

app.get("/seedStudents", async (req, res) => {
	for (let i = 0; i < dataStudents.length; i++) {
		const { student_id, first_name, last_name, group_id, email, phone_number } = dataStudents[i];
		await connect.query(`INSERT INTO students VALUES (?,?,?,?,?,?)`, [student_id, first_name, last_name, group_id, email, phone_number]);
	}
	res.send(dataStudents);
});

app.get("/seedGrades", (req, res) => {
	dataGrades.forEach((record) => {
		connect.query(`INSERT INTO grades VALUES (?, ?, ?, ?, ?)`, [record.student_id, record.group_id, record.subject_id, record.grade, record.status]);
	});
	res.send(dataGrades);
});

app.get("/seedTeacher", (req, res) => {
	dataTeachers.forEach((record) => {
		connect.query(`INSERT INTO teachers VALUES (?, ?, ?, ?)`, [record.teacher_id, record.first_name, record.last_name, record.email]);
	});
	res.send(dataTeachers);
});

app.get("/seedGroups", (req, res) => {
	dataGroups.forEach((record) => connect.query(`INSERT INTO groups VALUES (?, ?)`, [record.group_id, record.group_name]));
	res.send(dataGroups);
});

app.get("/seedSubjects", (req, res) => {
	dataSubjects.forEach((record) => connect.query(`insert into subjects VALUES (?, ?,?,?)`, [record.subject_id, record.subject_name, record.group_id, record.teacher_id]));
	res.send(dataSubjects);
});

app.listen(3000, console.log("server listening on port 3000"));
