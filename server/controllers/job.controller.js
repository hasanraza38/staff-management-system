import prisma from "../db/index.js";

const postJob = async (req, res) => {
  try {
    const { title, clientId, isOpen = true } = req.body;
    if (!title || !clientId) {
      return res.status(400).json({ error: "Job title and clientId are required" });
    }

    const clientExists = await prisma.client.findUnique({
      where: { id: Number(clientId) },
    });
    if (!clientExists) {
      return res.status(404).json({ error: "Client not found" });
    }

    const job = await prisma.job.create({
      data: { title, clientId: Number(clientId), isOpen: Boolean(isOpen) },
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: "Failed to create job" });
  }
};

const getJobs = async (req, res) => {
  try {
    const { title } = req.query;
    const jobs = await prisma.job.findMany({
      where: title
        ? { title: { contains: title, mode: "insensitive" } }
        : {},
      include: {
        client: true,
        candidates: { include: { candidate: true } },
      },
    });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};


const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, clientId, isOpen } = req.body;

    const jobExists = await prisma.job.findUnique({
      where: { id: Number(id) },
    });
    if (!jobExists) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (clientId) {
      const clientExists = await prisma.client.findUnique({
        where: { id: Number(clientId) },
      });
      if (!clientExists) {
        return res.status(404).json({ error: "Client not found" });
      }
    }

    const job = await prisma.job.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(clientId && { clientId: Number(clientId) }),
        ...(isOpen !== undefined && { isOpen: Boolean(isOpen) }),
      },
    });

    res.status(200).json(job);
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ error: "Failed to update job" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(500).json({ error: "Failed to delete job" });
  }
};

const assignJobToCand = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { candidateId } = req.body;

    if (!jobId || !candidateId) {
      return res.status(400).json({ error: "jobId and candidateId are required" });
    }

    const jobExists = await prisma.job.findUnique({
      where: { id: Number(jobId) },
    });
    if (!jobExists) {
      return res.status(404).json({ error: "Job not found" });
    }

    const candidateExists = await prisma.candidate.findUnique({
      where: { id: Number(candidateId) },
    });
    if (!candidateExists) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const assignment = await prisma.jobCandidate.create({
      data: { jobId: Number(jobId), candidateId: Number(candidateId) },
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error("Error assigning candidate to job:", err);
    res.status(500).json({ error: "Failed to assign candidate to job" });
  }
};


const removeAssignment = async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;

    const deleted = await prisma.jobCandidate.deleteMany({
      where: {
        jobId: Number(jobId),
        candidateId: Number(candidateId),
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment removed successfully" });
  } catch (err) {
    console.error("Error removing assignment:", err);
    res.status(500).json({ error: "Failed to remove assignment" });
  }
};

export {
  postJob,
  getJobs,
  updateJob,
  deleteJob,
  assignJobToCand,
  removeAssignment
};
