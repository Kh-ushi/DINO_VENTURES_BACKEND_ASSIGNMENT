import app from "./app";
import { logger } from "./utils/logger";

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});