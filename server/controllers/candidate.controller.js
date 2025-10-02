import prisma from "../db/index.js";


const addCandidate = async (req, res) => {
  try {
    const { name, skills, experience } = req.body;
    if (!name || !skills || experience === undefined) {
      return res.status(400).json({ error: "Name, skills and experience are required" });
    }

    const candidate = await prisma.candidate.create({
      data: { name, skills, experience: Number(experience) },
    });

    res.status(201).json(candidate);
  } catch (err) {
    console.error("Error adding candidate:", err);
    res.status(500).json({ error: "Failed to add candidate" });
  }
};

const getCandidate = async (req, res) => {
  try {
    const { skill } = req.query;

    const candidates = await prisma.candidate.findMany({
      where: skill
        ? { skills: { contains: skill, mode: "insensitive" } }
        : {},
    });

    res.status(200).json(candidates);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};


const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, skills, experience } = req.body;

    const candidate = await prisma.candidate.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(skills && { skills }),
        ...(experience !== undefined && { experience: Number(experience) }),
      },
    });

    res.status(200).json(candidate);
  } catch (err) {
    console.error("Error updating candidate:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.status(500).json({ error: "Failed to update candidate" });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.jobCandidate.deleteMany({
      where: { candidateId: Number(id) },
    });
    await prisma.candidate.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("Error deleting candidate:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.status(500).json({ error: "Failed to delete candidate" });
  }
};


export {
    addCandidate, 
    getCandidate,
    deleteCandidate,
    updateCandidate
}