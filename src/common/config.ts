// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { get } from 'env-var';

export const config = () => ({
  db: {
    username: get('DB_USERNAME').required().asString(),
    password: get('DB_PASSWORD').required().asString(),
    dbName: get('DB_NAME').required().asString(),
  },
});

export type ConfigShape = ReturnType<typeof config>;
