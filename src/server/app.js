
import app from './config/dependencies';
import connection from './config/connection';

app.listen(connection.port, () => {
    console.log(`Server is running on port: ${connection.port}`);
});