import create_error from "./create_error";

export const unknown_error = create_error(500, "unknown_error");
export const not_found = create_error(404, "not_found");
export const invalid_resource = create_error(400, "invalid_resource");
export const validation_error = create_error(400, "validation_error");
export const invalid_token = create_error(401, "invalid_token");
export const token_required = create_error(401, "token_required");
