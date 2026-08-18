import type { Model } from "mongoose";
import type { TestI } from "../models/test.model.js";
import BaseRepository from "./base.repository.js";
import testModel from "../models/test.model.js";

class TestRepository extends BaseRepository<TestI> {
  constructor(protected readonly model: Model<TestI> = testModel) {
    super(model);
  }
}

export default TestRepository;