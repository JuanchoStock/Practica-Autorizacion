import mysql from 'mysql2/promise';

export const newConnection = async ()=>{
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "db_system"
    })
    return connection;
}



