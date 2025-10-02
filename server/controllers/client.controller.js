import prisma from "../db/index.js";


const addClient = async (req, res) => {
  try {
    const { name, contact } = req.body;
    if (!name || !contact) {
      return res.status(400).json({ error: "Client name and contact are required" });
    }

    const client = await prisma.client.create({
      data: { name, contact },
    });

    res.status(201).json(client);
  } catch (err) {
    console.error("Error adding client:", err);
    res.status(500).json({ error: "Failed to add client" });
  }
};

const getClients = async (req, res) => {
  try {
    const { name, contact } = req.query;

    const filters = [];
    if (name) {
      filters.push({ name: { contains: name, mode: "insensitive" } });
    }
    if (contact) {
      filters.push({ contact: { contains: contact, mode: "insensitive" } });
    }

    const clients = await prisma.client.findMany({
      where: filters.length > 0 ? { OR: filters } : {},
      include: { jobs: true },
    });

    res.status(200).json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};



const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact } = req.body;

    const client = await prisma.client.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(contact && { contact }),
      },
    });

    res.status(200).json(client);
  } catch (err) {
    console.error("Error updating client:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(500).json({ error: "Failed to update client" });
  }
};



const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = await prisma.job.findMany({
      where: { clientId: Number(id) },
      select: { id: true },
    });

    const jobIds = jobs.map((job) => job.id);

    if (jobIds.length > 0) {
      await prisma.jobCandidate.deleteMany({
        where: { jobId: { in: jobIds } },
      });

      await prisma.job.deleteMany({
        where: { id: { in: jobIds } },
      });
    }

    await prisma.client.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("Error deleting client:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Client not found" });
    }
    res.status(500).json({ error: "Failed to delete client" });
  }
};



export {
  addClient,
  getClients,
  updateClient,
  deleteClient
}