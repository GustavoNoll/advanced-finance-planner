import app from './api';
import { Logger } from './logger';

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  Logger.info(`Server started on port ${PORT}`);
}); 