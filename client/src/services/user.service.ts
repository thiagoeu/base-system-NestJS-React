import { api } from "./axios";

export async function create(name: string, email: string, password: string) {
  const { data } = await api.post("/users", {
    name,
    email,
    password,
  });
  return data;
}
