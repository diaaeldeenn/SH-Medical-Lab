import type { Model } from "mongoose";
import BaseRepository from "./base.repository.js";
import LabRequestModel, {
  type LabRequestI,
} from "../models/labRequest.model.js";

class LabRequestRepository extends BaseRepository<LabRequestI> {
  constructor(protected readonly model: Model<LabRequestI> = LabRequestModel) {
    super(model);
  }
}

export default LabRequestRepository;
