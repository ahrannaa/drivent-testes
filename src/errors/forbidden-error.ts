import { ApplicationError } from "@/protocols";

export function forbidden(): ApplicationError {
  return {
    name: "Forbidden",
    message: "You don't have permission to access",
  };
}
