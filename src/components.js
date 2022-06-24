import config from "@/config";
import * as models from "@/persistence/models";
import persistance_lib from "@/persistence";
import authentication_lib from "@/authentication";

const persistance = persistance_lib(config, models);
const system_auth = authentication_lib(config, models);

export { persistance, system_auth };
