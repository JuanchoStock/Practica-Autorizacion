import mysql from 'mysql2/promise';

export async function connection (){
    const newConnection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "db_system"
    })
    return newConnection;
}



