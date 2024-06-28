export class InviteResponse {
  coworkerName: string;
  designation: string;
  perHour: string;
  completedJobs: number;
  releventSkills: number;
  description: string;
  userID: number;
  compaignID: number;
  proposalID: number;
  profileID: number;
  applicantDetail: string;
  favUserTechn: string;
  proposedBid: number;
  proposalStatus: string;
  invitationStatus: string;
  senderID: number;
  recieverID: number;
  //Submit Proposal//
  salesRate: string;
  numberofSales: string;
  clientRecive: string;
  coverLetter: string;
  uploadFile: string;
  createdDate: string;
  sittingCapacity: string;
  userImage: string;
}
export class MessageRequest {
  compaignID: number;
  proposalID: number;
  senderID: number;
  recieverID: number;
  senderType: string;
  recieverType: string;
  messageText: string = '';
}
export class InvitationRequest {
  compaignID: number;
  proposalID: number;
  senderID: number;
  recieverID: number;
  senderType: string;
  recieverType: string;
  invitationStatus: string;
}
export class ClientInvitationsRsp {
  clientName: string;
  compaignName: string;
  compaignID: number;
  proposalID: number;
  invitationID: number;
  invitationStatus: string;
  createdDate: string;
  designation: string;
  description: string;
  userID: number;
  profileID: number;
  applicantDetail: string;
  favUserTechn: string;

  clientReciveProfile: string;
  coverLetterProfile: string;
  coworkerNameProfile: string;
  createdDateProfile: string;
  descriptionProfile: string;
  favUserTechnProfile: string;
  numberofSalesProfile: string;
  profileIDProfile: string;
  proposalStatusProfile: string;
  recieverIDProfile: string;
  salesRateProfile: string;
  sittingCapacityProfile: string;
}
export class ClientInvitationsRqst {
  invitationID: number;
  invitationStatus: string;
}
export class HiredRequest {
  compaignID: number;
  proposalID: number;
  hiredByID: number;
  hiredCallerID: number;
  hiredByType: string;
  hiredCallerType: string;
  hireStatus: string;
}
export class ClientHiredRsp {
  clientName: string;
  compaignName: string;
  compaignID: number;
  proposalID: number;
  hiredID: number;
  hireStatus: string;
  createdDate: string;
  designation: string;
  proposedBid: number;
  description: string;
  clientID: number;
  email: string;

  clientReciveProfile: string;
  coverLetterProfile: string;
  coworkerNameProfile: string;
  createdDateProfile: string;
  descriptionProfile: string;
  favUserTechnProfile: string;
  numberofSalesProfile: string;
  profileIDProfile: string;
  proposalStatusProfile: string;
  recieverIDProfile: string;
  salesRateProfile: string;
  sittingCapacityProfile: string;

}
export class ClientHiredRqst {
  hiredID: number;
  hireStatus: string;
}
export class ClientLeadSubRqst{
  userID: number;
  title: string;
  description: string;
  customerName: string;
  customerPhnNum: string;
  zipCode: string;
  question: QstnsLst[];
}
export class QstnsLst {
  qsts: string;
}
export class LeadSubList {
  leadSubID: number;
  compaignID: number;
  userID: number;
  requestorUserID: number;
  title: string;
  description: string;
  customerName: string;
  customerPhnNum: string;
  zipCode: string;
  createdDate: string;
}
export class LeadSubQstList {
  leadSubQstID: number;
  question: string;
  createdDate: string;
  userID: number;
  leadSubID: number;
  compaignID: number;
  requestorUserID: number;
  answers: string;
}
export class ContractSignReq {
  ContractID: number;
  CompaignID: number;
  CallCenterID: number;
  ClientID: number;
  ShiftTime: string;
  StartTime: string;
  EndTime: string;
  TimeZone: string;
  ExpectedLeads: string;
  Days: number;
  ContractStatus: string;
  notificationCount: number;
  senderType: string;
  recieverType: string;
}
