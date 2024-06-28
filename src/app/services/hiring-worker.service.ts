import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class HiringWorkerService {


  constructor(private service: GenericService) { }

  GetInvitedWorker(obj):any {
    return this.service.ApiPostMethod('HiringWorker/GetInvitedWorker', obj);
  }
  GetCallCenter() {
    return this.service.ApiGetMethod('HiringWorker/GetCallCenter');
  }
  GetProposalWorker(obj): any {
    return this.service.ApiPostMethod('HiringWorker/GetProposalWorker',obj);
  }
  GetProfilePicture(id): any {
    return this.service.ApiGetMethod('Profile/getProfilePicture?id=' + id);
  }
  SendMessage(obj): any {
    return this.service.ApiPostMethod('HiringWorker/SendMessage', obj);
  }
  SendInvitation(obj): any {
    return this.service.ApiPostMethod('HiringWorker/SendInvitation', obj);
  }
  GetInvitationRequests(userID) {
    return this.service.ApiGetMethod('HiringWorker/GetInvitationRequests?userID=' + userID);
  }
  UpdateInvitationStatus(obj): any {
    return this.service.ApiPostMethod('HiringWorker/UpdateInvitationStatus', obj);
  }
  HiredCallCenter(obj): any {
    return this.service.ApiPostMethod('HiringWorker/HiredCallCenter', obj);
  }
  GetHiredRequests(userID, type) {
    return this.service.ApiGetMethod('HiringWorker/GetHiredRequests?userID=' + userID + '&&type=' + type);
  }
  UpdateHiredStatus(obj): any {
    return this.service.ApiPostMethod('HiringWorker/UpdateHiredStatus', obj);
  }
  saveLeadSubForm(obj): any {
    return this.service.ApiPostMethod('HiringWorker/saveLeadSubForm', obj);
  }
  getSubmittedLeads(userID,type): any {
    return this.service.ApiGetMethod('HiringWorker/getSubmittedLeads?userID=' + userID+'&&type='+type);
  }
  NotificationSend(obj): any {
    return this.service.ApiPostMethod('HiringWorker/NotificationSend', obj);
  }
  getEarningNotification(userID): any {
    return this.service.ApiGetMethod('HiringWorker/getEarningNotification?userID=' + userID);
  }
  updateNotificationEarning(userID): any {
    return this.service.ApiGetMethod('HiringWorker/updateNotificationEarning?userID=' + userID);
  }
  getProposalReviewer(compaignID) {
    return this.service.ApiGetMethod('HiringWorker/getProposalReviewer?compaignID=' + compaignID);
  }
  SubmitAnswer(obj): any {
    return this.service.ApiPostMethod('HiringWorker/SubmitAnswer', obj);
  }
  PaymentClient(obj): any {
    return this.service.ApiPostMethod('HiringWorker/PaymentClient', obj);
  }
  postPayment(obj): any {
    return this.service.ApiPostMethod('HiringWorker/Payment', obj);
  }
  updateCompaignInfo(obj): any {
    return this.service.ApiPostMethod('HiringWorker/updateCompaignInfo', obj);
  }
  saveContractForm(obj): any {
    return this.service.ApiPostMethod('HiringWorker/saveContractForm', obj);
  }
  GetContractLists(obj): any {
    return this.service.ApiPostMethod('HiringWorker/GetContractLists', obj);
  }
  GetContractClient(obj): any {
    return this.service.ApiPostMethod('HiringWorker/GetContractClient', obj);
  }
  UpdateContractStatus(obj): any {
    return this.service.ApiPostMethod('HiringWorker/UpdateContractStatus', obj);
  }
  saveSaleSubmited(obj): any {
    return this.service.ApiPostMethod('HiringWorker/saveSaleSubmited', obj);
  }
  updateSaleSubmitedStatus(obj): any {
    return this.service.ApiPostMethod('HiringWorker/updateSaleSubmitedStatus', obj);
  }
  GetOnGoingCompaignDDL(obj): any {
    return this.service.ApiPostMethod('HiringWorker/GetOnGoingCompaignDDL', obj);
  }
  GetOnGoingDDLClient(obj): any {
    return this.service.ApiPostMethod('HiringWorker/GetOnGoingDDLClient', obj);
  }
  updateProposalStatus(obj): any {
    return this.service.ApiPostMethod('HiringWorker/updateProposalStatus', obj);
  }
  CheckPayment(obj): any {
    return this.service.ApiPostMethod('HiringWorker/CheckPayment', obj);
  }
  StatusContractChange(obj): any {
    return this.service.ApiPostMethod('HiringWorker/StatusContractChange', obj);
  }
  FeedbackContract(obj): any {
    return this.service.ApiPostMethod('HiringWorker/FeedbackContract', obj);
  }
  ShowFeedBack(obj): any {
    return this.service.ApiPostMethod('HiringWorker/ShowFeedBack', obj);
  }
  GetActiveNotifications(userId) {
    return this.service.ApiGetMethod('HiringWorker/GetActiveNotifications?userId=' + userId);
  }
  GetAllNotifications(userId) {
    return this.service.ApiGetMethod('HiringWorker/GetAllNotifications?userId=' + userId);
  }
  UpdateWizardStep(userId) {
    return this.service.ApiGetMethod('HiringWorker/UpdateWizardStep?userId=' + userId);
  }
  sendChatNotification(obj): any {
    return this.service.ApiPostMethod('HiringWorker/sendChatNotification', obj);
  }
  GetAllNotificationsList(userId) {
    return this.service.ApiGetMethod('HiringWorker/GetAllNotificationsList?userId=' + userId);
  }
  starRateInsert(obj): any {
    return this.service.ApiPostMethod('HiringWorker/starRateInsert',obj);
  }
  starRateGet(obj): any {
    return this.service.ApiPostMethod('HiringWorker/starRateGet', obj);
  }
  deleteCompaignInfo(id) {
    return this.service.ApiGetMethod('HiringWorker/deleteCompaignInfo?compaignID='+ id);
  }
  UserProposals(obj): any {
    return this.service.ApiPostMethod('HiringWorker/UserProposals', obj);
  }
}
