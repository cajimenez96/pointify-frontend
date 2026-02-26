import { type Client, ClientCompany } from "../types";

export function adaptClientCompanyToClient(data: ClientCompany[]): Client[] {
  return data.map((item) => ({
    _id: item.clientId._id,
    companyId: item.companyId,
    dni: item.clientId.dni,
    name: item.clientId.name,
    email: item.clientId.email,
    phone: item.clientId.phone,
    currentPoints: item.currentPoints,
    totalAccumulated: item.totalAccumulated,
    status: item.clientId.status,
    isActive: item.clientId.status === "ACTIVE",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}
