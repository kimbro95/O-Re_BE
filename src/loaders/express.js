import express from "express";

import routes from "../api/routes/index.js";
import { prefix } from "./../config/index.js";

export default async (app) => {
  app.use(express.urlencoded({ extended: false }));
  // req.body to json
  app.use(express.json());

  // API routes
  app.use(prefix, routes);
};
