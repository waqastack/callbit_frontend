import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class CompaignService {


  constructor(private service: GenericService,private http:HttpClient) { }

  postCompaign(compaign){
    return this.service.ApiPostMethod('Compaign/post',compaign);
  }
  getAllCompaign(){
    return this.service.ApiGetMethod('Compaign/getAll');
  }
  getSingleCompaign(id){
    return this.service.ApiGetMethod('Compaign/getSingle?id='+id);
  }
  GetLoginUserCompaign(obj):any {
    return this.service.ApiPostMethod('Compaign/GetLoginUserCompaign',obj);
  }
  SubmitProposal(data) {
    return this.service.ApiPostMethod('Compaign/SubmitProposal', data);
  }
  getProposalsDetails(id){
    return this.service.ApiGetProposal('Compaign/GetProposalDetails?id='+id);
  }
  getProposalsDetailss(id){
    return this.service.ApiGetProposals('Compaign/GetProposalDetails?id='+id);
  }
  getUserEmail(id) {
    return this.service.ApiGetProposals('Admin/getSingleUserData?id=' + id);
  }


  getLocation(){
    return this.http.get('https://ipinfo.io/geo?token=1f3d6b3d65774b');
  }
  getProfileInfo(id) {
    return this.service.ApiGetMethod('Compaign/getProfileInfo?id=' + id);
  }
  addKeyword(obj):any {
    return this.service.ApiPostMethod('HiringWorker/addKeyword',obj);
  }
  SearchKeyword(id) {
    return this.service.ApiGetMethod('HiringWorker/SearchKeyword?keyword=' + id);
  }
  CheckAlreadyProposal(obj): any {
    return this.service.ApiPostMethod('Compaign/CheckAlreadyProposal', obj);
  }
  ChangeCampaignStatus(obj): any {
    return this.service.ApiPostMethod('HiringWorker/ChangeCampaignStatus', obj);
  }
  SearchCampaignOnChange(name) {
    return this.service.ApiGetMethod('HiringWorker/SearchCampaignOnChange?camapignTitle=' + name);
  }
}
