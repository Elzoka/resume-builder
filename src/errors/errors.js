import create_error from "./create_error";

export const unknown_error = create_error(500, "unknown_error");
export const not_found = create_error(400, "not_found");
