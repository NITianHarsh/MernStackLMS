// routes/exams.js
import express from "express";
import Exam from "../models/Exam.js";
import Result from "../models/Result.js";

const router = express.Router();

// Create a new exam (admin only)
// add isAdmin middleware later
router.post("/createExam", async (req, res) => {
  try {
    console.log(req.body);
    const { title, subject, duration, questions } = req.body;
    const newExam = new Exam({
      title,
      subject,
      duration,
      questions,
    });

    await newExam.save();
    res.status(201).json({ message: "Exam created successfully", exam: newExam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating exam" });
  }
});

//publish a exam
// PUT /exam/publish/:id
router.put("/publish/:id", async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );
    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(500).json({ error: "Failed to publish exam" });
  }
});


// to get published exam only
router.get("/published", async (req, res) => {
  try {
    const exams = await Exam.find({ isPublished: true });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch published exams" });
  }
});




// Fetch all exams for students (only published exams)
//add ispublished options later
router.get("/getExamList", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching exams" });
  }
});

// Get random questions from an exam (for students)
router.get("/:examId/questions", async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId);
    if (!exam || !exam.isPublished) {
      return res.status(404).json({ message: "Exam not found or not published" });
    }

    // Shuffle questions before sending them
    const shuffledQuestions = exam.questions.sort(() => Math.random() - 0.5);
    res.status(200).json(shuffledQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// Publish exam (admin only)
// router.patch("/:examId/publish", async (req, res) => {
//   const { examId } = req.params;

//   try {
//     const exam = await Exam.findById(examId);
//     if (!exam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     exam.isPublished = true;
//     await exam.save();
//     res.status(200).json({ message: "Exam published successfully", exam });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error publishing exam" });
//   }
// });

export default router;
