import { createContactLead, getAllContactLeads, getLeadById } from "../services/contactLead.js";

export async function handleContactLead(req, res) {
  try {
    const { name, companyName, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email and message are required" });
    }

    // call service
    const lead = await createContactLead({ name, companyName, email, phone, message });

    return res.status(201).json({
      message: "Your message has been received. We'll get back to you soon.",
      data: lead,
    });
  } catch (err) {
    console.error("Error handling contact lead:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}


export async function fetchContactLeads(req, res) {
  try {
    const leads = await getAllContactLeads();
    return res.status(200).json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    return res.status(500).json({ error: "Failed to fetch leads" });
  }
}

export async function fetchLeadById(req, res) {
  try {
    const { id } = req.params;  
    const lead = await getLeadById(id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lead details" });
  }
}