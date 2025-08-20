export function adminRegistrationTemplate({ user, company, branchInfo }) {
  return `
    <h2>New Company Registration</h2>
    <p>A new user has registered on <strong>INDLOG NETWORK</strong>.</p>

    <h3>User Details</h3>
    <ul>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Phone:</strong> ${user.phone}</li>
      <li><strong>Role:</strong> ${user.role}</li>
    </ul>

    <h3>Company Details</h3>
    <ul>
      <li><strong>Company Name:</strong> ${company.companyName}</li>
      <li><strong>Contact Person:</strong> ${company.contactPerson}</li>
      <li><strong>Website:</strong> ${company.website || "N/A"}</li>
      <li><strong>Head Office:</strong> ${company.headOfficeAddress}</li>
      <li><strong>Country:</strong> ${company.country}</li>
      <li><strong>PIN Code:</strong> ${company.pinCode}</li>
      <li><strong>Freight Type:</strong> ${company.freightType}</li>
      <li><strong>GST No:</strong> ${company.gstNo || "N/A"}</li>
    </ul>

    <h3>Branch & Cost Info</h3>
    <ul>
      <li><strong>Branches:</strong> ${branchInfo.count}</li>
      <li><strong>Base Fee:</strong> ₹${branchInfo.baseRegistrationFee / 100}</li>
      <li><strong>Cost per Branch:</strong> ₹${branchInfo.costPerBranch / 100}</li>
      <li><strong>Total Cost:</strong> ₹${branchInfo.totalCost / 100}</li>
    </ul>

    <p style="margin-top:20px; font-size:12px; color:#777;">This is an automated notification.</p>
  `;
}

export function userThankYouTemplate({ company }) {
  return `
    <h2>Welcome to INDLOG NETWORK 🎉</h2>
    <p>Dear <strong>${company.contactPerson}</strong>,</p>
    <p>Thank you for registering your company <strong>${company.companyName}</strong> with us.</p>
    
    <p>Your account has been created successfully. You can now log in and access your dashboard.</p>

    <p style="margin-top:20px;">We’re excited to have you onboard 🚀</p>

    <p style="margin-top:20px; font-size:12px; color:#777;">If you have any questions, feel free to reply to this email.</p>
  `;
}
