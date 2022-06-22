import config from "@/config";
import * as models from "@/persistence/models";
import persistance_lib from "@/persistence";

const persistance = persistance_lib(config, models);

export { persistance };
