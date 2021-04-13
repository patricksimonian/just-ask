import mongoose from 'mongoose'

const auditSchema = new mongoose.Schema(
  {
    apiVersion: String,
    data: {
      type: String,
      validate: {
        validator: function (s) {
          return JSON.parse(s)
        },
        message: (props) => `${props.s} is not a JSON String!!`,
      },
    },
    action: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Audit', auditSchema)
