// middleware/adminAuth.js
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Unauthorized, admin rights required" });
};

export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  res.status(403).json({ message: "Unauthorized, student rights required" });
};

export const isInstructor = (req, res, next) => {
  if (req.user && req.user.role === 'instructor') {
    return next();
  }
  res.status(403).json({ message: "Unauthorized, instructor rights required" });
};