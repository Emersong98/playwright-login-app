import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const dni = process.env.CU_DNI || "";
export const password = process.env.CU_PASSWORD || "";
