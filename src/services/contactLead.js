import ContactLead from "../models/ContactLead.js";
import { sendContactLeadEmail } from "../utils/sendContactLeadEmail.js";

export async function createContactLead({ name, companyName, email, phone, message }) {
  await sendContactLeadEmail({ name, companyName, email, phone, message });

  const lead = await ContactLead.create({
    name,
    companyName,
    email,
    phone,
    message,
  });

  return lead;
}


export async function getAllContactLeads() {
  return await ContactLead.find().sort({ createdAt: -1 }); 
}

export async function getLeadById(id) {
  return ContactLead.findById(id);
}