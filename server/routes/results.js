// routes/results.js
import express from "express";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
// import authenticate from "../middlewares/auth.js";

const router = express.Router();

// Submit answers for an exam (students)
router.post("/:examId/submit", async (req, res) => {
  const { examId } = req.params;
  const { answers, timeTaken ,studentName} = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam || !exam.isPublished) {
      return res.status(404).json({ message: "Exam not found or not published" });
    }

    // Calculate the score
    let score = 0;
    const totalQuestions = exam.questions.length;

    const resultAnswers = answers.map((answer, index) => {
      const question = exam.questions[index];
      const isCorrect = answer.selectedOptionIndex === question.correctAnswerIndex;
      if (isCorrect) score++;
      return {
        questionId: question._id, // ✅ required field
        selectedOptionIndex: answer.selectedOptionIndex,
        isCorrect,
      };
    });

    // Save the result
    const result = new Result({
      // studentId: req.user._id, // enable if using auth
      studentName,
      examId: exam._id,
      answers: resultAnswers,
      score,
      totalQuestions,
      timeTaken,
    });

    await result.save();
    res.status(201).json({ message: "Exam submitted successfully", score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting exam" });
  }
});

// View results for a student
// router.get("/:examId/results", async (req, res) => {
//   const { examId } = req.params;

//   try {
//     const results = await Result.find({ examId });  // No studentId filter now
//     if (!results || results.length === 0) {
//       return res.status(404).json({ message: "Results not found" });
//     }

//     res.status(200).json(results);  // Return all results for the given examId
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching results" });
//   }
// });

// routes/result.js or wherever this is located
router.get("/:examId/results", async (req, res) => {
  const { examId } = req.params;
  const { latest } = req.query;

  try {
    if (latest === "true") {
      const latestResult = await Result.findOne({ examId })
        .sort({ createdAt: -1 }) // Ensure your schema uses timestamps
        .exec();

      if (!latestResult) {
        return res.status(404).json({ message: "No results found" });
      }

      return res.status(200).json(latestResult);
    }

    const results = await Result.find({ examId });

    if (!results.length) {
      return res.status(404).json({ message: "No results found" });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Server error" });
  }
});




// Leaderboard for an exam
router.get("/:examId/leaderboard", async (req, res) => {
  const { examId } = req.params;

  try {
    const results = await Result.find({ examId })
      .sort({ score: -1, timeTaken: 1 }) // Sort by score descending, time taken ascending
      .limit(10) // Get top 10 scores
      const leaderboard = results.map(result => ({
        studentName: result.studentName, // make sure this field exists in Result
        score: result.score,
        timeTaken: result.timeTaken,
      }));
  

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

export default router;
