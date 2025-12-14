import api from "./axios";

export const getSweets = () =>
  api.get("/sweets");

export const addSweet = (data) =>
  api.post("/sweets", data); // admin only
