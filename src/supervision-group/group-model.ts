import * as mongoose from 'mongoose';
import { SupervisionGroup } from './group-interface';
const supervisionModel = new mongoose.Schema(
  {
    supervisor: {
      uniqueID: String,
      displayName: String,
      email: String,
      location: String
    },
    students: [
      { uniqueID: String, displayName: String, email: String, course: String }
    ]
  },
  { timestamps: true }
);

const groupModel = mongoose.model<SupervisionGroup & mongoose.Document>(
  'supervision-group',
  supervisionModel,
  'supervision-group'
);

export default groupModel;
