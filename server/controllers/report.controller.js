import prisma from "../db/index.js";

const getReport = async (req, res) => {
  try {
    const candidateCount = await prisma.candidate.count();
    const openJobs = await prisma.job.count({ where: { isOpen: true } });
    
    const assignments = await prisma.jobCandidate.count();

    res.status(200).json({
      candidates: candidateCount,
      openJobs,
      assignments,
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};

export {
    getReport
}