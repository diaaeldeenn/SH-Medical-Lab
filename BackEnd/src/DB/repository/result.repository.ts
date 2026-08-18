import type { Model } from "mongoose";
import BaseRepository from "./base.repository.js";
import resultModel, { type ResultI } from "../models/result.model.js";

class ResultRepository extends BaseRepository<ResultI> {
  constructor(protected readonly model: Model<ResultI> = resultModel) {
    super(model);
  }

  async countDocuments(filter: any): Promise<number> {
    return await this.model.countDocuments(filter);
  }
}

export default ResultRepository;
