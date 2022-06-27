import config from "@/config";
import * as models from "@/persistence/models";
import workers_lib from "@/workers";
import persistance_lib from "@/persistence";
import authentication_lib from "@/authentication";

const persistance = persistance_lib(config, models);
const system_auth = authentication_lib(config, models);
const workers = workers_lib(config);

export { persistance, system_auth, workers };
