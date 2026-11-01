const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    solutionText: {
      type: String,
      required: [true, 'Solution text is required'],
      trim: true,
    },
    outcome: {
      type: String,
      enum: {
        values: ['Attempted', 'Partially Effective', 'Resolved'],
        message: 'Outcome must be Attempted, Partially Effective, or Resolved',
      },
      default: 'Attempted',
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const problemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
      maxlength: [140, 'Problem title cannot exceed 140 characters'],
    },
    description: {
      type: String,
      required: [true, 'Problem description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Technical', 'Academic', 'Algorithm', 'Debugging', 'Logic', 'System', 'Other'],
        message: 'Select a valid category',
      },
      default: 'Technical',
    },
    severity: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: 'Severity must be Low, Medium, High, or Critical',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: ['Open', 'In Progress', 'Solved', 'Closed'],
        message: 'Status must be Open, In Progress, Solved, or Closed',
      },
      default: 'Open',
    },
    solutions: [solutionSchema],
    resolutionNotes: {
      type: String,
      trim: true,
      default: '',
    },
    solvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-manage solvedAt timestamp on status change
problemSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'Solved' && !this.solvedAt) {
      this.solvedAt = new Date();
    } else if (this.status !== 'Solved') {
      this.solvedAt = null;
    }
  }
  next();
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;
