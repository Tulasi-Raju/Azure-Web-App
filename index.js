const { ConnectionPool } = require('mssql');

module.exports = async function (context, req) {
    // Configuration for Azure SQL Database connection
    const config = {
        user: process.env.SQL_USER, // Azure SQL username
        password: process.env.SQL_PASSWORD, // Azure SQL password
        server: process.env.SQL_SERVER, // Azure SQL server name
        database: process.env.SQL_DATABASE, // Azure SQL database name
        options: {
            encrypt: true, // For security, ensure data is encrypted
            trustServerCertificate: false // Set to true if the server certificate is self-signed
        }
    };

    // Create a new connection pool
    const pool = new ConnectionPool(config);

    try {
        // Connect to the database
        await pool.connect();

        // SQL query to get the student count by country
        const result = await pool.request()
            .query('SELECT Country, COUNT(*) AS StudentCount FROM Students GROUP BY Country');

        // Return the results as a JSON response
        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        // Handle any errors that occur during the database query
        context.res = {
            status: 500,
            body: `Error fetching data: ${err.message}`
        };
    } finally {
        // Close the database connection pool
        pool.close();
    }
};
